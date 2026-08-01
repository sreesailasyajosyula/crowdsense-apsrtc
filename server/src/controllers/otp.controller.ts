import type { Request, Response, NextFunction } from 'express';
import { getFirebaseAuth } from '../config/firebaseAdmin.js';
import { generateOtp, verifyOtpCode } from '../services/otp.service.js';
import { AppError } from '../middleware/errorHandler.js';

function toE164(mobile10Digit: string): string {
  return `+91${mobile10Digit}`;
}

/**
 * POST /api/auth/otp/send
 * body: { mobile: "9876543210" }
 *
 * NOTE: This is a free, simulated-SMS OTP system (no real SMS provider
 * wired in yet). The code is returned directly in the response so the
 * frontend can display it during development/testing. Swap this out for
 * a real SMS API later without touching anything else — just stop
 * returning `devOtp` and call your SMS provider here instead.
 */
export async function sendOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const mobile = String(req.body?.mobile ?? '').trim();
    if (!/^\d{10}$/.test(mobile)) {
      throw new AppError('Enter a valid 10-digit mobile number.', 400);
    }

    const phoneNumber = toE164(mobile);
    const code = await generateOtp(phoneNumber);

    res.json({
      message: 'OTP generated.',
      expiresInSeconds: 5 * 60,
      // Dev-mode only: remove this field once a real SMS provider is wired in.
      devOtp: code,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/otp/verify
 * body: { mobile: "9876543210", code: "482913" }
 * Returns a Firebase custom token; the frontend signs in with it via
 * `signInWithCustomToken`, giving a real Firebase Auth session.
 */
export async function verifyOtpAndIssueToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const mobile = String(req.body?.mobile ?? '').trim();
    const code = String(req.body?.code ?? '').trim();

    if (!/^\d{10}$/.test(mobile)) throw new AppError('Invalid mobile number.', 400);
    if (!/^\d{6}$/.test(code)) throw new AppError('Invalid OTP format.', 400);

    const phoneNumber = toE164(mobile);
    await verifyOtpCode(phoneNumber, code);

    const uid = `phone_${mobile}`;
    const customToken = await getFirebaseAuth().createCustomToken(uid, { phoneNumber });

    res.json({ customToken });
  } catch (err) {
    next(err);
  }
}
