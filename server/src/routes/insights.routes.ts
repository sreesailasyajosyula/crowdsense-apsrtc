import { Router } from 'express';
import { publicRouteInsights } from '../controllers/insights.controller.js';

const router = Router();

// Intentionally public — no verifyFirebaseToken here. Route Insights is
// shared community data anyone can check before they even log in.
router.get('/routes', publicRouteInsights);

export default router;
