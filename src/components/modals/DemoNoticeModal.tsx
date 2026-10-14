import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Sparkles, ShieldCheck, ArrowRight, UserCheck, Info } from 'lucide-react';

export const DemoNoticeModal: React.FC = () => {
  const { demoNoticeModal, closeDemoNoticeModal, openAuthModal } = useApp();

  if (!demoNoticeModal || !demoNoticeModal.isOpen) return null;

  const { title, message, actionName, category } = demoNoticeModal;

  const getCategoryDetails = () => {
    switch (category) {
      case 'apply':
        return {
          icon: ShieldCheck,
          accentColor: '#10b981',
          bgTint: 'rgba(16, 185, 129, 0.1)',
          borderColor: 'rgba(16, 185, 129, 0.25)',
          productionDetail:
            'In production, CareerOS prepares tailored resume versions, verifies missing skills against requirements, and dispatches applications via authorized company APIs or email workflows with candidate approval.',
        };
      case 'resume':
        return {
          icon: Sparkles,
          accentColor: '#6366f1',
          bgTint: 'rgba(99, 102, 241, 0.1)',
          borderColor: 'rgba(99, 102, 241, 0.25)',
          productionDetail:
            'In production, uploaded resumes are parsed client-side with truthful entity extraction, benchmarked for ATS alignment, and saved securely into your isolated Firestore and local IndexedDB vault.',
        };
      case 'profile':
        return {
          icon: UserCheck,
          accentColor: '#0284c7',
          bgTint: 'rgba(2, 132, 199, 0.1)',
          borderColor: 'rgba(2, 132, 199, 0.25)',
          productionDetail:
            'In production, all personal details, work history, skills, and projects are synchronized in real-time with Firestore security rules to safeguard your Career Digital Twin.',
        };
      case 'ai':
        return {
          icon: Sparkles,
          accentColor: '#8b5cf6',
          bgTint: 'rgba(139, 92, 246, 0.1)',
          borderColor: 'rgba(139, 92, 246, 0.25)',
          productionDetail:
            'In production, multi-agent orchestrations connect live with specialized AI models (Job Discovery, Skill Gap, Coaching, and Interview Prep agents).',
        };
      default:
        return {
          icon: Info,
          accentColor: '#f59e0b',
          bgTint: 'rgba(245, 158, 11, 0.1)',
          borderColor: 'rgba(245, 158, 11, 0.25)',
          productionDetail:
            'This action is simulated to protect demo integrity. Sign in with Google to enable permanent personal storage and external integrations.',
        };
    }
  };

  const details = getCategoryDetails();
  const IconComponent = details.icon;

  const handleSignIn = () => {
    closeDemoNoticeModal();
    openAuthModal();
  };

  return (
    <Modal
      isOpen={demoNoticeModal.isOpen}
      onClose={closeDemoNoticeModal}
      title="Demo Sandbox Notice"
      maxWidth="540px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', width: '100%' }}>
          <button className="btn btn-secondary btn-sm" onClick={closeDemoNoticeModal}>
            Keep Exploring Demo
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleSignIn}>
            <UserCheck size={14} /> Sign In for Full Access <ArrowRight size={14} />
          </button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        {/* Banner with icon and action name */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.85rem',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: details.bgTint,
            border: `1px solid ${details.borderColor}`,
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: details.accentColor,
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              flexShrink: 0,
            }}
          >
            <IconComponent size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: details.accentColor,
                  background: '#ffffff',
                  padding: '0.15rem 0.45rem',
                  borderRadius: 'var(--radius-full)',
                  border: `1px solid ${details.borderColor}`,
                }}
              >
                Simulated in Demo Mode
              </span>
              {actionName && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Action: {actionName}
                </span>
              )}
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              {title}
            </h3>
          </div>
        </div>

        {/* Primary Message */}
        <div style={{ fontSize: '0.86rem', color: 'var(--text-main)', lineHeight: 1.55 }}>
          {message}
        </div>

        {/* Production Explanation */}
        <div
          style={{
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface-subtle)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            lineHeight: 1.45,
          }}
        >
          <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>
            🔒 How this functions in Production:
          </strong>
          {details.productionDetail}
        </div>
      </div>
    </Modal>
  );
};
