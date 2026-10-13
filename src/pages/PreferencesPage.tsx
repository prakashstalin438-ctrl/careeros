import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StateView } from '../components/common/StateView';
import { Badge } from '../components/common/Badge';
import {
  Save,
  Zap,
  ShieldCheck,
  Bot,
  MapPin,
  Briefcase,
  Percent,
  Plus,
  X,
} from 'lucide-react';
import { OperatingMode, WorkMode } from '../types';

export const PreferencesPage: React.FC = () => {
  const { preferences, updatePreferences, operatingMode, setOperatingMode } = useApp();

  const [targetRoles, setTargetRoles] = useState<string[]>(preferences.targetRoles);
  const [newRoleInput, setNewRoleInput] = useState('');
  const [preferredLocations, setPreferredLocations] = useState<string[]>(preferences.preferredLocations);
  const [newLocationInput, setNewLocationInput] = useState('');
  const [workModes, setWorkModes] = useState<WorkMode[]>(preferences.workModes);
  const [minimumSalary, setMinimumSalary] = useState<number>(preferences.minimumSalary);
  const [experienceLevel] = useState<string>(preferences.experienceLevel);
  const [matchThreshold, setMatchThreshold] = useState<number>(preferences.matchThreshold);
  const [dailyLimit, setDailyLimit] = useState<number>(preferences.autoApplyDailyLimit);
  const [requireVerification, setRequireVerification] = useState<boolean>(preferences.requireSkillVerification);
  const [notifyOnPrep, setNotifyOnPrep] = useState<boolean>(preferences.notifyOnApplicationPrep);

  const handleAddRole = () => {
    if (newRoleInput.trim() && !targetRoles.includes(newRoleInput.trim())) {
      setTargetRoles([...targetRoles, newRoleInput.trim()]);
      setNewRoleInput('');
    }
  };

  const handleRemoveRole = (role: string) => {
    setTargetRoles(targetRoles.filter((r) => r !== role));
  };

  const handleAddLocation = () => {
    if (newLocationInput.trim() && !preferredLocations.includes(newLocationInput.trim())) {
      setPreferredLocations([...preferredLocations, newLocationInput.trim()]);
      setNewLocationInput('');
    }
  };

  const handleRemoveLocation = (loc: string) => {
    setPreferredLocations(preferredLocations.filter((l) => l !== loc));
  };

  const toggleWorkMode = (mode: WorkMode) => {
    if (workModes.includes(mode)) {
      if (workModes.length > 1) {
        setWorkModes(workModes.filter((m) => m !== mode));
      }
    } else {
      setWorkModes([...workModes, mode]);
    }
  };

  const handleSave = () => {
    updatePreferences({
      targetRoles,
      preferredLocations,
      workModes,
      minimumSalary,
      experienceLevel,
      matchThreshold,
      autoApplyDailyLimit: dailyLimit,
      requireSkillVerification: requireVerification,
      notifyOnApplicationPrep: notifyOnPrep,
    });
  };

  return (
    <StateView
      emptyTitle="Preferences Reset"
      emptyMessage="No search preferences set. Define your target roles to guide discovery agents."
    >
      <div>
        {/* Page Header */}
        <div className="page-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ai-primary)' }}>
                Targeting & Rule Automation Settings
              </span>
              <Badge variant="ai">Mode: {operatingMode.toUpperCase()}</Badge>
            </div>
            <h1 className="page-title">Job Preferences & Targeting Rules</h1>
            <p className="page-subtitle">
              Configure parameters for the Job Discovery Agent, Matching Thresholds, and Application Automation workflows.
            </p>
          </div>
          <div className="page-actions">
            <button className="btn btn-primary btn-sm" onClick={handleSave}>
              <Save size={14} /> Save Preferences
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem' }}>
          {/* Left Column: Roles, Locations, Work Modes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Target Roles */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <Briefcase size={18} color="var(--ai-primary)" />
                  <span>Target Roles</span>
                </h3>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                CareerOS will prioritize job discovery and skill matching for these specific titles.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.85rem' }}>
                {targetRoles.map((role) => (
                  <span
                    key={role}
                    style={{
                      background: 'rgba(99, 102, 241, 0.1)',
                      color: 'var(--ai-primary)',
                      border: '1px solid rgba(99, 102, 241, 0.25)',
                      padding: '0.3rem 0.6rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    {role}
                    <X
                      size={13}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleRemoveRole(role)}
                    />
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Add target role (e.g. AI Platform Engineer)..."
                  value={newRoleInput}
                  onChange={(e) => setNewRoleInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddRole()}
                  style={{
                    flex: 1,
                    padding: '0.55rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    fontSize: '0.82rem',
                    outline: 'none',
                  }}
                />
                <button className="btn btn-secondary btn-sm" onClick={handleAddRole}>
                  <Plus size={14} /> Add
                </button>
              </div>
            </div>

            {/* Preferred Locations & Work Mode */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <MapPin size={18} color="#0284c7" />
                  <span>Locations & Work Modes</span>
                </h3>
              </div>

              {/* Work Mode Checkboxes */}
              <div style={{ marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.4rem' }}>
                  Allowed Work Modes:
                </span>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {(['Remote', 'Hybrid', 'Onsite'] as WorkMode[]).map((mode) => (
                    <label
                      key={mode}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        color: 'var(--text-main)',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={workModes.includes(mode)}
                        onChange={() => toggleWorkMode(mode)}
                      />
                      {mode}
                    </label>
                  ))}
                </div>
              </div>

              {/* Locations */}
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.4rem' }}>
                  Preferred Cities / Regions:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.85rem' }}>
                  {preferredLocations.map((loc) => (
                    <span
                      key={loc}
                      style={{
                        background: 'var(--bg-surface-subtle)',
                        color: 'var(--text-main)',
                        border: '1px solid var(--border-subtle)',
                        padding: '0.3rem 0.6rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      {loc}
                      <X
                        size={13}
                        style={{ cursor: 'pointer', color: 'var(--text-muted)' }}
                        onClick={() => handleRemoveLocation(loc)}
                      />
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Add preferred location..."
                    value={newLocationInput}
                    onChange={(e) => setNewLocationInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddLocation()}
                    style={{
                      flex: 1,
                      padding: '0.55rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-medium)',
                      fontSize: '0.82rem',
                      outline: 'none',
                    }}
                  />
                  <button className="btn btn-secondary btn-sm" onClick={handleAddLocation}>
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Compensation, Match Threshold, and Operating Mode Rules */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Thresholds & Compensation */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <Percent size={18} color="var(--ai-primary)" />
                  <span>Matching & Salary Thresholds</span>
                </h3>
              </div>

              {/* Minimum Salary */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    Minimum Target Compensation:
                  </span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    ₹{minimumSalary} LPA
                  </span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="60"
                  step="1"
                  value={minimumSalary}
                  onChange={(e) => setMinimumSalary(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--ai-primary)', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
                  <span>₹15 LPA</span>
                  <span>₹60 LPA+</span>
                </div>
              </div>

              {/* Match Threshold */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    AI Affinity Match Threshold:
                  </span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--ai-primary)' }}>
                    ≥ {matchThreshold}% Match
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="95"
                  step="5"
                  value={matchThreshold}
                  onChange={(e) => setMatchThreshold(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--ai-primary)', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
                  <span>60% (Broad Discovery)</span>
                  <span>95% (Strict Direct Fit)</span>
                </div>
              </div>
            </div>

            {/* Operating Mode Safety Rules */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <ShieldCheck size={18} color="#10b981" />
                  <span>Application Mode & Guardrails</span>
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                    Active Operating Mode:
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className={`btn btn-sm ${operatingMode === 'auto' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setOperatingMode('auto' as OperatingMode)}
                      style={{ flex: 1, fontSize: '0.76rem' }}
                    >
                      <Zap size={13} /> Auto Apply
                    </button>
                    <button
                      className={`btn btn-sm ${operatingMode === 'approval' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setOperatingMode('approval' as OperatingMode)}
                      style={{ flex: 1, fontSize: '0.76rem' }}
                    >
                      <ShieldCheck size={13} /> Approval
                    </button>
                    <button
                      className={`btn btn-sm ${operatingMode === 'coach' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setOperatingMode('coach' as OperatingMode)}
                      style={{ flex: 1, fontSize: '0.76rem' }}
                    >
                      <Bot size={13} /> Coach
                    </button>
                  </div>
                </div>

                {/* Auto Apply Daily Cap */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      Daily Application Cap:
                    </span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {dailyLimit} apps / day
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    value={dailyLimit}
                    onChange={(e) => setDailyLimit(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
                  />
                </div>

                {/* Rules Toggles */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={requireVerification}
                      onChange={(e) => setRequireVerification(e.target.checked)}
                    />
                    <span>
                      <strong>Strict Skill Verification:</strong> Never submit if any required skill is missing or unverified.
                    </span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={notifyOnPrep}
                      onChange={(e) => setNotifyOnPrep(e.target.checked)}
                    />
                    <span>
                      <strong>Draft Notification:</strong> Alert via Toast / In-app panel whenever a new application draft is prepared.
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StateView>
  );
};
