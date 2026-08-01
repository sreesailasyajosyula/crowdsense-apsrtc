import { getDb } from '../config/firebaseAdmin.js';
import { JOURNEYS_COLLECTION, type JourneyDoc } from '../models/journey.model.js';
import { USERS_COLLECTION, type UserDoc } from '../models/user.model.js';
import { AppError } from '../middleware/errorHandler.js';
import { getAllRouteInsights } from './journey.service.js';

export interface AdminJourneyRow extends JourneyDoc {
  reporterPhone: string | null;
}

/** All journeys across all users, newest first, with the reporter's phone attached. */
export async function getAllJourneysForAdmin(): Promise<AdminJourneyRow[]> {
  const db = getDb();
  const [journeysSnap, usersSnap] = await Promise.all([
    db.collection(JOURNEYS_COLLECTION).orderBy('createdAt', 'desc').get(),
    db.collection(USERS_COLLECTION).get(),
  ]);

  const phoneByUid = new Map<string, string>();
  for (const doc of usersSnap.docs) {
    const u = doc.data() as UserDoc;
    phoneByUid.set(u.uid, u.phoneNumber);
  }

  return journeysSnap.docs.map((doc) => {
    const j = doc.data() as JourneyDoc;
    return { ...j, reporterPhone: phoneByUid.get(j.userId) ?? null };
  });
}

/** Admin can delete any journey, regardless of who submitted it (e.g. spam). */
export async function adminDeleteJourney(journeyId: string): Promise<void> {
  const db = getDb();
  const ref = db.collection(JOURNEYS_COLLECTION).doc(journeyId);
  const snap = await ref.get();
  if (!snap.exists) {
    throw new AppError('Journey not found.', 404);
  }
  await ref.delete();
}

type RouteStatus = 'critical' | 'moderate' | 'normal';

function scoreToStatus(score: number): RouteStatus {
  if (score >= 70) return 'critical';
  if (score >= 40) return 'moderate';
  return 'normal';
}

const HOUR_LABELS = [
  '12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM',
  '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM',
  '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM',
];

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export async function getAdminAnalytics() {
  const db = getDb();
  const snap = await db.collection(JOURNEYS_COLLECTION).get();
  const journeys = snap.docs.map((d) => d.data() as JourneyDoc);

  const totalReports = journeys.length;
  const avgCrowdScoreRaw =
    journeys.reduce((sum, j) => {
      const val = j.crowd === 'high' ? 100 : j.crowd === 'medium' ? 50 : 0;
      return sum + val;
    }, 0) / (journeys.length || 1);
  const avgWaitingTime = Math.round(
    journeys.reduce((sum, j) => sum + (j.waitingTime || 0), 0) / (journeys.length || 1)
  );

  // Peak hour distribution — bucket every reported journey by its hour.
  const hourCounts = new Array(24).fill(0);
  for (const j of journeys) {
    const hour = Number(j.time?.split(':')[0] ?? NaN);
    if (!Number.isNaN(hour) && hour >= 0 && hour < 24) hourCounts[hour]++;
  }
  const peakHourData = HOUR_LABELS.map((label, i) => ({ hour: label, passengers: hourCounts[i] }))
    .slice(5, 23); // show 5 AM - 10 PM range, the realistic travel window

  // Weekly reports — last 7 calendar days including today.
  const today = new Date();
  const weeklyReportData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const iso = d.toISOString().slice(0, 10);
    const count = journeys.filter((j) => j.date === iso).length;
    return { day: DAY_LABELS[d.getDay()], reports: count };
  });

  const routeInsights = await getAllRouteInsights();
  const crowdByRoute = routeInsights
    .slice()
    .sort((a, b) => b.crowdScore - a.crowdScore)
    .slice(0, 8)
    .map((r) => ({ label: r.routeNo, value: r.crowdScore }));

  const priorityRoutes = routeInsights.map((r) => ({
    routeNo: r.routeNo,
    from: r.from,
    to: r.to,
    crowdScore: r.crowdScore,
    waitingTime: r.avgWaitingMins,
    status: scoreToStatus(r.crowdScore),
    peakTime: r.peakTime,
    journeyReports: r.journeyCount,
  }));

  const highPriorityCount = priorityRoutes.filter((r) => r.status === 'critical').length;

  return {
    totalReports,
    avgCrowdScore: Math.round(avgCrowdScoreRaw),
    avgWaitingTime,
    highPriorityCount,
    crowdByRoute,
    peakHourData,
    weeklyReportData,
    priorityRoutes: priorityRoutes.sort((a, b) => b.crowdScore - a.crowdScore),
  };
}
