import { FieldValue } from 'firebase-admin/firestore';
import { getDb } from '../config/firebaseAdmin.js';
import { USERS_COLLECTION, type UserDoc } from '../models/user.model.js';

const adminNumbers = (process.env.ADMIN_PHONE_NUMBERS ?? '')
  .split(',')
  .map((n) => n.trim())
  .filter(Boolean);

/**
 * Called right after a passenger logs in via Firebase Phone Auth.
 * Creates a Firestore user record on first login, otherwise just
 * bumps lastLogin. Returns the up-to-date user document.
 */
export async function syncUserOnLogin(params: {
  uid: string;
  phoneNumber: string;
  preferredLanguage?: 'en' | 'te';
}) {
  const db = getDb();
  const ref = db.collection(USERS_COLLECTION).doc(params.uid);
  const snap = await ref.get();

  const isAdmin = adminNumbers.includes(params.phoneNumber);

  if (!snap.exists) {
    const newUser: Omit<UserDoc, 'createdAt' | 'lastLogin'> & {
      createdAt: FirebaseFirestore.FieldValue;
      lastLogin: FirebaseFirestore.FieldValue;
    } = {
      uid: params.uid,
      phoneNumber: params.phoneNumber,
      name: null,
      preferredLanguage: params.preferredLanguage ?? 'en',
      isAdmin,
      createdAt: FieldValue.serverTimestamp(),
      lastLogin: FieldValue.serverTimestamp(),
    };
    await ref.set(newUser);
  } else {
    await ref.update({
      lastLogin: FieldValue.serverTimestamp(),
      isAdmin, // keep in sync in case ADMIN_PHONE_NUMBERS changed
    });
  }

  const finalSnap = await ref.get();
  return finalSnap.data() as UserDoc;
}

export async function getUserByUid(uid: string) {
  const db = getDb();
  const snap = await db.collection(USERS_COLLECTION).doc(uid).get();
  return snap.exists ? (snap.data() as UserDoc) : null;
}

export async function updateUserProfile(
  uid: string,
  updates: Partial<Pick<UserDoc, 'name' | 'preferredLanguage'>>
) {
  const db = getDb();
  await db.collection(USERS_COLLECTION).doc(uid).update(updates);
  return getUserByUid(uid);
}
