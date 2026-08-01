import type { Response, NextFunction } from 'express';
import type { AuthedRequest } from '../middleware/verifyFirebaseToken.js';
import { syncUserOnLogin, getUserByUid, updateUserProfile } from '../services/user.service.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * POST /api/auth/sync
 * Called by the frontend immediately after a successful Firebase Phone OTP
 * sign-in. Creates the Firestore user record on first login, or refreshes
 * lastLogin on repeat logins.
 */
export async function syncLogin(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.uid || !req.phoneNumber) {
      throw new AppError('Token missing uid/phoneNumber', 401);
    }
    const preferredLanguage = req.body?.preferredLanguage === 'te' ? 'te' : 'en';
    const user = await syncUserOnLogin({
      uid: req.uid,
      phoneNumber: req.phoneNumber,
      preferredLanguage,
    });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

/** GET /api/auth/me */
export async function getMe(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.uid) throw new AppError('Unauthorized', 401);
    const user = await getUserByUid(req.uid);
    if (!user) throw new AppError('User not found', 404);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

/** PATCH /api/auth/me */
export async function updateMe(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.uid) throw new AppError('Unauthorized', 401);
    const { name, preferredLanguage } = req.body ?? {};
    const updates: Record<string, unknown> = {};
    if (typeof name === 'string') updates.name = name.trim().slice(0, 100);
    if (preferredLanguage === 'en' || preferredLanguage === 'te') {
      updates.preferredLanguage = preferredLanguage;
    }
    const user = await updateUserProfile(req.uid, updates);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}
