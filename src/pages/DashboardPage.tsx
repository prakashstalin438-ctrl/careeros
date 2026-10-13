import React from 'react';
import { useApp } from '../context/AppContext';
import { StateView } from '../components/common/StateView';
import { Badge } from '../components/common/Badge';
import {
  Sparkles,
  Briefcase,
  Search,
  MessageSquareCode,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Bookmark,
  Clock,
} from 'lucide-react';
import { mockActivities, mockAICareerInsights } from '../data/mockActivity';

export const DashboardPage: React.FC = () => {
  const {
    profile,
    jobs,
    applications,
    setActiveTab,
    openJobDetails,
    toggleSaveJob,
    skills,
    operatingMode,
  } = useApp();

  const highMatchJobs = jobs.filter((j) => j.matchScore >= 85);
  const criticalGaps = skills.filter((s) => s.status === 'Needs Improvement');
  const interviewCount = applications.filter((a) => a.status === 'Interview' || a.status === 'Assessment').length;

  return (
    <StateView
      emptyTitle="No Career Data Available"
      emptyMessage="Initialize your Career Digital Twin by adding your skills and target preferences."
    >
      <div>
        {/* Page Top Header */}
        <div className="page-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ai-primary)' }}>
                Career Operating System • Real-Time Synchronization
              </span>
              <Badge variant="success">Authenticated Workspace</Badge>
            </div>
            <h1 className="page-title">Career Intelligence Dashboard</h1>
            <p className="page-subtitle">
              Career Digital Twin is active for <strong>{profile.name || 'Candidate'}</strong>
              {profile.targetRole ? ` targeting ${profile.targetRole}` : ''}.
            </p>
          </div>
          <div className="page-actions">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setActiveTab('preferences')}
            >
              Adjust Preferences
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setActiveTab('find-jobs')}
            >
              <Search size={14} /> Explore Matched Jobs
            </button>
          </div>
        </div>

        {/* Top Stats Grid */}
        <div className="stat-grid">
          {/* Career Readiness */}
          <div className="stat-card">
            <div
              className="stat-icon-wrap"
              style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--ai-primary)' }}
            >
              <Sparkles size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Career Readiness</span>
              <span className="stat-value">{profile.careerReadinessScore}%</span>
              <span className="stat-trend" style={{ color: profile.careerReadinessScore > 0 ? 'var(--color-success)' : 'var(--text-muted)' }}>
                {profile.careerReadinessScore > 0 ? (
                  <>
                    <TrendingUp size={12} /> Verified Skill Alignment
                  </>
                ) : (
                  'Upload resume to calculate'
                )}
              </span>
            </div>
          </div>

          {/* Jobs Matched */}
          <div
            className="stat-card"
            style={{ cursor: 'pointer' }}
            onClick={() => setActiveTab('find-jobs')}
          >
            <div
              className="stat-icon-wrap"
              style={{ background: 'rgba(2, 132, 199, 0.1)', color: '#0284c7' }}
            >
              <Search size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Discovered Jobs</span>
              <span className="stat-value">{jobs.length}</span>
              <span className="stat-trend" style={{ color: 'var(--color-info)' }}>
                {highMatchJobs.length} roles ≥85% match score
              </span>
            </div>
          </div>

          {/* Active Applications */}
          <div
            className="stat-card"
            style={{ cursor: 'pointer' }}
            onClick={() => setActiveTab('applications')}
          >
            <div
              className="stat-icon-wrap"
              style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}
            >
              <Briefcase size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Active Applications</span>
              <span className="stat-value">{applications.length}</span>
              <span className="stat-trend" style={{ color: applications.length > 0 ? 'var(--color-success)' : 'var(--text-muted)' }}>
                {applications.length > 0 ? `Mode: ${operatingMode.toUpperCase()}` : 'No applications yet'}
              </span>
            </div>
          </div>

          {/* Interview Stages */}
          <div
            className="stat-card"
            style={{ cursor: 'pointer' }}
            onClick={() => setActiveTab('interview-prep')}
          >
            <div
              className="stat-icon-wrap"
              style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}
            >
              <MessageSquareCode size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Interview Stages</span>
              <span className="stat-value">{interviewCount}</span>
              <span className="stat-trend" style={{ color: interviewCount > 0 ? '#d97706' : 'var(--text-muted)' }}>
                {interviewCount > 0 ? `${interviewCount} active interview loop` : 'No interviews scheduled yet'}
              </span>
            </div>
          </div>
        </div>

        {/* AI Career Insights Banner */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {mockAICareerInsights.map((ins) => (
            <div
              key={ins.id}
              style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.06) 100%)',
                border: '1px solid var(--ai-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1, minWidth: '280px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--ai-gradient)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
                  }}
                >
                  <Sparkles size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                    {ins.headline}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                    {ins.detail}
                  </div>
                </div>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setActiveTab(ins.targetTab)}
                style={{ flexShrink: 0 }}
              >
                {ins.actionText} <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Main Dashboard 2-Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {/* Left Column: Recommended Jobs */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <Search size={18} color="var(--ai-primary)" />
                <span>Recommended Jobs for You</span>
              </h2>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setActiveTab('find-jobs')}
              >
                View All ({jobs.length})
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {jobs.slice(0, 3).map((job) => (
                <div
                  key={job.id}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-surface)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: '0.94rem',
                          color: 'var(--text-main)',
                          cursor: 'pointer',
                        }}
                        onClick={() => openJobDetails(job)}
                      >
                        {job.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        {job.company} • {job.location} ({job.workMode})
                      </div>
                    </div>
                    <Badge variant="ai" style={{ fontWeight: 700 }}>
                      {job.matchScore}% Match
                    </Badge>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                    {job.matchingSkills.slice(0, 4).map((s, idx) => (
                      <Badge key={idx} variant="neutral">
                        {s}
                      </Badge>
                    ))}
                    {job.missingSkills.length > 0 && (
                      <Badge variant="error" style={{ fontSize: '0.7rem' }}>
                        Missing: {job.missingSkills[0]}
                      </Badge>
                    )}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '0.25rem',
                      paddingTop: '0.5rem',
                      borderTop: '1px solid var(--border-subtle)',
                    }}
                  >
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      {job.salary}
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => toggleSaveJob(job.id)}
                        title="Save Job"
                        style={{ padding: '0.3rem 0.5rem' }}
                      >
                        <Bookmark size={13} style={{ fill: job.saved ? 'currentColor' : 'none' }} />
                      </button>
                      <button
                        className="btn btn-outline-ai btn-sm"
                        onClick={() => openJobDetails(job)}
                        style={{ padding: '0.3rem 0.65rem' }}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Skill Gaps & Learning Progress */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Critical Skill Gaps */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <AlertTriangle size={18} color="#d97706" />
                  <span>Target Role Skill Gaps</span>
                </h2>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActiveTab('skill-coach')}
                >
                  Skill Coach
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {criticalGaps.map((skill, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-surface-subtle)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                        {skill.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        Current: <strong>{skill.currentLevel}</strong> → Target: <strong>{skill.targetLevel}</strong>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Badge variant="warning">Priority #{skill.priority}</Badge>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
                        {skill.marketDemand}% market frequency
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <Clock size={18} color="var(--text-muted)" />
                  <span>Recent Career Activity</span>
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {mockActivities.slice(0, 4).map((act) => (
                  <div
                    key={act.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      fontSize: '0.82rem',
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'var(--ai-primary)',
                        marginTop: '0.45rem',
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                        {act.title}
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        {act.description}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', whiteSpace: 'nowrap' }}>
                      {act.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </StateView>
  );
};
