import type { Request, Response, NextFunction } from 'express';
import { getAllRouteInsights } from '../services/journey.service.js';

/** GET /api/insights/routes — public, no login required. */
export async function publicRouteInsights(_req: Request, res: Response, next: NextFunction) {
  try {
    const insights = await getAllRouteInsights();
    res.json({ insights });
  } catch (err) {
    next(err);
  }
}
