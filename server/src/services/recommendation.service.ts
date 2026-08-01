import { Timestamp } from 'firebase-admin/firestore';
import { getDb } from '../config/firebaseAdmin.js';
import { JOURNEYS_COLLECTION, type JourneyDoc } from '../models/journey.model.js';
import {
  RECOMMENDATIONS_COLLECTION,
  type RecommendationDoc,
  type RecommendationStatus,
} from '../models/recommendation.model.js';
import { AppError } from '../middleware/errorHandler.js';

// --- Tunable rules -----------------------------------------------------
// Brief's example: "20 or more passengers report the same route during
// the same time period and the crowd score is high". These two knobs are
// exactly that rule, kept configurable via env for easier testing on a
// small dataset (real production usage should leave these at their
// defaults, or higher).
const MIN_PASSENGER_COUNT = Number(process.env.RECOMMENDATION_MIN_REPORTS) || 20;
const MIN_CROWD_SCORE = Number(process.env.RECOMMENDATION_MIN_CROWD_SCORE) || 70;
// -------------------------------------------------------------------------

function computeCrowdScore(journeys: JourneyDoc[]): number {
  if (journeys.length === 0) return 0;
  const standingRatio = journeys.filter((j) => j.standing).length / journeys.length;
  const noSeatRatio = journeys.filter((j) => !j.seatAvailable).length / journeys.length;
  const crowdWeight =
    journeys.reduce((sum, j) => {
      if (j.crowd === 'high') return sum + 1;
      if (j.crowd === 'medium') return sum + 0.5;
      return sum;
    }, 0) / journeys.length;
  return Math.round(standingRatio * 40 + noSeatRatio * 30 + crowdWeight * 30);
}

/**
 * Confidence is a simple, explainable heuristic — NOT a statistical
 * model. It rewards larger sample sizes and higher crowd scores. This is
 * intentionally isolated so it (and the rest of this rule-based engine)
 * can be swapped for a real Gemini AI call later without touching any
 * other module — see `runRecommendationEngine` below for the single
 * function that would need replacing.
 */
function computeConfidence(passengerCount: number, crowdScore: number): number {
  const volumeScore = Math.min(passengerCount, 40) * 1.2; // caps around 48
  const severityScore = crowdScore * 0.5; // caps around 50
  return Math.min(98, Math.round(volumeScore * 0.5 + severityScore));
}

function hourSlotLabel(hour: number): string {
  const fmt = (h: number) => {
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:00 ${period}`;
  };
  return `${fmt(hour)} - ${fmt((hour + 1) % 24)}`;
}

/**
 * THE RULE-BASED ENGINE.
 *
 * Groups all journeys by (route, hour-of-day), and for any group that
 * meets the two thresholds above, produces a recommendation. To replace
 * this with a Gemini AI call in the future: keep the same grouping logic
 * (or hand raw journeys to the model directly), and replace the body of
 * this function with a prompt + API call that returns the same
 * RecommendationDraft shape.
 */
interface RecommendationDraft {
  routeNo: string;
  from: string;
  to: string;
  timeSlot: string;
  crowdScore: number;
  confidencePercentage: number;
  passengerCount: number;
  standingCount: number;
  seatedCount: number;
  reason: string;
  suggestedAction: string;
}

async function runRecommendationEngine(): Promise<RecommendationDraft[]> {
  const db = getDb();
  const snap = await db.collection(JOURNEYS_COLLECTION).get();
  const journeys = snap.docs.map((d) => d.data() as JourneyDoc);

  const groups = new Map<string, JourneyDoc[]>();
  for (const j of journeys) {
    const hour = Number(j.time?.split(':')[0] ?? NaN);
    if (Number.isNaN(hour)) continue;
    const key = `${j.routeNo}|${j.from}|${j.to}|${hour}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(j);
  }

  const drafts: RecommendationDraft[] = [];

  for (const [key, list] of groups) {
    if (list.length < MIN_PASSENGER_COUNT) continue;
    const crowdScore = computeCrowdScore(list);
    if (crowdScore < MIN_CROWD_SCORE) continue;

    const hour = Number(key.split('|')[3]);
    const standingCount = list.filter((j) => j.standing).length;
    const seatedCount = list.length - standingCount;

    drafts.push({
      routeNo: list[0].routeNo,
      from: list[0].from,
      to: list[0].to,
      timeSlot: hourSlotLabel(hour),
      crowdScore,
      confidencePercentage: computeConfidence(list.length, crowdScore),
      passengerCount: list.length,
      standingCount,
      seatedCount,
      reason: `${standingCount} passengers reported standing and only ${seatedCount} passenger${seatedCount === 1 ? '' : 's'} found seats.`,
      suggestedAction: `Increase one additional APSRTC bus on Route ${list[0].routeNo} between ${hourSlotLabel(hour)}.`,
    });
  }

  return drafts.sort((a, b) => b.crowdScore - a.crowdScore);
}

/**
 * Runs the engine and upserts results into Firestore, keyed by
 * route+timeSlot so repeated runs update existing pending recommendations
 * rather than creating duplicates. Recommendations an admin already
 * approved/rejected are left untouched.
 */
export async function generateRecommendations(): Promise<RecommendationDoc[]> {
  const drafts = await runRecommendationEngine();
  const db = getDb();
  const col = db.collection(RECOMMENDATIONS_COLLECTION);
  const now = Timestamp.now();

  const results: RecommendationDoc[] = [];

  for (const draft of drafts) {
    const docId = `${draft.routeNo}_${draft.timeSlot}`.replace(/[^a-zA-Z0-9_-]/g, '');
    const ref = col.doc(docId);
    const existing = await ref.get();

    if (existing.exists && (existing.data() as RecommendationDoc).status !== 'pending') {
      // Admin already made a decision on this one — don't overwrite it.
      results.push(existing.data() as RecommendationDoc);
      continue;
    }

    const doc: RecommendationDoc = {
      id: docId,
      ...draft,
      status: 'pending',
      createdAt: existing.exists ? (existing.data() as RecommendationDoc).createdAt : now,
      updatedAt: now,
    };
    await ref.set(doc);
    results.push(doc);
  }

  return results.sort((a, b) => b.crowdScore - a.crowdScore);
}

export async function listRecommendations(): Promise<RecommendationDoc[]> {
  const db = getDb();
  const snap = await db
    .collection(RECOMMENDATIONS_COLLECTION)
    .orderBy('crowdScore', 'desc')
    .get();
  return snap.docs.map((d) => d.data() as RecommendationDoc);
}

export async function updateRecommendationStatus(
  id: string,
  status: RecommendationStatus
): Promise<RecommendationDoc> {
  const db = getDb();
  const ref = db.collection(RECOMMENDATIONS_COLLECTION).doc(id);
  const snap = await ref.get();
  if (!snap.exists) throw new AppError('Recommendation not found.', 404);

  await ref.update({ status, updatedAt: Timestamp.now() });
  const updated = await ref.get();
  return updated.data() as RecommendationDoc;
}
