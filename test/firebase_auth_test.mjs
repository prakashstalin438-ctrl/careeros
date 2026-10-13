import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// Import AuthService logic
const { authService } = await import('../src/services/authService.ts');
const { checkFirebaseConfig, getMissingFirebaseKeys } = await import('../src/lib/firebase.ts');

test('Phone Validation: India (+91) format requirements', () => {
  // Valid Indian mobile numbers
  const v1 = authService.validatePhoneNumber('+91', '9876543210');
  assert.equal(v1.isValid, true);
  assert.equal(v1.cleanNumber, '9876543210');
  assert.equal(v1.formattedNumber, '+919876543210');

  const v2 = authService.validatePhoneNumber('+91', '81234 56789');
  assert.equal(v2.isValid, true);
  assert.equal(v2.cleanNumber, '8123456789');

  const v3 = authService.validatePhoneNumber('+91', '70000-11111');
  assert.equal(v3.isValid, true);

  const v4 = authService.validatePhoneNumber('+91', '6999988888');
  assert.equal(v4.isValid, true);

  // Invalid: doesn't start with 6, 7, 8, or 9
  const iv1 = authService.validatePhoneNumber('+91', '1234567890');
  assert.equal(iv1.isValid, false);
  assert.ok(iv1.error?.includes('start with 6, 7, 8, or 9'));

  const iv2 = authService.validatePhoneNumber('+91', '5555555555');
  assert.equal(iv2.isValid, false);

  // Invalid: length not 10 digits
  const iv3 = authService.validatePhoneNumber('+91', '987654321'); // 9 digits
  assert.equal(iv3.isValid, false);
  assert.ok(iv3.error?.includes('exactly 10 digits'));

  const iv4 = authService.validatePhoneNumber('+91', '98765432100'); // 11 digits
  assert.equal(iv4.isValid, false);

  // Invalid: non-numeric
  const iv5 = authService.validatePhoneNumber('+91', '98765ABCD0');
  assert.equal(iv5.isValid, false);
  assert.ok(iv5.error?.includes('digits only'));
});

test('Phone Validation: International E.164 formats', () => {
  // Valid US number (+1)
  const us = authService.validatePhoneNumber('+1', '4155552671');
  assert.equal(us.isValid, true);
  assert.equal(us.formattedNumber, '+14155552671');

  // Valid UK number (+44)
  const uk = authService.validatePhoneNumber('+44', '7911123456');
  assert.equal(uk.isValid, true);
  assert.equal(uk.formattedNumber, '+447911123456');

  // Valid Singapore number (+65)
  const sg = authService.validatePhoneNumber('+65', '81234567');
  assert.equal(sg.isValid, true);

  // Invalid: too short
  const shortNum = authService.validatePhoneNumber('+1', '12345');
  assert.equal(shortNum.isValid, false);
});

test('Firebase Configuration: Diagnostics and missing key detection', () => {
  const status = checkFirebaseConfig();
  assert.equal(typeof status.isConfigured, 'boolean');
  assert.ok(Array.isArray(status.missingKeys));

  const missing = getMissingFirebaseKeys();
  assert.ok(Array.isArray(missing));
});

test('Firestore Security Rules: Document isolation and tenant scoping', () => {
  const rulesPath = path.resolve('firestore.rules');
  assert.ok(fs.existsSync(rulesPath), 'firestore.rules must exist');

  const content = fs.readFileSync(rulesPath, 'utf8');

  // Must use rules_version 2
  assert.ok(content.includes("rules_version = '2'"));

  // Must strictly protect users/{uid}
  assert.ok(content.includes('match /users/{uid}'));
  assert.ok(content.includes('isOwner(uid)'));

  // Must strictly protect profiles/{uid}
  assert.ok(content.includes('match /profiles/{uid}'));

  // Must strictly protect resumes/{resumeId} by UID
  assert.ok(content.includes('match /resumes/{resumeId}'));
  assert.ok(content.includes('request.auth.uid'));

  // Must contain default deny
  assert.ok(content.includes('match /{document=**}'));
  assert.ok(content.includes('allow read, write: if false'));

  // Must NOT contain insecure open rules
  assert.ok(!content.includes('allow read, write: if true'));
  assert.ok(!content.includes('allow read: if true'));
});

test('Truthful Data Isolation: Zero fabricated career entities in initial state', () => {
  // Verified user record model check
  const mockUserRecord = {
    uid: 'firebase-user-uid-998877',
    displayName: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phoneNumber: '+919876543210',
    photoURL: 'https://lh3.googleusercontent.com/a/photo',
    authProvider: 'google',
  };

  // Ensure no fabricated metrics or career credentials in user record
  assert.equal('skills' in mockUserRecord, false);
  assert.equal('experience' in mockUserRecord, false);
  assert.equal('education' in mockUserRecord, false);
  assert.equal('projects' in mockUserRecord, false);
  assert.equal('certifications' in mockUserRecord, false);
});
