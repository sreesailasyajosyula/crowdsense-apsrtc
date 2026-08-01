import { Router } from 'express';
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js';
import {
  addJourney,
  listMyJourneys,
  removeJourney,
  dashboardStats,
} from '../controllers/journey.controller.js';

const router = Router();

router.use(verifyFirebaseToken);

router.post('/', addJourney);
router.get('/mine', listMyJourneys);
router.delete('/:id', removeJourney);
router.get('/dashboard-stats', dashboardStats);

export default router;
