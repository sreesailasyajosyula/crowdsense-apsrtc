import {
  signInWithCustomToken,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth } from './firebase';

/**
 * Signs the user into Firebase using a custom token issued by our backend
 * after it verifies the OTP. This gives a real Firebase Auth session
 * (real ID tokens, works with our verifyFirebaseToken middleware) without
 * needing Firebase's paid Phone Auth product.
 */
export async function signInWithToken(customToken: string): Promise<User> {
  const credential = await signInWithCustomToken(auth, customToken);
  return credential.user;
}

export async function logOut() {
  await firebaseSignOut(auth);
}

export function watchAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function getIdToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}
