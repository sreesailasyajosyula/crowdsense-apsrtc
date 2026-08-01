import type { Response, NextFunction } from 'express';
import type { AuthedRequest } from './verifyFirebaseToken.js';

const adminNumbers = (process.env.ADMIN_PHONE_NUMBERS ?? '')
  .split(',')
  .map((n) => n.trim())
  .filter(Boolean);

/**
 * Must run AFTER verifyFirebaseToken (needs req.phoneNumber already set).
 * Simple allow-list approach for now — swap for a Firestore `role` field
 * later if you want admins manageable without redeploying.
 */
export function verifyAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  if (!req.phoneNumber || !adminNumbers.includes(req.phoneNumber)) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}
