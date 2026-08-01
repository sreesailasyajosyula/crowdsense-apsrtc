import type { Request, Response, NextFunction } from 'express';
import { getFirebaseAuth } from '../config/firebaseAdmin.js';

export interface AuthedRequest extends Request {
  uid?: string;
  phoneNumber?: string;
}

/**
 * Expects: Authorization: Bearer <Firebase ID token>
 * The frontend gets this token from `firebase/auth` after phone OTP login
 * via `await user.getIdToken()`.
 */
export async function verifyFirebaseToken(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  const idToken = header.split('Bearer ')[1];

  try {
    const decoded = await getFirebaseAuth().verifyIdToken(idToken);
    req.uid = decoded.uid;
    // Real Firebase Phone Auth sets `phone_number`; our custom-token-based
    // OTP system sets a custom claim `phoneNumber` instead. Support both.
    req.phoneNumber = decoded.phone_number ?? (decoded as { phoneNumber?: string }).phoneNumber;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
