export type CrowdLevel = 'low' | 'medium' | 'high' | 'very-high';

export interface JourneyDoc {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  routeNo: string;
  from: string;
  to: string;
  time: string; // HH:MM
  seatAvailable: boolean;
  standing: boolean;
  waitingTime: number; // minutes
  crowd: CrowdLevel;
  notes: string;
  createdAt: FirebaseFirestore.Timestamp;
}

export const JOURNEYS_COLLECTION = 'journeys';
