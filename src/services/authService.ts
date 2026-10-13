import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
  type User as FirebaseUser,
  linkWithPopup,
} from 'firebase/auth';
import { auth, googleProvider, checkFirebaseConfig } from '../lib/firebase.ts';
import { syncUserAccountDoc } from './firestoreService.ts';
import type { User } from '../types';

export interface PhoneValidationResult {
  isValid: boolean;
  formattedNumber: string;
  cleanNumber: string;
  error?: string;
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

class AuthService {
  private confirmationResult: ConfirmationResult | null = null;
  private recaptchaVerifier: RecaptchaVerifier | null = null;
  private currentUser: User | null = null;
  private authStatus: AuthStatus = 'loading';
  private listeners: Array<(user: User | null, status: AuthStatus) => void> = [];
  private lastOtpSentAt: number = 0;
  private otpCooldownSeconds: number = 30;

  constructor() {
    this.initFirebaseAuthState();
  }

  private initFirebaseAuthState() {
    if (!auth) {
      this.authStatus = 'unauthenticated';
      this.currentUser = null;
      this.notify();
      return;
    }

    onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const user = this.mapFirebaseUserToCareerOSUser(firebaseUser);
          this.currentUser = user;
          this.authStatus = 'authenticated';

          // Sync verified account document in Firestore users/{uid}
          try {
            await syncUserAccountDoc(firebaseUser.uid, {
              displayName: firebaseUser.displayName || undefined,
              email: firebaseUser.email || undefined,
              phoneNumber: firebaseUser.phoneNumber || undefined,
              photoURL: firebaseUser.photoURL || undefined,
              authProvider: firebaseUser.providerData[0]?.providerId === 'google.com' ? 'google' : 'phone',
            });
          } catch (syncErr) {
            console.warn('Could not sync user document to Firestore (check rules or credentials):', syncErr);
          }
        } catch (err) {
          console.error('Error processing Firebase user:', err);
          this.currentUser = null;
          this.authStatus = 'unauthenticated';
        }
      } else {
        this.currentUser = null;
        this.authStatus = 'unauthenticated';
      }
      this.notify();
    });
  }

  private mapFirebaseUserToCareerOSUser(fUser: FirebaseUser): User {
    const isGoogle = fUser.providerData.some((p) => p.providerId === 'google.com');
    const isPhone = fUser.providerData.some((p) => p.providerId === 'phone');

    return {
      id: fUser.uid,
      name: fUser.displayName || (fUser.phoneNumber ? `User (${fUser.phoneNumber.slice(-4)})` : 'CareerOS User'),
      email: fUser.email || undefined,
      phoneNumber: fUser.phoneNumber || undefined,
      avatarUrl: fUser.photoURL || undefined,
      authProvider: isGoogle ? 'google' : isPhone ? 'phone' : 'google',
      createdAt: fUser.metadata.creationTime || new Date().toISOString(),
      isDemo: false,
    };
  }

  public subscribe(callback: (user: User | null, status: AuthStatus) => void): () => void {
    this.listeners.push(callback);
    callback(this.currentUser, this.authStatus);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.currentUser, this.authStatus));
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public getAuthStatus(): AuthStatus {
    return this.authStatus;
  }

  public isAuthenticated(): boolean {
    return this.authStatus === 'authenticated' && !!this.currentUser;
  }

  // ==========================================
  // GOOGLE AUTHENTICATION
  // ==========================================

  public async loginWithGoogle(): Promise<User> {
    const configCheck = checkFirebaseConfig();
    if (!configCheck.isConfigured || !auth) {
      throw new Error(
        `Firebase is not configured. Missing environment variables: ${configCheck.missingKeys.join(
          ', '
        )}. Please configure them in .env before signing in with Google.`
      );
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = this.mapFirebaseUserToCareerOSUser(result.user);

      // Sync verified identity into users/{uid}
      await syncUserAccountDoc(result.user.uid, {
        displayName: result.user.displayName || undefined,
        email: result.user.email || undefined,
        phoneNumber: result.user.phoneNumber || undefined,
        photoURL: result.user.photoURL || undefined,
        authProvider: 'google',
      });

      this.currentUser = user;
      this.authStatus = 'authenticated';
      this.notify();
      return user;
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        throw new Error('Google Sign-In was cancelled before completing.');
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        throw new Error(
          'An account already exists with this email using a different sign-in method. Please sign in with that method to link your accounts.'
        );
      } else if (err.code === 'auth/popup-blocked') {
        throw new Error('The Google Sign-In popup was blocked by your browser. Please allow popups for this site.');
      }
      throw new Error(err.message || 'Failed to authenticate with Google.');
    }
  }

  // ==========================================
  // PHONE AUTHENTICATION (+91 India Default)
  // ==========================================

  public validatePhoneNumber(countryCode: string, localNumber: string): PhoneValidationResult {
    const cleanNumber = localNumber.replace(/[\s\-().]/g, '');

    if (!cleanNumber) {
      return {
        isValid: false,
        cleanNumber: '',
        formattedNumber: '',
        error: 'Phone number cannot be empty.',
      };
    }

    if (!/^\d+$/.test(cleanNumber)) {
      return {
        isValid: false,
        cleanNumber,
        formattedNumber: '',
        error: 'Phone number must contain digits only.',
      };
    }

    if (countryCode === '+91') {
      if (cleanNumber.length !== 10) {
        return {
          isValid: false,
          cleanNumber,
          formattedNumber: '',
          error: `Indian mobile numbers must be exactly 10 digits (currently ${cleanNumber.length}).`,
        };
      }
      if (!/^[6-9]/.test(cleanNumber)) {
        return {
          isValid: false,
          cleanNumber,
          formattedNumber: '',
          error: 'Indian mobile numbers must start with 6, 7, 8, or 9.',
        };
      }
      return {
        isValid: true,
        cleanNumber,
        formattedNumber: `+91${cleanNumber}`,
      };
    }

    // International numbers: 7 to 15 digits according to E.164
    if (cleanNumber.length < 7 || cleanNumber.length > 15) {
      return {
        isValid: false,
        cleanNumber,
        formattedNumber: '',
        error: 'International phone numbers must be between 7 and 15 digits.',
      };
    }

    return {
      isValid: true,
      cleanNumber,
      formattedNumber: `${countryCode}${cleanNumber}`,
    };
  }

  public setupRecaptchaVerifier(containerId: string): RecaptchaVerifier {
    if (!auth) {
      throw new Error('Firebase Auth is not initialized. Please verify configuration.');
    }

    if (this.recaptchaVerifier) {
      try {
        this.recaptchaVerifier.clear();
      } catch {
        // ignore cleanup error
      }
      this.recaptchaVerifier = null;
    }

    this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved - will proceed with phone auth
      },
      'expired-callback': () => {
        console.warn('reCAPTCHA expired. Resetting verifier.');
      },
    });

    return this.recaptchaVerifier;
  }

  public async sendPhoneOTP(
    countryCode: string,
    localNumber: string,
    recaptchaContainerId: string = 'recaptcha-container'
  ): Promise<{ success: boolean; cooldownSeconds: number }> {
    const configCheck = checkFirebaseConfig();
    if (!configCheck.isConfigured || !auth) {
      throw new Error(
        `Firebase is not configured. Missing environment variables: ${configCheck.missingKeys.join(
          ', '
        )}. Please configure them in .env before using Phone Authentication.`
      );
    }

    const validation = this.validatePhoneNumber(countryCode, localNumber);
    if (!validation.isValid) {
      throw new Error(validation.error || 'Invalid phone number.');
    }

    // Cooldown check (30 seconds)
    const now = Date.now();
    const elapsed = Math.floor((now - this.lastOtpSentAt) / 1000);
    if (elapsed < this.otpCooldownSeconds) {
      const remaining = this.otpCooldownSeconds - elapsed;
      throw new Error(`Please wait ${remaining}s before requesting a new OTP.`);
    }

    const verifier = this.setupRecaptchaVerifier(recaptchaContainerId);

    try {
      this.confirmationResult = await signInWithPhoneNumber(auth, validation.formattedNumber, verifier);
      this.lastOtpSentAt = Date.now();
      return {
        success: true,
        cooldownSeconds: this.otpCooldownSeconds,
      };
    } catch (err: any) {
      if (this.recaptchaVerifier) {
        try {
          this.recaptchaVerifier.clear();
        } catch {
          // ignore
        }
        this.recaptchaVerifier = null;
      }

      if (err.code === 'auth/invalid-phone-number') {
        throw new Error('The provided phone number is invalid. Please check the digits.');
      } else if (err.code === 'auth/too-many-requests') {
        throw new Error('Too many attempts. For security, SMS sending is temporarily paused. Please try again later.');
      } else if (err.code === 'auth/quota-exceeded') {
        throw new Error('Daily SMS quota for this project has been exceeded. Please use Google Sign-In.');
      } else if (err.code === 'auth/captcha-check-failed') {
        throw new Error('reCAPTCHA verification failed. Please try again.');
      }
      throw new Error(err.message || 'Failed to send OTP to the provided phone number.');
    }
  }

  public async verifyPhoneOTP(otpCode: string): Promise<User> {
    if (!this.confirmationResult) {
      throw new Error('No pending OTP request found. Please request an OTP first.');
    }

    const cleanOTP = otpCode.trim();
    if (!cleanOTP || cleanOTP.length !== 6 || !/^\d{6}$/.test(cleanOTP)) {
      throw new Error('Please enter a valid 6-digit numerical OTP code.');
    }

    try {
      const userCredential = await this.confirmationResult.confirm(cleanOTP);
      const firebaseUser = userCredential.user;

      const user = this.mapFirebaseUserToCareerOSUser(firebaseUser);

      // Sync verified account document in Firestore users/{uid}
      await syncUserAccountDoc(firebaseUser.uid, {
        phoneNumber: firebaseUser.phoneNumber || undefined,
        authProvider: 'phone',
      });

      this.currentUser = user;
      this.authStatus = 'authenticated';
      this.confirmationResult = null;
      this.notify();
      return user;
    } catch (err: any) {
      if (err.code === 'auth/invalid-verification-code') {
        throw new Error('Incorrect OTP code. Please double-check the 6 digits and try again.');
      } else if (err.code === 'auth/code-expired') {
        throw new Error('The OTP code has expired. Please request a new verification code.');
      }
      throw new Error(err.message || 'Failed to verify OTP code.');
    }
  }

  // ==========================================
  // ACCOUNT / PROVIDER LINKING
  // ==========================================

  public async linkGoogleAccount(): Promise<User> {
    if (!auth || !auth.currentUser) {
      throw new Error('No authenticated user session found to link.');
    }

    try {
      const result = await linkWithPopup(auth.currentUser, googleProvider);
      const updatedUser = this.mapFirebaseUserToCareerOSUser(result.user);
      this.currentUser = updatedUser;
      this.notify();
      return updatedUser;
    } catch (err: any) {
      if (err.code === 'auth/credential-already-in-use') {
        throw new Error('This Google account is already linked to another CareerOS profile.');
      }
      throw new Error(err.message || 'Failed to link Google account.');
    }
  }

  // ==========================================
  // LOGOUT
  // ==========================================

  public async logout(): Promise<void> {
    if (auth) {
      await signOut(auth);
    }
    this.currentUser = null;
    this.authStatus = 'unauthenticated';
    this.confirmationResult = null;
    this.notify();
  }
}

export const authService = new AuthService();
