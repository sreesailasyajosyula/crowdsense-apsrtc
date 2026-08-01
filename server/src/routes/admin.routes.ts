import { Router } from 'express';
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js';
import { verifyAdmin } from '../middleware/verifyAdmin.js';
import { listAllJourneys, deleteAnyJourney, analytics } from '../controllers/admin.controller.js';
import {
  runEngine,
  getRecommendations,
  setRecommendationStatus,
} from '../controllers/recommendation.controller.js';

const router = Router();

// Every route here requires a valid login AND admin status.
router.use(verifyFirebaseToken, verifyAdmin);

router.get('/journeys', listAllJourneys);
router.delete('/journeys/:id', deleteAnyJourney);
router.get('/analytics', analytics);

router.post('/recommendations/generate', runEngine);
router.get('/recommendations', getRecommendations);
router.patch('/recommendations/:id', setRecommendationStatus);

export default router;
