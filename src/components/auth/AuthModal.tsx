import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { checkFirebaseConfig } from '../../lib/firebase';
import {
  Sparkles,
  AlertCircle,
  Phone,
  RefreshCw,
  Edit2,
  CheckCircle2,
  ShieldCheck,
  Key,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  isFullPage?: boolean;
}

const COUNTRY_CODES = [
  { code: '+91', country: 'India (IN)', flag: '🇮🇳' },
  { code: '+1', country: 'United States / Canada (US/CA)', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom (UK)', flag: '🇬🇧' },
  { code: '+65', country: 'Singapore (SG)', flag: '🇸🇬' },
  { code: '+971', country: 'United Arab Emirates (UAE)', flag: '🇦🇪' },
  { code: '+49', country: 'Germany (DE)', flag: '🇩🇪' },
  { code: '+61', country: 'Australia (AU)', flag: '🇦🇺' },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  isFullPage = false,
}) => {
  const { loginWithGoogle, sendPhoneOTP, verifyPhoneOTP, addToast } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  // Phone Auth State
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [cooldown, setCooldown] = useState(0);

  // UI / Feedback State
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Firebase Config Check
  const firebaseStatus = checkFirebaseConfig();

  // Cooldown countdown timer
  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Reset local state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setLoading(false);
      setOtpSent(false);
      setOtpInput('');
    }
  }, [isOpen]);

  if (!isOpen && !isFullPage) return null;

  // Google OAuth Login
  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const user = await loginWithGoogle();
      addToast({
        type: 'success',
        title: 'Google Authentication Successful',
        message: `Welcome, ${user.name}! Your CareerOS profile is active.`,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Google authentication encountered an error.');
    } finally {
      setLoading(false);
    }
  };

  // Phone: Send OTP
  const handleSendOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await sendPhoneOTP(countryCode, phoneNumber, 'recaptcha-container');
      setOtpSent(true);
      setCooldown(res.cooldownSeconds);
      addToast({
        type: 'info',
        title: 'SMS Code Dispatched',
        message: `A 6-digit OTP verification code has been dispatched via SMS to ${countryCode} ${phoneNumber}.`,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Phone: Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await verifyPhoneOTP(otpInput);
      addToast({
        type: 'success',
        title: 'Phone Verified',
        message: `Welcome to CareerOS! Logged in as ${user.name}.`,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingTop: '0.25rem' }}>
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '0.25rem' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--ai-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            margin: '0 auto 0.75rem auto',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
          }}
        >
          <Sparkles size={24} />
        </div>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          CareerOS
        </h2>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '0.1rem' }}>
          AI Career Operating System
        </div>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ai-primary)', marginTop: '0.65rem' }}>
          {mode === 'login' ? 'Welcome back' : 'Create your CareerOS account'}
        </div>
      </div>

      {/* Missing Firebase Config Notice */}
      {!firebaseStatus.isConfigured && (
        <div
          style={{
            padding: '0.85rem',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: '#b45309',
            fontSize: '0.8rem',
            lineHeight: 1.45,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            <Key size={14} /> Firebase Configuration Required
          </div>
          <div>
            Please supply your Firebase credentials in <code>.env</code> (see <code>.env.example</code>).
          </div>
          <div style={{ marginTop: '0.35rem', fontSize: '0.74rem', color: '#92400e' }}>
            Missing keys: <strong>{firebaseStatus.missingKeys.join(', ')}</strong>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
            padding: '0.75rem 0.9rem',
            background: 'var(--color-error-bg)',
            border: '1px solid var(--color-error-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-error)',
            fontSize: '0.82rem',
            lineHeight: 1.45,
          }}
        >
          <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Continue with Google Button */}
      <button
        type="button"
        disabled={loading}
        onClick={handleGoogleLogin}
        className="btn"
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          background: '#ffffff',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          color: '#1f2937',
          fontWeight: 600,
          fontSize: '0.88rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-xs)',
          transition: 'all var(--transition-fast)',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = '#f9fafb';
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--ai-primary)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = '#ffffff';
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-medium)';
        }}
      >
        {/* Authentic Google Multi-colored SVG Icon */}
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Continue with Google</span>
      </button>

      {/* Divider */}
      <div style={{ position: 'relative', textAlign: 'center', margin: '0.25rem 0' }}>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'var(--border-subtle)' }} />
        <span
          style={{
            position: 'relative',
            background: isFullPage ? 'var(--bg-surface)' : '#ffffff',
            padding: '0 0.85rem',
            fontSize: '0.74rem',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            fontWeight: 600,
          }}
        >
          or
        </span>
      </div>

      {/* 2. Continue with Phone Number + OTP */}
      <div>
        {!otpSent ? (
          /* Phone Input Form */
          <form onSubmit={handleSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                Phone Number
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {/* Country Code Selector */}
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  style={{
                    width: '105px',
                    padding: '0.65rem 0.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    fontSize: '0.85rem',
                    background: 'var(--bg-surface-subtle)',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} ({c.flag})
                    </option>
                  ))}
                </select>

                {/* Local Phone Input */}
                <input
                  type="tel"
                  required
                  placeholder={countryCode === '+91' ? '10-digit mobile number' : 'Mobile number'}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    fontSize: '0.88rem',
                    outline: 'none',
                  }}
                />
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                {countryCode === '+91'
                  ? 'Default India (+91) format. Starts with 6, 7, 8, or 9.'
                  : 'International format supported.'}
              </div>
            </div>

            {/* Invisible Recaptcha Mount Point */}
            <div id="recaptcha-container"></div>

            <button
              type="submit"
              disabled={loading || !phoneNumber.trim()}
              className="btn btn-primary"
              style={{
                padding: '0.75rem 1rem',
                fontSize: '0.88rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <Phone size={15} />
              <span>{loading ? 'Sending OTP...' : 'Send OTP'}</span>
            </button>
          </form>
        ) : (
          /* OTP Verification Form */
          <form onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                background: 'var(--bg-surface-subtle)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Code sent to: </span>
                <strong style={{ color: 'var(--text-main)' }}>
                  {countryCode} {phoneNumber}
                </strong>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setOtpInput('');
                  setError(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--ai-primary)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  cursor: 'pointer',
                }}
              >
                <Edit2 size={12} /> Change
              </button>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                Enter 6-Digit OTP
              </label>
              <input
                type="text"
                maxLength={6}
                autoFocus
                required
                placeholder="• • • • • •"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  textAlign: 'center',
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  letterSpacing: '0.35em',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--ai-primary)',
                  outline: 'none',
                  background: 'var(--bg-surface)',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || otpInput.length !== 6}
              className="btn btn-primary"
              style={{
                padding: '0.75rem 1rem',
                fontSize: '0.88rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <CheckCircle2 size={16} />
              <span>{loading ? 'Verifying...' : 'Verify & Continue'}</span>
            </button>

            {/* Resend with Cooldown */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem' }}>
              {cooldown > 0 ? (
                <span style={{ color: 'var(--text-muted)' }}>
                  Resend OTP in <strong>{cooldown}s</strong>
                </span>
              ) : (
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleSendOTP()}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--ai-primary)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <RefreshCw size={12} /> Resend OTP
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      {/* Switch between Sign In and Sign Up */}
      <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', paddingTop: '0.25rem' }}>
        {mode === 'login' ? (
          <div>
            New to CareerOS?{' '}
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--ai-primary)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Create account
            </button>
          </div>
        ) : (
          <div>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--ai-primary)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Sign in
            </button>
          </div>
        )}
      </div>

      {/* Security Footer Notice */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          fontSize: '0.72rem',
          color: 'var(--text-light)',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '0.75rem',
        }}
      >
        <ShieldCheck size={13} style={{ color: 'var(--color-success)' }} />
        <span>Firebase Authentication & Firestore Security Rules Protected</span>
      </div>
    </div>
  );

  if (isFullPage) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
          padding: '1.5rem',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '440px',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)',
            border: '1px solid var(--border-subtle)',
            padding: '2rem',
          }}
        >
          {content}
        </div>
      </div>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" maxWidth="460px">
      {content}
    </Modal>
  );
};
