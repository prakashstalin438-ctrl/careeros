import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { StateView } from '../components/common/StateView';
import { Badge } from '../components/common/Badge';
import {
  Search,
  MapPin,
  Building2,
  Clock,
  Sparkles,
  Bookmark,
  CheckCircle2,
  XCircle,
  SlidersHorizontal,
} from 'lucide-react';
import { WorkMode, NormalizedJob } from '../types';

export const FindJobsPage: React.FC = () => {
  const {
    jobs,
    toggleSaveJob,
    openJobDetails,
    openApplyModal,
    operatingMode,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('All');
  const [minMatch, setMinMatch] = useState<number>(0);
  const [onlySaved, setOnlySaved] = useState(false);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job: NormalizedJob) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesWorkMode =
        selectedWorkMode === 'All' || job.workMode === selectedWorkMode;

      const matchesScore = job.matchScore >= minMatch;

      const matchesSaved = !onlySaved || job.saved;

      return matchesSearch && matchesWorkMode && matchesScore && matchesSaved;
    });
  }, [jobs, searchQuery, selectedWorkMode, minMatch, onlySaved]);

  return (
    <StateView
      emptyTitle="No Matching Jobs Found"
      emptyMessage="No job postings matched your current search and filter criteria. Try adjusting the match score slider or clearing query filters."
      onEmptyAction={() => {
        setSearchQuery('');
        setSelectedWorkMode('All');
        setMinMatch(0);
        setOnlySaved(false);
      }}
      emptyActionText="Clear Job Filters"
    >
      <div>
        {/* Page Header */}
        <div className="page-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ai-primary)' }}>
                Job Discovery & Normalization Engine (Phase 1 Demo)
              </span>
              <Badge variant="warning">{jobs.length} Sample Roles Ingested</Badge>
            </div>
            <h1 className="page-title">Find Matched Jobs</h1>
            <p className="page-subtitle">
              Demonstrative job postings ranked by simulated AI profile affinity, skill requirements, and truthful matching.
            </p>
          </div>
          <div className="page-actions">
            <button
              className={`btn btn-sm ${onlySaved ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setOnlySaved(!onlySaved)}
            >
              <Bookmark size={14} style={{ fill: onlySaved ? 'currentColor' : 'none' }} />
              {onlySaved ? 'Showing Saved Jobs' : 'Filter Saved Only'}
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div
          className="card"
          style={{
            padding: '1.25rem',
            marginBottom: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div
              style={{
                flex: 1,
                minWidth: '260px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  color: 'var(--text-light)',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                placeholder="Search by role title, company, or required skill (e.g. LangGraph, RAG)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem 0.65rem 2.4rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  fontSize: '0.86rem',
                  outline: 'none',
                }}
              />
            </div>

            {/* Work Mode Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Work Mode:
              </span>
              {(['All', 'Remote', 'Hybrid', 'Onsite'] as (WorkMode | 'All')[]).map((mode) => (
                <button
                  key={mode}
                  className={`btn btn-sm ${selectedWorkMode === mode ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedWorkMode(mode)}
                  style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Filter Row: Min Match Slider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border-subtle)',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.82rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <SlidersHorizontal size={14} color="var(--ai-primary)" /> Min Match Score:
              </span>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={minMatch}
                onChange={(e) => setMinMatch(Number(e.target.value))}
                style={{ width: '140px', accentColor: 'var(--ai-primary)', cursor: 'pointer' }}
              />
              <span style={{ fontWeight: 700, color: 'var(--ai-primary)', minWidth: '40px' }}>
                {minMatch > 0 ? `≥ ${minMatch}%` : 'Any Match'}
              </span>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Showing <strong>{filteredJobs.length}</strong> of {jobs.length} roles
            </div>
          </div>
        </div>

        {/* Jobs List Grid */}
        {filteredJobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-wrap">
              <Search size={32} />
            </div>
            <h3 className="empty-title">No Jobs Match Your Filters</h3>
            <p className="empty-desc">
              Try lowering the match threshold or clearing your keyword search.
            </p>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedWorkMode('All');
                setMinMatch(0);
                setOnlySaved(false);
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filteredJobs.map((job: NormalizedJob) => (
              <div
                key={job.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  borderLeft:
                    job.matchScore >= 90
                      ? '4px solid var(--ai-primary)'
                      : job.matchScore >= 80
                      ? '4px solid #3b82f6'
                      : '4px solid var(--border-medium)',
                }}
              >
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <h2
                        style={{
                          fontSize: '1.15rem',
                          fontWeight: 700,
                          color: 'var(--text-main)',
                          cursor: 'pointer',
                        }}
                        onClick={() => openJobDetails(job)}
                      >
                        {job.title}
                      </h2>
                      {job.featured && <Badge variant="ai">Top Match</Badge>}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginTop: '0.35rem',
                        fontSize: '0.84rem',
                        color: 'var(--text-muted)',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        <Building2 size={15} /> {job.company}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={14} /> {job.location} ({job.workMode})
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={14} /> {job.experience}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                        Source: {job.source}
                      </span>
                    </div>
                  </div>

                  {/* Right Score & Salary */}
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem' }}>
                    <Badge
                      variant="ai"
                      style={{
                        fontSize: '0.88rem',
                        padding: '0.3rem 0.75rem',
                        fontWeight: 800,
                        background:
                          job.matchScore >= 90
                            ? 'rgba(99, 102, 241, 0.15)'
                            : 'rgba(99, 102, 241, 0.08)',
                      }}
                    >
                      <Sparkles size={14} /> {job.matchScore}% Match
                    </Badge>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      {job.salary}
                    </span>
                  </div>
                </div>

                {/* AI Match Explanation */}
                <div
                  style={{
                    background: 'var(--bg-surface-subtle)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.82rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.45,
                  }}
                >
                  <strong style={{ color: 'var(--text-main)' }}>Match Intelligence:</strong>{' '}
                  {job.matchReasoning}
                </div>

                {/* Skills tags */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      Required:
                    </span>
                    {job.requiredSkills.map((skill: string, idx: number) => {
                      const isMatching = job.matchingSkills.includes(skill);
                      return (
                        <Badge
                          key={idx}
                          variant={isMatching ? 'success' : 'error'}
                          style={{ fontSize: '0.75rem' }}
                        >
                          {isMatching ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {skill}
                        </Badge>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => toggleSaveJob(job.id)}
                      title="Save Job"
                    >
                      <Bookmark size={14} style={{ fill: job.saved ? 'currentColor' : 'none' }} />
                      {job.saved ? 'Saved' : 'Save'}
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => openJobDetails(job)}
                    >
                      View Details
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => openApplyModal(job)}
                    >
                      {operatingMode === 'auto'
                        ? 'Auto Apply'
                        : operatingMode === 'approval'
                        ? 'Review & Apply'
                        : 'Prepare Application'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StateView>
  );
};
