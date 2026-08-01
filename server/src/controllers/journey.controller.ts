import type { Response, NextFunction } from 'express';
import { z } from 'zod';
import type { AuthedRequest } from '../middleware/verifyFirebaseToken.js';
import {
  createJourney,
  getUserJourneys,
  deleteJourney,
  getUserDashboardStats,
} from '../services/journey.service.js';
import { AppError } from '../middleware/errorHandler.js';

const createJourneySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  routeNo: z.string().trim().min(1, 'Route number is required').max(20),
  from: z.string().trim().min(1, 'Boarding location is required').max(100),
  to: z.string().trim().min(1, 'Destination is required').max(100),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be HH:MM'),
  seatAvailable: z.boolean(),
  standing: z.boolean(),
  waitingTime: z.number().min(0).max(300),
  crowd: z.enum(['low', 'medium', 'high']),
  notes: z.string().trim().max(500).optional().default(''),
});

export async function addJourney(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.uid) throw new AppError('Unauthorized', 401);

    const parsed = createJourneySchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(parsed.error.issues[0]?.message ?? 'Invalid journey data', 400);
    }

    const journey = await createJourney({ userId: req.uid, ...parsed.data });
    res.status(201).json({ journey });
  } catch (err) {
    next(err);
  }
}

export async function listMyJourneys(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.uid) throw new AppError('Unauthorized', 401);
    const journeys = await getUserJourneys(req.uid);
    res.json({ journeys });
  } catch (err) {
    next(err);
  }
}

export async function removeJourney(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.uid) throw new AppError('Unauthorized', 401);
    const { id } = req.params;
    await deleteJourney(req.uid, id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function dashboardStats(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.uid) throw new AppError('Unauthorized', 401);
    const stats = await getUserDashboardStats(req.uid);
    res.json(stats);
  } catch (err) {
    next(err);
  }
}
