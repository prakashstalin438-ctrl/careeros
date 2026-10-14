import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

export interface FirebaseConfigStatus {
  isConfigured: boolean;
  missingKeys: string[];
  projectId?: string;
}

const sanitize = (val: unknown): string => {
  if (typeof val === 'string') {
    return val.trim();
  }
  return '';
};

// Static import.meta.env accesses allow Vite to inline variables during build
const firebaseEnvConfig = {
  apiKey:
    sanitize(import.meta.env.VITE_FIREBASE_API_KEY) ||
    sanitize((globalThis as any).process?.env?.VITE_FIREBASE_API_KEY),
  authDomain:
    sanitize(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN) ||
    sanitize((globalThis as any).process?.env?.VITE_FIREBASE_AUTH_DOMAIN),
  projectId:
    sanitize(import.meta.env.VITE_FIREBASE_PROJECT_ID) ||
    sanitize((globalThis as any).process?.env?.VITE_FIREBASE_PROJECT_ID),
  storageBucket:
    sanitize(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET) ||
    sanitize((globalThis as any).process?.env?.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId:
    sanitize(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID) ||
    sanitize((globalThis as any).process?.env?.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId:
    sanitize(import.meta.env.VITE_FIREBASE_APP_ID) ||
    sanitize((globalThis as any).process?.env?.VITE_FIREBASE_APP_ID),
  measurementId:
    sanitize(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) ||
    sanitize((globalThis as any).process?.env?.VITE_FIREBASE_MEASUREMENT_ID),
};

// Safe diagnostic logging: logs ONLY project ID, origin, and boolean presence of API key (NEVER prints key value)
if (typeof window !== 'undefined') {
  const diagnostic = {
    projectId: firebaseEnvConfig.projectId || '(none)',
    hasApiKey: Boolean(firebaseEnvConfig.apiKey),
    apiKeyLength: firebaseEnvConfig.apiKey.length,
    authDomain: firebaseEnvConfig.authDomain || '(none)',
    isConfigured: Boolean(firebaseEnvConfig.apiKey && firebaseEnvConfig.projectId),
    currentOrigin: window.location.origin,
  };
  (window as any).__CAREEROS_FIREBASE_DIAGNOSTIC__ = diagnostic;
  console.info('[CareerOS Firebase Diagnostic]', diagnostic);
}

export const getMissingFirebaseKeys = (): string[] => {
  const missing: string[] = [];
  if (!firebaseEnvConfig.apiKey) missing.push('VITE_FIREBASE_API_KEY');
  if (!firebaseEnvConfig.authDomain) missing.push('VITE_FIREBASE_AUTH_DOMAIN');
  if (!firebaseEnvConfig.projectId) missing.push('VITE_FIREBASE_PROJECT_ID');
  if (!firebaseEnvConfig.appId) missing.push('VITE_FIREBASE_APP_ID');
  return missing;
};

export const checkFirebaseConfig = (): FirebaseConfigStatus => {
  const missing = getMissingFirebaseKeys();
  return {
    isConfigured: missing.length === 0,
    missingKeys: missing,
    projectId: firebaseEnvConfig.projectId,
  };
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Initialize Firebase only when minimally valid credentials exist
if (firebaseEnvConfig.apiKey && firebaseEnvConfig.projectId) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseEnvConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error('Failed to initialize Firebase instance:', error);
  }
}

export { app, auth, db, googleProvider };
