import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import {
  Building2,
  MapPin,
  Clock,
  Sparkles,
  Bookmark,
  Send,
  CheckCircle2,
  XCircle,
  ShieldAlert,
} from 'lucide-react';

export const JobDetailsModal: React.FC = () => {
  const {
    selectedJobForDetails,
    closeJobDetails,
    toggleSaveJob,
    openApplyModal,
    operatingMode,
  } = useApp();

  if (!selectedJobForDetails) return null;

  const job = selectedJobForDetails;

  return (
    <Modal
      isOpen={!!selectedJobForDetails}
      onClose={closeJobDetails}
      title="Job Intelligence & Match Breakdown"
      maxWidth="780px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Source: <strong>{job.source}</strong> (Sample Posting • Phase 1 Demo)
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => toggleSaveJob(job.id)}
            >
              <Bookmark
                size={14}
                style={{ fill: job.saved ? 'currentColor' : 'none' }}
              />
              {job.saved ? 'Saved' : 'Save Job'}
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                closeJobDetails();
                openApplyModal(job);
              }}
            >
              <Send size={14} />
              {operatingMode === 'auto'
                ? 'Auto Apply'
                : operatingMode === 'approval'
                ? 'Review & Apply'
                : 'Prepare Application'}
            </button>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Job Header Info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {job.title}
            </h2>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginTop: '0.4rem',
                fontSize: '0.86rem',
                color: 'var(--text-muted)',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, color: 'var(--text-main)' }}>
                <Building2 size={16} /> {job.company}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={15} /> {job.location} ({job.workMode})
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={15} /> {job.experience}
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {job.salary}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Posted {job.postedAt}
            </div>
          </div>
        </div>

        {/* AI Match Breakdown Box */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(139, 92, 246, 0.06) 100%)',
            border: '1px solid var(--ai-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem' }}>
              <Sparkles size={18} color="var(--ai-primary)" />
              <span>AI Match Intelligence</span>
            </div>
            <Badge variant="ai" className="btn-sm" style={{ fontSize: '0.85rem', fontWeight: 800 }}>
              {job.matchScore}% Affinity
            </Badge>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
            {job.matchReasoning}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065f46', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle2 size={14} /> Matching Verified Skills ({job.matchingSkills.length})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {job.matchingSkills.map((s, idx) => (
                  <Badge key={idx} variant="success">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#991b1b', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <XCircle size={14} /> Missing / Desired Skills ({job.missingSkills.length})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {job.missingSkills.length > 0 ? (
                  job.missingSkills.map((s, idx) => (
                    <Badge key={idx} variant="error">
                      {s}
                    </Badge>
                  ))
                ) : (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    None! Full requirement match.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Role Overview
          </h4>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {job.description}
          </p>
        </div>

        {/* Responsibilities */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Key Responsibilities
          </h4>
          <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            {job.responsibilities.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>

        {/* Required vs Preferred Skills */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Required Skills
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {job.requiredSkills.map((s, i) => (
                <Badge key={i} variant="neutral">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Preferred Skills
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {job.preferredSkills.map((s, i) => (
                <Badge key={i} variant="neutral">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Truthful Career Guarantee Notice */}
        <div
          style={{
            background: 'var(--bg-surface-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
          }}
        >
          <ShieldAlert size={16} color="var(--ai-primary)" />
          <span>
            CareerOS Principle 1: Applications are generated strictly using verified profile history. Missing skills are never fabricated.
          </span>
        </div>
      </div>
    </Modal>
  );
};
