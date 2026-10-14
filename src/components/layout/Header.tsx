import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Zap,
  ShieldCheck,
  Bot,
  Sparkles,
  Layers,
  FlaskConical,
  User as UserIcon,
  LogOut,
  ChevronDown,
  UserCheck,
  Home,
} from 'lucide-react';
import { OperatingMode, ViewState } from '../../types';

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle }) => {
  const {
    operatingMode,
    setOperatingMode,
    toggleAiPanel,
    profile,
    activeTab,
    setActiveTab,
    viewState,
    setViewState,
    user,
    isAuthenticated,
    isDemoMode,
    exitDemoMode,
    logout,
    openAuthModal,
  } = useApp();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debug state controls: accessible ONLY in dev environment when explicit debug flag is set and not in demo mode
  const isDebugEnvironment =
    Boolean(import.meta.env.DEV) &&
    !isDemoMode &&
    typeof window !== 'undefined' &&
    (new URLSearchParams(window.location.search).has('debug') ||
      localStorage.getItem('careeros_debug') === 'true');

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className="mobile-menu-btn"
          onClick={onMobileMenuToggle}
          title="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>

        {/* Top-Level Mode Selector */}
        <div className="mode-selector-wrap" title="CareerOS Operating Mode">
          <button
            className={`mode-btn ${operatingMode === 'auto' ? 'active mode-auto' : ''}`}
            onClick={() => setOperatingMode('auto' as OperatingMode)}
            title="Auto Apply: AI automatically evaluates and applies to matching jobs meeting user safety rules"
          >
            <Zap size={14} />
            <span>Auto Apply</span>
          </button>
          <button
            className={`mode-btn ${operatingMode === 'approval' ? 'active mode-approval' : ''}`}
            onClick={() => setOperatingMode('approval' as OperatingMode)}
            title="Approval Mode: AI prepares truthful applications, awaiting your review before submission"
          >
            <ShieldCheck size={14} />
            <span>Approval</span>
          </button>
          <button
            className={`mode-btn ${operatingMode === 'coach' ? 'active mode-coach' : ''}`}
            onClick={() => setOperatingMode('coach' as OperatingMode)}
            title="Coach Mode: AI prioritizes skill gaps, personalized learning roadmaps, and interview drills"
          >
            <Bot size={14} />
            <span>Coach</span>
          </button>
        </div>

        {/* Authenticated Workspace Indicator */}
        {isAuthenticated && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#065f46',
              padding: '0.28rem 0.7rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.74rem',
              fontWeight: 600,
            }}
            title="Authenticated User Session: Custom profile, resume upload, and isolated IndexedDB storage active."
          >
            <UserCheck size={13} />
            <span>Authenticated Workspace</span>
          </div>
        )}
      </div>

      <div className="header-right">
        {/* Verification ViewState Switcher (Developer / Debug environment only) */}
        {isDebugEnvironment && (
          <div className="state-switcher" title="Simulate View States for UX verification (Debug Environment)">
            <span className="state-switcher-label">
              <Layers size={11} style={{ display: 'inline', marginRight: '3px' }} /> State:
            </span>
            {(['normal', 'loading', 'empty', 'error'] as ViewState[]).map((state) => (
              <button
                key={state}
                className={`state-btn ${viewState === state ? 'active' : ''}`}
                onClick={() => setViewState(state)}
              >
                {state.charAt(0).toUpperCase() + state.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* AI Assistant Drawer Trigger */}
        <button
          className="ai-trigger-btn"
          onClick={toggleAiPanel}
          title="Open AI Career Orchestrator Panel"
        >
          <span className="ai-pulse-dot" />
          <Sparkles size={15} />
          <span>AI Assistant</span>
        </button>

        {/* User Account & Dropdown */}
        <div className="user-profile-badge-wrap" ref={dropdownRef} style={{ position: 'relative' }}>
          <div
            className="user-profile-badge"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <div className="user-avatar-sm">
              {profile.name
                ? profile.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                : 'U'}
            </div>
            <span className="user-name-sm">{profile.name || user?.name || 'My Account'}</span>
            <ChevronDown size={13} color="var(--text-muted)" />
          </div>

          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                width: '240px',
                background: '#ffffff',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-medium)',
                padding: '0.5rem',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
              }}
            >
              <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-main)' }}>
                  {profile.name || user?.name}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  {profile.email || user?.email}
                </div>
                <div style={{ fontSize: '0.68rem', color: isDemoMode ? '#d97706' : 'var(--ai-primary)', marginTop: '0.2rem', fontWeight: 600 }}>
                  {isAuthenticated ? 'Active User Account' : 'Demo Sandbox (Alex Rivera)'}
                </div>
              </div>

              {isDemoMode && activeTab !== 'dashboard' && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setActiveTab('dashboard');
                    setDropdownOpen(false);
                  }}
                  style={{ width: '100%', justifyContent: 'flex-start', border: 'none', background: 'transparent' }}
                >
                  <Home size={14} /> Back to Demo Home
                </button>
              )}

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setActiveTab('profile');
                  setDropdownOpen(false);
                }}
                style={{ width: '100%', justifyContent: 'flex-start', border: 'none', background: 'transparent' }}
              >
                <UserIcon size={14} /> My Profile Details
              </button>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  openAuthModal();
                  setDropdownOpen(false);
                }}
                style={{ width: '100%', justifyContent: 'flex-start', border: 'none', background: 'transparent' }}
              >
                <Sparkles size={14} color="var(--ai-primary)" />
                {isAuthenticated ? 'Switch / New Account' : 'Sign In / Register Account'}
              </button>

              {isDemoMode && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    exitDemoMode();
                    setDropdownOpen(false);
                  }}
                  style={{ width: '100%', justifyContent: 'flex-start', border: 'none', background: 'transparent', color: 'var(--color-error)' }}
                >
                  <LogOut size={14} /> Exit Demo Mode
                </button>
              )}

              {isAuthenticated && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                  style={{ width: '100%', justifyContent: 'flex-start', border: 'none', background: 'transparent', color: 'var(--color-error)' }}
                >
                  <LogOut size={14} /> Sign Out
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
