import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { FileText, Send, Sparkles, FlaskConical } from 'lucide-react';

export const ApplyModal: React.FC = () => {
  const {
    selectedJobForApply,
    closeApplyModal,
    submitApplication,
    operatingMode,
    setActiveTab,
    resumeVersions,
    activeResumeVersion,
  } = useApp();

  const [confirmedTruthful, setConfirmedTruthful] = useState(true);
  const [notes, setNotes] = useState('');
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');

  if (!selectedJobForApply) return null;

  const job = selectedJobForApply;
  const effectiveResumeId =
    selectedResumeId || activeResumeVersion?.id || (resumeVersions.length > 0 ? resumeVersions[0].id : '');
  const chosenResume =
    resumeVersions.find((r) => r.id === effectiveResumeId) || activeResumeVersion || resumeVersions[0];

  const handleConfirmSubmit = () => {
    submitApplication(job.id, notes, chosenResume?.name);
    closeApplyModal();
    setActiveTab('applications');
  };

  const modalTitle =
    operatingMode === 'auto'
      ? 'Auto Apply Preview (Simulated Demo)'
      : operatingMode === 'approval'
      ? 'Review & Apply Package (Simulated Demo)'
      : 'Prepare Application Package (Simulated Demo)';

  const submitBtnText =
    operatingMode === 'auto'
      ? 'Auto Apply'
      : operatingMode === 'approval'
      ? 'Review & Apply'
      : 'Prepare Application';

  return (
    <Modal
      isOpen={!!selectedJobForApply}
      onClose={closeApplyModal}
      title={modalTitle}
      maxWidth="640px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', width: '100%' }}>
          <button className="btn btn-secondary btn-sm" onClick={closeApplyModal}>
            Cancel
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleConfirmSubmit}
            disabled={!confirmedTruthful}
            style={{ opacity: confirmedTruthful ? 1 : 0.6 }}
          >
            <Send size={14} />
            {submitBtnText}
          </button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Simulated Demo Disclaimer Banner */}
        <div
          style={{
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.65rem 0.85rem',
            fontSize: '0.78rem',
            color: '#92400e',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <FlaskConical size={16} style={{ flexShrink: 0 }} />
          <span>
            <strong>Phase 1 UI Sandbox:</strong> This is a simulated demonstration workflow. Submitting will record a mock application in your sample tracking board. No external API or real application is dispatched.
          </span>
        </div>
        {/* Role & Company Header */}
        <div
          style={{
            background: 'var(--bg-surface-subtle)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {job.title}
          </div>
          <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {job.company} • {job.location} • Match Score: <strong>{job.matchScore}%</strong>
          </div>
        </div>

        {/* Selected Resume Version */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Attached Resume Version
            </label>
            {resumeVersions.length > 1 && (
              <select
                value={effectiveResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                style={{
                  fontSize: '0.74rem',
                  padding: '0.2rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-medium)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                }}
              >
                {resumeVersions.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.version})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--ai-border)',
              background: 'rgba(99, 102, 241, 0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <FileText size={18} color="var(--ai-primary)" />
              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {chosenResume?.name || 'Primary_Resume.pdf'}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {chosenResume?.isPrimary ? 'Active Primary' : chosenResume?.version || 'Version'}{' '}
                  • ATS Score {chosenResume?.atsScore || 85}% • Focus: {chosenResume?.targetFocus || 'General'}
                </div>
              </div>
            </div>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#065f46',
                background: '#ecfdf5',
                padding: '0.2rem 0.5rem',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {chosenResume?.isPrimary ? 'Primary Active' : 'Attached'}
            </span>
          </div>
        </div>

        {/* AI Tailored Summary Highlights */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            <Sparkles size={14} color="var(--ai-primary)" />
            <span>AI Highlight Tailoring (Truthful Profile Matching)</span>
          </div>
          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              background: '#ffffff',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              lineHeight: 1.5,
            }}
          >
            Highlighting verified experience: <strong>CognitiveScale Systems</strong> hybrid BM25 + Qdrant RAG engine serving 40k+ daily queries, FastAPI streaming latency optimizations, and AWS ECS container orchestration.
          </div>
        </div>

        {/* Optional Custom Notes */}
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
            Application Notes / Cover Note Snippet (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Add any specific referral details or custom notes for this application..."
            style={{
              width: '100%',
              padding: '0.6rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)',
              fontSize: '0.82rem',
              fontFamily: 'inherit',
              outline: 'none',
              resize: 'none',
            }}
          />
        </div>

        {/* Truthfulness Confirmation Checkbox */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.65rem',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface-subtle)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <input
            type="checkbox"
            id="truth-check"
            checked={confirmedTruthful}
            onChange={(e) => setConfirmedTruthful(e.target.checked)}
            style={{ marginTop: '0.2rem', cursor: 'pointer' }}
          />
          <label
            htmlFor="truth-check"
            style={{ fontSize: '0.78rem', color: 'var(--text-main)', cursor: 'pointer', lineHeight: 1.4 }}
          >
            <strong>CareerOS Truthfulness Oath:</strong> I verify that all highlighted skills, projects, and work experiences represent genuine, truthful experience from my profile without fabrication.
          </label>
        </div>
      </div>
    </Modal>
  );
};
