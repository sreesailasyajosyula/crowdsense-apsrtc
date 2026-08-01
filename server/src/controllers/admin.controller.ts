import type { Response, NextFunction } from 'express';
import type { AuthedRequest } from '../middleware/verifyFirebaseToken.js';
import {
  getAllJourneysForAdmin,
  adminDeleteJourney,
  getAdminAnalytics,
} from '../services/admin.service.js';

export async function listAllJourneys(_req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const journeys = await getAllJourneysForAdmin();
    res.json({ journeys });
  } catch (err) {
    next(err);
  }
}

export async function deleteAnyJourney(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    await adminDeleteJourney(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function analytics(_req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const data = await getAdminAnalytics();
    res.json(data);
  } catch (err) {
    next(err);
  }
}
