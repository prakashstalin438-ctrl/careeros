import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StateView } from '../components/common/StateView';
import { Badge } from '../components/common/Badge';
import {
  User,
  Bell,
  Shield,
  Bot,
  Lock,
  Download,
  Trash2,
  Save,
} from 'lucide-react';
import { OperatingMode } from '../types';

export const SettingsPage: React.FC = () => {
  const {
    profile,
    operatingMode,
    setOperatingMode,
    addToast,
    user,
    isAuthenticated,
    openAuthModal,
    logout,
  } = useApp();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [appStatusAlerts, setAppStatusAlerts] = useState(true);
  const [coachReminders, setCoachReminders] = useState(true);
  const [matchStrictness, setMatchStrictness] = useState('High');
  const [aiCoachingTone, setAiCoachingTone] = useState('Senior Mentor (Rigorous)');

  const handleSaveSettings = () => {
    addToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'System and AI orchestrator preferences updated.',
    });
  };

  return (
    <StateView
      emptyTitle="Settings Unavailable"
      emptyMessage="Settings configuration is initializing."
    >
      <div>
        {/* Page Header */}
        <div className="page-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ai-primary)' }}>
                System Configuration & Preferences
              </span>
              <Badge variant="neutral">Local Sandbox</Badge>
            </div>
            <h1 className="page-title">Settings & System Preferences</h1>
            <p className="page-subtitle">
              Manage your account identity, notification rules, application operating mode, and AI agent boundaries.
            </p>
          </div>
          <div className="page-actions">
            <button className="btn btn-primary btn-sm" onClick={handleSaveSettings}>
              <Save size={14} /> Save Configuration
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem' }}>
          {/* Left Column: Account & Application Mode */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Account Profile Card */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <User size={18} color="var(--ai-primary)" />
                  <span>Account Credentials & Identity</span>
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    disabled
                    value={profile.name || user?.name || ''}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-surface-subtle)',
                      fontSize: '0.84rem',
                      color: 'var(--text-main)',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={profile.email || user?.email || ''}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-surface-subtle)',
                      fontSize: '0.84rem',
                      color: 'var(--text-main)',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                    Account Security & Session
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={openAuthModal}
                    >
                      {isAuthenticated ? 'Switch Account' : 'Sign In / Register'}
                    </button>
                    {isAuthenticated && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={logout}
                        style={{ color: 'var(--color-error)' }}
                      >
                        Sign Out
                      </button>
                    )}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-light)', marginTop: '0.4rem' }}>
                    Status: {isAuthenticated ? 'Authenticated session active. User data isolated in IndexedDB.' : 'Demo sandbox session (Alex Rivera).'}
                  </div>
                </div>
              </div>
            </div>

            {/* Default Application Mode */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <Shield size={18} color="#10b981" />
                  <span>Default Application Mode</span>
                </h3>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Determine how CareerOS acts when a job exceeds your minimum match threshold.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {[
                  {
                    id: 'approval' as OperatingMode,
                    title: 'Approval Mode (Recommended)',
                    desc: 'AI prepares tailored, truthful application packages and prompts you for review and sign-off.',
                  },
                  {
                    id: 'auto' as OperatingMode,
                    title: 'Auto Apply Mode',
                    desc: 'Dispatches truthful applications automatically to authorized partner portals according to daily safety limits.',
                  },
                  {
                    id: 'coach' as OperatingMode,
                    title: 'Coach Mode',
                    desc: 'Disables application workflows and focuses exclusively on skill gap roadmaps, practice, and interview prep.',
                  },
                ].map((mode) => (
                  <div
                    key={mode.id}
                    onClick={() => setOperatingMode(mode.id)}
                    style={{
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border:
                        operatingMode === mode.id
                          ? '2px solid var(--ai-primary)'
                          : '1px solid var(--border-subtle)',
                      background:
                        operatingMode === mode.id
                          ? 'rgba(99, 102, 241, 0.04)'
                          : 'var(--bg-surface)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.2rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-main)' }}>
                        {mode.title}
                      </span>
                      {operatingMode === mode.id && <Badge variant="ai">Active</Badge>}
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {mode.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: AI Settings & Privacy Guardrails */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* AI Agent Preferences */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <Bot size={18} color="var(--ai-primary)" />
                  <span>AI Agent Tuning & Persona</span>
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                    Career Coach Tone & Rigor:
                  </label>
                  <select
                    value={aiCoachingTone}
                    onChange={(e) => setAiCoachingTone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-medium)',
                      fontSize: '0.84rem',
                      outline: 'none',
                    }}
                  >
                    <option value="Senior Mentor (Rigorous)">Senior Mentor (Rigorous & Technical)</option>
                    <option value="Executive Coach (High Level)">Executive Coach (High Level & Strategic)</option>
                    <option value="Encouraging & Practical">Encouraging & Practical</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                    Requirement Match Strictness:
                  </label>
                  <select
                    value={matchStrictness}
                    onChange={(e) => setMatchStrictness(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-medium)',
                      fontSize: '0.84rem',
                      outline: 'none',
                    }}
                  >
                    <option value="High">Strict (Strict adherence to all mandatory qualifications)</option>
                    <option value="Balanced">Balanced (Allow minor gaps if learning plan is active)</option>
                    <option value="Exploratory">Exploratory (Include stretch roles)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <Bell size={18} color="#0284c7" />
                  <span>Notification Alerts</span>
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.84rem', cursor: 'pointer' }}>
                  <span>Application Status Changes & Interview Invites</span>
                  <input
                    type="checkbox"
                    checked={appStatusAlerts}
                    onChange={(e) => setAppStatusAlerts(e.target.checked)}
                  />
                </label>

                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.84rem', cursor: 'pointer' }}>
                  <span>Daily Job Discovery Digest (Matching ≥ 80%)</span>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                  />
                </label>

                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.84rem', cursor: 'pointer' }}>
                  <span>Daily Skill Coach & Sprint Reminders</span>
                  <input
                    type="checkbox"
                    checked={coachReminders}
                    onChange={(e) => setCoachReminders(e.target.checked)}
                  />
                </label>
              </div>
            </div>

            {/* Privacy & Agent Boundaries */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <Lock size={18} color="#d97706" />
                  <span>Privacy & Security Safeguards</span>
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <div>
                  <strong>Truthful Career Guarantee:</strong> CareerOS agents are structurally restricted from fabricating skills, credentials, or past employment history.
                </div>
                <div>
                  <strong>Agent Permission Boundaries:</strong> No external network scraping or autonomous form submission is executed outside authorized API adapters.
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() =>
                      addToast({
                        type: 'info',
                        title: 'Export Career Data',
                        message: 'Downloaded complete Career Digital Twin JSON export.',
                      })
                    }
                  >
                    <Download size={13} /> Export Data
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() =>
                      addToast({
                        type: 'warning',
                        title: 'Data Reset Guard',
                        message: 'Mock profile is read-only in Phase 1 demo.',
                      })
                    }
                    style={{ color: '#dc2626' }}
                  >
                    <Trash2 size={13} /> Purge Sandbox
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StateView>
  );
};
