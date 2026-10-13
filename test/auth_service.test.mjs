import test from 'node:test';
import assert from 'node:assert/strict';

// Set up mock localStorage
const store = new Map();
globalThis.localStorage = {
  getItem: (key) => store.get(key) || null,
  setItem: (key, val) => store.set(key, String(val)),
  removeItem: (key) => store.delete(key),
  clear: () => store.clear(),
};

// Import auth service directly
const { authService } = await import('../src/services/authService.ts');

test('Google Authentication: First login creates user and returning login loads user', async () => {
  // First Google login
  const googleProfile = {
    email: 'priya.sharma@gmail.com',
    name: 'Priya Sharma',
    avatarUrl: 'https://lh3.googleusercontent.com/a/priya-photo',
    sub: 'google-sub-100200300',
  };

  const newUser = await authService.loginWithGoogle(googleProfile);
  assert.equal(newUser.email, 'priya.sharma@gmail.com');
  assert.equal(newUser.name, 'Priya Sharma');
  assert.equal(newUser.authProvider, 'google');
  assert.equal(authService.isAuthenticated(), true);
  assert.equal(authService.getCurrentUser()?.email, 'priya.sharma@gmail.com');

  // Logout
  authService.logout();
  assert.equal(authService.isAuthenticated(), false);

  // Returning Google login: Loads existing user identity
  const returningUser = await authService.loginWithGoogle(googleProfile);
  assert.equal(returningUser.id, newUser.id);
  assert.equal(returningUser.email, 'priya.sharma@gmail.com');
  assert.equal(authService.isAuthenticated(), true);

  authService.logout();
});

test('Phone Authentication: Phone validation (+91 India and International)', () => {
  // Valid Indian numbers
  const v1 = authService.validatePhoneNumber('+91', '9876543210');
  assert.equal(v1.isValid, true);
  assert.equal(v1.cleanNumber, '9876543210');

  const v2 = authService.validatePhoneNumber('+91', '81234 56789');
  assert.equal(v2.isValid, true);

  // Invalid Indian numbers
  const iv1 = authService.validatePhoneNumber('+91', '1234567890'); // Doesn't start with 6-9
  assert.equal(iv1.isValid, false);
  assert.ok(iv1.error?.includes('start with 6, 7, 8, or 9'));

  const iv2 = authService.validatePhoneNumber('+91', '98765'); // Less than 10 digits
  assert.equal(iv2.isValid, false);

  // Valid International number
  const vUS = authService.validatePhoneNumber('+1', '4155552671');
  assert.equal(vUS.isValid, true);
});

test('Phone Authentication: Send OTP, cooldown, verification, and retry limit', async () => {
  const countryCode = '+91';
  const phone = '9876501234';

  // 1. Send OTP
  const sendRes = await authService.sendPhoneOTP(countryCode, phone);
  assert.equal(sendRes.success, true);
  assert.equal(sendRes.cooldownSeconds, 30);
  assert.equal(typeof sendRes.demoPreviewOTP, 'string');
  assert.equal(sendRes.demoPreviewOTP.length, 6);

  // 2. Cooldown: Sending another OTP immediately must be rejected
  await assert.rejects(
    async () => {
      await authService.sendPhoneOTP(countryCode, phone);
    },
    (err) => {
      return err.message.includes('Please wait') && err.message.includes('before requesting a new');
    }
  );

  // 3. Invalid OTP verification: Must be rejected and report remaining attempts
  await assert.rejects(
    async () => {
      await authService.verifyPhoneOTP(countryCode, phone, '000000');
    },
    (err) => {
      return err.message.includes('Invalid verification code') && err.message.includes('attempts remaining');
    }
  );

  // 4. Valid OTP verification: Must succeed and create/login user
  const verifiedUser = await authService.verifyPhoneOTP(countryCode, phone, sendRes.demoPreviewOTP);
  assert.equal(verifiedUser.authProvider, 'phone');
  assert.ok(verifiedUser.phoneNumber?.includes('9876501234'));
  assert.equal(authService.isAuthenticated(), true);

  // 5. Subsequent attempt on used OTP must fail
  await assert.rejects(
    async () => {
      await authService.verifyPhoneOTP(countryCode, phone, sendRes.demoPreviewOTP);
    },
    (err) => {
      return err.message.includes('No active OTP request found');
    }
  );

  authService.logout();
});

test('Phone Authentication: Rate limit locks after 3 failed attempts', async () => {
  const countryCode = '+1';
  const phone = '4155559876';

  const sendRes = await authService.sendPhoneOTP(countryCode, phone);
  assert.equal(sendRes.success, true);

  // Fail 1
  await assert.rejects(async () => authService.verifyPhoneOTP(countryCode, phone, '111111'));
  // Fail 2
  await assert.rejects(async () => authService.verifyPhoneOTP(countryCode, phone, '222222'));
  // Fail 3 -> Challenge deleted due to too many attempts
  await assert.rejects(
    async () => authService.verifyPhoneOTP(countryCode, phone, '333333'),
    (err) => err.message.includes('Too many failed attempts')
  );

  // Even the correct OTP is now rejected because challenge was locked
  await assert.rejects(
    async () => authService.verifyPhoneOTP(countryCode, phone, sendRes.demoPreviewOTP),
    (err) => err.message.includes('No active OTP request found')
  );
});

test('Session persistence: Token stored and recovered on reload', async () => {
  const email = 'alex.rivera@example.com';
  const user = await authService.login(email, 'demo1234');
  assert.equal(user.email, email);
  assert.equal(authService.isAuthenticated(), true);

  // Verify token is in localStorage
  const storedSession = JSON.parse(globalThis.localStorage.getItem('careeros_auth_session_v2'));
  assert.equal(storedSession.user.email, email);
  assert.ok(storedSession.token.startsWith('tok-'));

  authService.logout();
  assert.equal(globalThis.localStorage.getItem('careeros_auth_session_v2'), null);
});
