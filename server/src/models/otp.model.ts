export interface OtpDoc {
  phoneNumber: string; // E.164, e.g. +919876543210
  code: string; // 6-digit
  expiresAt: FirebaseFirestore.Timestamp;
  attempts: number;
  createdAt: FirebaseFirestore.Timestamp;
}

export const OTPS_COLLECTION = 'otps';

export const OTP_EXPIRY_MINUTES = 5;
export const MAX_OTP_ATTEMPTS = 5;
