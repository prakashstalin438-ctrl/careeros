import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StateView } from '../components/common/StateView';
import { Badge } from '../components/common/Badge';
import {
  Briefcase,
  Calendar,
  Building2,
  FileText,
  Clock,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from 'lucide-react';
import { ApplicationStatus, ApplicationItem } from '../types';

export const ApplicationsPage: React.FC = () => {
  const { applications, setActiveTab, operatingMode } = useApp();
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);

  const statuses: (ApplicationStatus | 'All')[] = [
    'All',
    'Saved',
    'Ready',
    'Applied',
    'Under Review',
    'Assessment',
    'Interview',
    'Offer',
    'Rejected',
  ];

  const filteredApps = applications.filter((app: ApplicationItem) => {
    if (selectedStatus === 'All') return true;
    return app.status === selectedStatus;
  });

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Offer':
        return <Badge variant="success">Offer Received 🎉</Badge>;
      case 'Interview':
        return <Badge variant="warning">Interview Scheduled</Badge>;
      case 'Assessment':
        return <Badge variant="warning">Take-Home Assessment</Badge>;
      case 'Under Review':
        return <Badge variant="ai">Under Review</Badge>;
      case 'Applied':
        return <Badge variant="neutral">Applied</Badge>;
      case 'Ready':
        return <Badge variant="ai">Ready for Approval</Badge>;
      case 'Saved':
        return <Badge variant="neutral">Saved</Badge>;
      case 'Rejected':
        return <Badge variant="error">Archived / Rejected</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const interviewCount = applications.filter((a: ApplicationItem) => a.status === 'Interview').length;
  const offerCount = applications.filter((a: ApplicationItem) => a.status === 'Offer').length;
  const readyApprovalCount = applications.filter((a: ApplicationItem) => a.status === 'Ready').length;

  return (
    <StateView
      emptyTitle="No applications yet."
      emptyMessage="You have not submitted or queued any applications yet. Explore matched jobs to initiate an application in your active mode."
      emptyActionText="Find Jobs to Apply"
      onEmptyAction={() => setActiveTab('find-jobs')}
    >
      <div>
        {/* Page Header */}
        <div className="page-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ai-primary)' }}>
                Application Lifecycle Engine
              </span>
              <Badge variant="ai">Mode: {operatingMode.toUpperCase()}</Badge>
            </div>
            <h1 className="page-title">Application Pipeline</h1>
            <p className="page-subtitle">
              Track your active job applications, interview stages, follow-ups, and resume versions.
            </p>
          </div>
          <div className="page-actions">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setActiveTab('find-jobs')}
            >
              <Briefcase size={14} /> Add New Application
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="stat-grid" style={{ marginBottom: '1.75rem' }}>
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Total Applications</span>
              <span className="stat-value">{applications.length}</span>
              <span className="stat-trend" style={{ color: 'var(--text-muted)' }}>
                Full audit history recorded
              </span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Interviews In Progress</span>
              <span className="stat-value" style={{ color: '#d97706' }}>
                {interviewCount}
              </span>
              <span className="stat-trend" style={{ color: 'var(--color-warning)' }}>
                Lead Gen AI @ NexusAI
              </span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Offers Received</span>
              <span className="stat-value" style={{ color: 'var(--color-success)' }}>
                {offerCount}
              </span>
              <span className="stat-trend" style={{ color: 'var(--color-success)' }}>
                Prism Analytics (CTC ₹34.5 LPA)
              </span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Pending Approval Queue</span>
              <span className="stat-value" style={{ color: 'var(--ai-primary)' }}>
                {readyApprovalCount}
              </span>
              <span className="stat-trend" style={{ color: 'var(--ai-primary)' }}>
                Awaiting user review
              </span>
            </div>
          </div>
        </div>

        {/* Status Pipeline Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            overflowX: 'auto',
            paddingBottom: '0.75rem',
            marginBottom: '1.25rem',
          }}
        >
          {statuses.map((status) => {
            const count =
              status === 'All'
                ? applications.length
                : applications.filter((a: ApplicationItem) => a.status === status).length;
            const isActive = selectedStatus === status;
            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  fontSize: '0.78rem',
                  padding: '0.4rem 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <span>{status}</span>
                <span
                  style={{
                    background: isActive ? 'rgba(255, 255, 255, 0.25)' : 'var(--bg-surface-subtle)',
                    color: isActive ? '#ffffff' : 'var(--text-muted)',
                    padding: '0.1rem 0.4rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Applications List */}
        {filteredApps.length === 0 ? (
          <div className="empty-state">
            <h3 className="empty-title">No Applications in "{selectedStatus}"</h3>
            <p className="empty-desc">
              No applications match this specific lifecycle status.
            </p>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setSelectedStatus('All')}
            >
              View All Applications
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredApps.map((app: ApplicationItem) => {
              const isExpanded = expandedAppId === app.id;
              return (
                <div
                  key={app.id}
                  className="card"
                  style={{
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  {/* Top Line: Company, Role, Status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                          {app.role}
                        </span>
                        {getStatusBadge(app.status)}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.85rem',
                          marginTop: '0.25rem',
                          fontSize: '0.82rem',
                          color: 'var(--text-muted)',
                          flexWrap: 'wrap',
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600, color: 'var(--text-main)' }}>
                          <Building2 size={15} /> {app.company}
                        </span>
                        <span>•</span>
                        <span>{app.location}</span>
                        <span>•</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Calendar size={13} /> Applied: {app.appliedDate}
                        </span>
                        <span>•</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <FileText size={13} color="var(--ai-primary)" /> {app.resumeVersion}
                        </span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <Badge variant="ai" style={{ fontWeight: 700 }}>
                        {app.matchScore}% Match
                      </Badge>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
                        Source: {app.source}
                      </div>
                    </div>
                  </div>

                  {/* Next Action Box */}
                  <div
                    style={{
                      background: 'var(--bg-surface-subtle)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.65rem 0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={15} color="var(--ai-primary)" />
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: 600 }}>
                        Next Action: {app.nextAction}
                      </span>
                      {app.nextActionDate && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--ai-primary)', fontWeight: 600 }}>
                          ({app.nextActionDate})
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {app.status === 'Interview' && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => setActiveTab('interview-prep')}
                          style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                        >
                          Prep for Interview <ArrowRight size={12} />
                        </button>
                      )}
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setExpandedAppId(isExpanded ? null : app.id)}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      >
                        {isExpanded ? (
                          <>
                            Hide Timeline <ChevronUp size={13} />
                          </>
                        ) : (
                          <>
                            View Timeline <ChevronDown size={13} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expandable Timeline View */}
                  {isExpanded && (
                    <div
                      style={{
                        paddingTop: '0.75rem',
                        marginTop: '0.25rem',
                        borderTop: '1px solid var(--border-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.65rem',
                      }}
                    >
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        Application Lifecycle Timeline:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {app.timeline.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '0.65rem',
                              fontSize: '0.78rem',
                            }}
                          >
                            <span
                              style={{
                                width: '70px',
                                color: 'var(--text-light)',
                                flexShrink: 0,
                                fontWeight: 500,
                              }}
                            >
                              {item.date}
                            </span>
                            <span
                              style={{
                                padding: '0.1rem 0.4rem',
                                borderRadius: 'var(--radius-sm)',
                                background: 'var(--bg-surface-subtle)',
                                fontWeight: 600,
                                color: 'var(--text-main)',
                              }}
                            >
                              {item.status}
                            </span>
                            <span style={{ color: 'var(--text-muted)', flex: 1 }}>
                              {item.note}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </StateView>
  );
};
