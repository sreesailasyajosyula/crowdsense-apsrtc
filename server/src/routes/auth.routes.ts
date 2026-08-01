import { Router } from 'express';
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js';
import { syncLogin, getMe, updateMe } from '../controllers/auth.controller.js';
import { sendOtp, verifyOtpAndIssueToken } from '../controllers/otp.controller.js';

const router = Router();

// Public — these ARE the login entry point, no token exists yet.
router.post('/otp/send', sendOtp);
router.post('/otp/verify', verifyOtpAndIssueToken);

// Protected — require an already-issued Firebase ID token.
router.post('/sync', verifyFirebaseToken, syncLogin);
router.get('/me', verifyFirebaseToken, getMe);
router.patch('/me', verifyFirebaseToken, updateMe);

export default router;
