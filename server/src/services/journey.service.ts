import { Timestamp } from 'firebase-admin/firestore';
import { getDb } from '../config/firebaseAdmin.js';
import { JOURNEYS_COLLECTION, type JourneyDoc, type CrowdLevel } from '../models/journey.model.js';
import { AppError } from '../middleware/errorHandler.js';

export interface CreateJourneyInput {
  userId: string;
  date: string;
  routeNo: string;
  from: string;
  to: string;
  time: string;
  seatAvailable: boolean;
  standing: boolean;
  waitingTime: number;
  crowd: CrowdLevel;
  notes: string;
}

export async function createJourney(input: CreateJourneyInput): Promise<JourneyDoc> {
  const db = getDb();
  const col = db.collection(JOURNEYS_COLLECTION);

  // Prevent duplicate submissions: same user, same route, same date, same time.
  const dupSnap = await col
    .where('userId', '==', input.userId)
    .where('routeNo', '==', input.routeNo)
    .where('date', '==', input.date)
    .where('time', '==', input.time)
    .limit(1)
    .get();

  if (!dupSnap.empty) {
    throw new AppError(
      'You already logged a journey for this route, date, and time.',
      409
    );
  }

  const ref = col.doc();
  const doc: JourneyDoc = {
    id: ref.id,
    ...input,
    createdAt: Timestamp.now(),
  };
  await ref.set(doc);
  return doc;
}

export async function getUserJourneys(userId: string): Promise<JourneyDoc[]> {
  const db = getDb();
  const snap = await db
    .collection(JOURNEYS_COLLECTION)
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();
  return snap.docs.map((d) => d.data() as JourneyDoc);
}

export async function deleteJourney(userId: string, journeyId: string): Promise<void> {
  const db = getDb();
  const ref = db.collection(JOURNEYS_COLLECTION).doc(journeyId);
  const snap = await ref.get();

  if (!snap.exists) {
    throw new AppError('Journey not found.', 404);
  }
  const data = snap.data() as JourneyDoc;
  if (data.userId !== userId) {
    throw new AppError('You can only delete your own journeys.', 403);
  }
  await ref.delete();
}

export interface RouteInsightSummary {
  routeNo: string;
  from: string;
  to: string;
  journeyCount: number;
  standingCount: number;
  crowdScore: number; // 0-100
  crowdLevel: CrowdLevel;
}

function computeCrowdScore(journeys: JourneyDoc[]): number {
  if (journeys.length === 0) return 0;
  const standingRatio =
    journeys.filter((j) => j.standing).length / journeys.length;
  const noSeatRatio =
    journeys.filter((j) => !j.seatAvailable).length / journeys.length;
  const crowdWeight =
    journeys.reduce((sum, j) => {
      if (j.crowd === 'high') return sum + 1;
      if (j.crowd === 'medium') return sum + 0.5;
      return sum;
    }, 0) / journeys.length;

  // Weighted blend, 0-100 scale.
  const score =
    standingRatio * 40 + noSeatRatio * 30 + crowdWeight * 30;
  return Math.round(score);
}

function scoreToLevel(score: number): CrowdLevel {
  if (score >= 75) return 'very-high';
  if (score >= 50) return 'high';
  if (score >= 25) return 'medium';
  return 'low';
}

export async function getUserDashboardStats(userId: string) {
  const journeys = await getUserJourneys(userId);

  const recentJourneys = journeys.slice(0, 5);

  const byRoute = new Map<string, JourneyDoc[]>();
  for (const j of journeys) {
    const key = j.routeNo || `${j.from}-${j.to}`;
    if (!byRoute.has(key)) byRoute.set(key, []);
    byRoute.get(key)!.push(j);
  }

  const routeInsights: RouteInsightSummary[] = Array.from(byRoute.entries())
    .map(([, list]) => {
      const score = computeCrowdScore(list);
      return {
        routeNo: list[0].routeNo,
        from: list[0].from,
        to: list[0].to,
        journeyCount: list.length,
        standingCount: list.filter((j) => j.standing).length,
        crowdScore: score,
        crowdLevel: scoreToLevel(score),
      };
    })
    .sort((a, b) => b.journeyCount - a.journeyCount)
    .slice(0, 5);

  return {
    totalJourneys: journeys.length,
    recentJourneys,
    routeInsights,
  };
}

export interface PublicRouteInsight {
  routeNo: string;
  from: string;
  to: string;
  journeyCount: number;
  crowdScore: number;
  crowdLevel: CrowdLevel;
  avgWaitingMins: number;
  peakTime: string| null // busiest reported time, HH:MM
}

const CROWD_RANK: Record<CrowdLevel, number> = {
  low: 0,
  medium: 1,
  high: 2,
  'very-high': 3,
};

/**
 * Aggregates crowd data across ALL passengers (not just one user) per
 * route, for the public Route Insights page. Anyone can view this
 * without logging in — it's the shared community data the whole point
 * of the app is built around.
 */
export async function getAllRouteInsights(): Promise<PublicRouteInsight[]> {
  const db = getDb();
  const snap = await db.collection(JOURNEYS_COLLECTION).get();
  const journeys = snap.docs.map((d) => d.data() as JourneyDoc);

  const byRoute = new Map<string, JourneyDoc[]>();
  for (const j of journeys) {
    const key = `${j.routeNo}|${j.from}|${j.to}`;
    if (!byRoute.has(key)) byRoute.set(key, []);
    byRoute.get(key)!.push(j);
  }

  const insights: PublicRouteInsight[] = Array.from(byRoute.values()).map((list) => {
    const score = computeCrowdScore(list);
    const avgWaitingMins = Math.round(
      list.reduce((sum, j) => sum + (j.waitingTime || 0), 0) / list.length
    );

    // Busiest reported time = highest individual crowd level (ties broken
    // by standing); least crowded = lowest. Simple, explainable heuristic
    // rather than full statistical time-bucketing.
    const busiest = [...list].sort((a, b) => {
      const rankDiff = CROWD_RANK[a.crowd] - CROWD_RANK[b.crowd];
      if (rankDiff !== 0) return -rankDiff;
      return Number(b.standing) - Number(a.standing);
    })[0];
    

const hasEnoughData = list.length >= 3;
return {
  routeNo: list[0].routeNo,
  to: list[0].to,
  journeyCount: list.length,
  crowdScore: score,
  crowdLevel: scoreToLevel(score),
  avgWaitingMins,
  peakTime: hasEnoughData ? busiest.time : null,
  
};
  });

  return insights.sort((a, b) => b.crowdScore - a.crowdScore);
}
