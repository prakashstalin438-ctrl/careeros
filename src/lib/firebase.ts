import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

export interface FirebaseConfigStatus {
  isConfigured: boolean;
  missingKeys: string[];
  projectId?: string;
}

const getEnvVar = (key: string): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  const proc = (globalThis as any).process;
  if (proc && proc.env && proc.env[key]) {
    return proc.env[key] as string;
  }
  return '';
};

const firebaseEnvConfig = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('VITE_FIREBASE_APP_ID'),
  measurementId: getEnvVar('VITE_FIREBASE_MEASUREMENT_ID'),
};

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
