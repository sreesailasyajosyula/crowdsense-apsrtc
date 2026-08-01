import type { Response, NextFunction } from 'express';
import type { AuthedRequest } from '../middleware/verifyFirebaseToken.js';
import {
  generateRecommendations,
  listRecommendations,
  updateRecommendationStatus,
} from '../services/recommendation.service.js';
import { AppError } from '../middleware/errorHandler.js';

export async function runEngine(_req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const recommendations = await generateRecommendations();
    res.json({ recommendations });
  } catch (err) {
    next(err);
  }
}

export async function getRecommendations(_req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const recommendations = await listRecommendations();
    res.json({ recommendations });
  } catch (err) {
    next(err);
  }
}

export async function setRecommendationStatus(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { status } = req.body ?? {};
    if (status !== 'approved' && status !== 'rejected' && status !== 'pending') {
      throw new AppError('Status must be pending, approved, or rejected.', 400);
    }
    const recommendation = await updateRecommendationStatus(req.params.id, status);
    res.json({ recommendation });
  } catch (err) {
    next(err);
  }
}
