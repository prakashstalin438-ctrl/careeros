import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Home, LogIn, LogOut } from 'lucide-react';

export const DemoModeBanner: React.FC = () => {
  const { isDemoMode, activeTab, setActiveTab, openAuthModal, exitDemoMode } = useApp();

  if (!isDemoMode) return null;

  return (
    <div
      style={{
        background: '#090d16',
        color: '#ffffff',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '0.35rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        fontSize: '0.78rem',
        zIndex: 40,
        flexShrink: 0,
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
      }}
    >
      {/* Left: Tasteful Demo Indicator & Candidate Context */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(99, 102, 241, 0.18)',
            border: '1px solid rgba(129, 140, 248, 0.35)',
            color: '#c7d2fe',
            fontWeight: 700,
            fontSize: '0.68rem',
            padding: '0.18rem 0.55rem',
            borderRadius: 'var(--radius-full)',
            letterSpacing: '0.04em',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#34d399',
              boxShadow: '0 0 6px rgba(52, 211, 153, 0.8)',
              display: 'inline-block',
            }}
          />
          <span>DEMO MODE</span>
        </div>

        <div style={{ color: '#cbd5e1', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
          <span>Sample Candidate: <strong style={{ color: '#ffffff' }}>Alex Rivera</strong></span>
          <span style={{ color: '#475569' }}>•</span>
          <span style={{ color: '#94a3b8' }}>Lead Gen AI Engineer</span>
          <span style={{ color: '#475569' }}>•</span>
          <span style={{ color: '#38bdf8', fontWeight: 500 }}>No login required</span>
        </div>
      </div>

      {/* Right: Quick Demo Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        {activeTab !== 'dashboard' && (
          <button
            onClick={() => setActiveTab('dashboard')}
            className="btn btn-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              padding: '0.22rem 0.65rem',
              fontSize: '0.74rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
            title="Return to the main Career Intelligence Dashboard"
          >
            <Home size={12} />
            <span>Back to Demo Home</span>
          </button>
        )}

        <button
          onClick={openAuthModal}
          className="btn btn-sm"
          style={{
            background: 'var(--ai-gradient)',
            border: 'none',
            color: '#ffffff',
            padding: '0.24rem 0.75rem',
            fontSize: '0.74rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(99, 102, 241, 0.3)',
          }}
          title="Sign in with your Google account to create your personal Career Digital Twin"
        >
          <LogIn size={12} />
          <span>Sign In / Create Account</span>
        </button>

        <button
          onClick={exitDemoMode}
          className="btn btn-sm"
          style={{
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            color: '#94a3b8',
            padding: '0.22rem 0.55rem',
            fontSize: '0.74rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
          }}
          title="Exit Demo Mode and return to the login screen"
        >
          <LogOut size={12} />
          <span>Exit Demo</span>
        </button>
      </div>
    </div>
  );
};
