export type RecommendationStatus = 'pending' | 'approved' | 'rejected';

export interface RecommendationDoc {
  id: string;
  routeNo: string;
  from: string;
  to: string;
  timeSlot: string; // e.g. "08:00 - 09:00"
  crowdScore: number;
  confidencePercentage: number;
  passengerCount: number;
  standingCount: number;
  seatedCount: number;
  reason: string;
  suggestedAction: string;
  status: RecommendationStatus;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

export const RECOMMENDATIONS_COLLECTION = 'recommendations';
