import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  type Unsubscribe,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase.ts';
import type { UserProfile, ResumeVersion } from '../types';

export interface FirestoreUserRecord {
  uid: string;
  displayName: string;
  email?: string;
  phoneNumber?: string;
  photoURL?: string;
  authProvider: 'google' | 'phone';
  createdAt: any;
  lastLoginAt: any;
}

/**
 * Creates or synchronizes the users/{uid} root document with verified account identity.
 * Strictly adheres to CareerOS rule: Never fabricate unverified career fields.
 */
export async function syncUserAccountDoc(
  uid: string,
  data: {
    displayName?: string;
    email?: string;
    phoneNumber?: string;
    photoURL?: string;
    authProvider: 'google' | 'phone';
  }
): Promise<FirestoreUserRecord> {
  if (!db) {
    throw new Error('Firestore is not configured. Please supply Firebase credentials in .env.');
  }

  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // New User: Create minimal verified identity
    const newRecord: FirestoreUserRecord = {
      uid,
      displayName: data.displayName || (data.phoneNumber ? `User ${data.phoneNumber.slice(-4)}` : 'CareerOS Member'),
      email: data.email || '',
      phoneNumber: data.phoneNumber || '',
      photoURL: data.photoURL || '',
      authProvider: data.authProvider,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    };
    await setDoc(userRef, newRecord);

    // Also initialize an empty Career Digital Twin profile in profiles/{uid} without fabricated data
    await initEmptyProfile(uid, {
      name: newRecord.displayName,
      email: newRecord.email,
      phone: newRecord.phoneNumber,
      avatarUrl: newRecord.photoURL,
    });

    return newRecord;
  } else {
    // Returning User: Update lastLoginAt
    await updateDoc(userRef, {
      lastLoginAt: serverTimestamp(),
      ...(data.displayName ? { displayName: data.displayName } : {}),
      ...(data.photoURL ? { photoURL: data.photoURL } : {}),
    });
    return userSnap.data() as FirestoreUserRecord;
  }
}

/**
 * Initializes a pristine, truthful empty profile in profiles/{uid}.
 * Does not fabricate skills, education, experience, or certifications.
 */
export async function initEmptyProfile(
  uid: string,
  seed: { name?: string; email?: string; phone?: string; avatarUrl?: string }
): Promise<UserProfile> {
  if (!db) {
    throw new Error('Firestore is not configured.');
  }

  const profileRef = doc(db, 'profiles', uid);
  const profileSnap = await getDoc(profileRef);

  if (profileSnap.exists()) {
    return profileSnap.data() as UserProfile;
  }

  const emptyProfile: UserProfile = {
    userId: uid,
    name: seed.name || '',
    title: '',
    email: seed.email || '',
    phone: seed.phone || '',
    location: '',
    summary: '',
    avatarUrl: seed.avatarUrl || '',
    careerReadinessScore: 0,
    targetRole: '',
    targetLevel: '',
    targetIndustries: [],
    yearsExperience: 0,
    portfolioLinks: {
      github: '',
      linkedin: '',
      portfolio: '',
      huggingface: '',
    },
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
  };

  await setDoc(profileRef, emptyProfile);
  return emptyProfile;
}

/**
 * Subscribes to real-time updates for profiles/{uid}.
 * Fires immediately upon snapshot change, ensuring instant multi-device & multi-tab sync.
 */
export function subscribeToUserProfile(
  uid: string,
  onUpdate: (profile: UserProfile | null) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  if (!db) {
    onUpdate(null);
    return () => {};
  }

  const profileRef = doc(db, 'profiles', uid);
  return onSnapshot(
    profileRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.data() as UserProfile);
      } else {
        onUpdate(null);
      }
    },
    (err) => {
      console.error(`Error in profiles/${uid} real-time listener:`, err);
      if (onError) onError(err);
    }
  );
}

/**
 * Saves profile updates to profiles/{uid}.
 */
export async function saveUserProfileToFirestore(
  uid: string,
  updatedFields: Partial<UserProfile>
): Promise<void> {
  if (!db) {
    throw new Error('Firestore is not initialized.');
  }
  const profileRef = doc(db, 'profiles', uid);
  await setDoc(profileRef, { ...updatedFields, updatedAt: new Date().toISOString() }, { merge: true });
}

/**
 * Resume Versions: Store and retrieve resume versions metadata in Firestore scoped by userId
 */
export async function saveResumeVersionMetadata(
  uid: string,
  version: ResumeVersion
): Promise<void> {
  if (!db) return;
  const resumeRef = doc(db, 'resumes', version.id);
  await setDoc(resumeRef, {
    ...version,
    userId: uid,
    updatedAt: serverTimestamp(),
  });
}

export async function fetchUserResumeVersions(uid: string): Promise<ResumeVersion[]> {
  if (!db) return [];
  const q = query(collection(db, 'resumes'), where('userId', '==', uid));
  const snap = await getDocs(q);
  const versions: ResumeVersion[] = [];
  snap.forEach((docSnap) => {
    versions.push(docSnap.data() as ResumeVersion);
  });
  return versions.sort(
    (a, b) => new Date(b.uploadedAt || b.lastUpdated).getTime() - new Date(a.uploadedAt || a.lastUpdated).getTime()
  );
}

export async function deleteResumeVersionMetadata(uid: string, versionId: string): Promise<void> {
  if (!db) return;
  const resumeRef = doc(db, 'resumes', versionId);
  const snap = await getDoc(resumeRef);
  if (snap.exists() && snap.data()?.userId === uid) {
    await deleteDoc(resumeRef);
  }
}
