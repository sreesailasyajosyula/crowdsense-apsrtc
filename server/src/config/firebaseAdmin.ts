import { readFileSync } from 'node:fs';
import { initializeApp, cert, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let app: App;

function loadServiceAccount() {
  // On hosting platforms (Render, etc.) you generally can't upload a
  // secrets file — instead paste the full JSON content into an env var.
  const jsonEnv = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (jsonEnv) {
    return JSON.parse(jsonEnv);
  }

  const path = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (!path) {
    throw new Error(
      'Set either FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_PATH in your .env file.'
    );
  }
  const raw = readFileSync(path, 'utf-8');
  return JSON.parse(raw);
}

export function initFirebaseAdmin() {
  if (app) return app;

  const serviceAccount = loadServiceAccount();
  app = initializeApp({
    credential: cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });

  return app;
}

export function getFirebaseAuth() {
  if (!app) initFirebaseAdmin();
  return getAuth(app);
}

export function getDb() {
  if (!app) initFirebaseAdmin();
  return getFirestore(app);
}
