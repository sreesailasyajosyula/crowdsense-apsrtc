import { Timestamp } from 'firebase-admin/firestore';
import { getDb } from '../config/firebaseAdmin.js';
import {
  OTPS_COLLECTION,
  OTP_EXPIRY_MINUTES,
  MAX_OTP_ATTEMPTS,
  type OtpDoc,
} from '../models/otp.model.js';
import { AppError } from '../middleware/errorHandler.js';

function generateSixDigitCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Generates a fresh 6-digit code for the phone number and stores it in
 * Firestore, overwriting any previous unexpired code. Returns the plain
 * code so the caller can display it (dev-mode "simulated SMS").
 */
export async function generateOtp(phoneNumber: string): Promise<string> {
  const db = getDb();
  const code = generateSixDigitCode();
  const now = Date.now();

  const doc: OtpDoc = {
    phoneNumber,
    code,
    attempts: 0,
    createdAt: Timestamp.fromMillis(now),
    expiresAt: Timestamp.fromMillis(now + OTP_EXPIRY_MINUTES * 60 * 1000),
  };

  await db.collection(OTPS_COLLECTION).doc(phoneNumber).set(doc);
  return code;
}

/**
 * Verifies a submitted code against Firestore. Throws AppError on any
 * failure (expired, wrong code, too many attempts, none requested).
 * On success, deletes the OTP doc so it can't be reused.
 */
export async function verifyOtpCode(phoneNumber: string, code: string): Promise<void> {
  const db = getDb();
  const ref = db.collection(OTPS_COLLECTION).doc(phoneNumber);
  const snap = await ref.get();

  if (!snap.exists) {
    throw new AppError('No OTP was requested for this number. Please request a new one.', 400);
  }

  const data = snap.data() as OtpDoc;

  if (data.expiresAt.toMillis() < Date.now()) {
    await ref.delete();
    throw new AppError('OTP has expired. Please request a new one.', 400);
  }

  if (data.attempts >= MAX_OTP_ATTEMPTS) {
    await ref.delete();
    throw new AppError('Too many incorrect attempts. Please request a new OTP.', 429);
  }

  if (data.code !== code) {
    await ref.update({ attempts: data.attempts + 1 });
    throw new AppError('Incorrect OTP. Please try again.', 400);
  }

  await ref.delete();
}
