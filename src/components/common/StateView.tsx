import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertCircle, Inbox, RefreshCw } from 'lucide-react';
import { ViewState } from '../../types';

interface StateViewProps {
  children: React.ReactNode;
  overrideState?: ViewState;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyActionText?: string;
  onEmptyAction?: () => void;
  loadingCardCount?: number;
}

export const StateView: React.FC<StateViewProps> = ({
  children,
  overrideState,
  emptyTitle = 'No Records Found',
  emptyMessage = 'There are no active records in this section right now. New updates from career agents will appear here.',
  emptyActionText = 'Reset View State',
  onEmptyAction,
  loadingCardCount = 3,
}) => {
  const { viewState: globalState, setViewState } = useApp();
  const activeState = overrideState || globalState;

  if (activeState === 'loading') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
        <div style={{ display: 'flex', gap: '1rem', width: '100%', marginBottom: '1rem' }}>
          <div className="skeleton skeleton-title" style={{ width: '40%', height: '32px' }} />
          <div className="skeleton skeleton-title" style={{ width: '20%', height: '32px' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {Array.from({ length: loadingCardCount }).map((_, i) => (
            <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '12px' }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton skeleton-title" style={{ width: '70%', height: '18px' }} />
                  <div className="skeleton skeleton-text" style={{ width: '45%' }} />
                </div>
              </div>
              <div className="skeleton skeleton-text" style={{ width: '100%' }} />
              <div className="skeleton skeleton-text" style={{ width: '85%' }} />
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <div className="skeleton" style={{ width: '60px', height: '24px', borderRadius: '6px' }} />
                <div className="skeleton" style={{ width: '80px', height: '24px', borderRadius: '6px' }} />
                <div className="skeleton" style={{ width: '70px', height: '24px', borderRadius: '6px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeState === 'empty') {
    return (
      <div className="empty-state">
        <div className="empty-icon-wrap">
          <Inbox size={32} />
        </div>
        <h3 className="empty-title">{emptyTitle}</h3>
        <p className="empty-desc">{emptyMessage}</p>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => {
            if (onEmptyAction) onEmptyAction();
            else setViewState('normal');
          }}
        >
          {emptyActionText}
        </button>
      </div>
    );
  }

  if (activeState === 'error') {
    return (
      <div className="error-state">
        <div className="error-icon-wrap">
          <AlertCircle size={32} />
        </div>
        <h3 className="error-title">Unable to Load Career Data</h3>
        <p className="error-desc">
          CareerOS encountered a simulated synchronization interruption with the agent queue. All existing data is safe.
        </p>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setViewState('normal')}
          style={{ background: '#dc2626' }}
        >
          <RefreshCw size={14} /> Retry Synchronization
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
