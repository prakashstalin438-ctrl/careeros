import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { StateView } from '../components/common/StateView';
import { Badge } from '../components/common/Badge';
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  Download,
  AlertCircle,
  Trash2,
  Star,
  Layers,
  Eye,
} from 'lucide-react';
import { ResumeVersion } from '../types';

export const ResumePage: React.FC = () => {
  const {
    profile,
    resumeVersions,
    selectedVersionId,
    setSelectedVersionId,
    activeResumeVersion,
    setPrimaryResumeVersion,
    deleteResumeVersion,
    downloadResumeFile,
    uploadAndParseResume,
    isUploading,
    uploadProgress,
    uploadError,
    openReviewModal,
    addToast,
    isAuthenticated,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const activeVersion: ResumeVersion | null =
    activeResumeVersion || (resumeVersions.length > 0 ? resumeVersions[0] : null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setLocalError(null);

    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (ext !== '.pdf' && ext !== '.docx') {
      setLocalError('Invalid file type: Please upload a .pdf or .docx document.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setLocalError('File size exceeds the 10MB limit.');
      return;
    }

    try {
      await uploadAndParseResume(file);
    } catch {
      // Error handled in AppContext
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    await handleFileSelect(e.dataTransfer.files);
  };

  const handleOpenReview = (version: ResumeVersion) => {
    if (version.extractedData) {
      openReviewModal(version.extractedData, version);
    } else {
      addToast({
        type: 'info',
        title: 'Resume Entity Review',
        message: 'No separate entity cache stored for this version.',
      });
    }
  };

  return (
    <StateView
      emptyTitle="Upload your resume to build your Career Profile."
      emptyMessage="Upload your resume (PDF or DOCX) to initialize parsing, ATS scoring, and Career Digital Twin extraction."
      emptyActionText="Upload Resume"
      onEmptyAction={() => fileInputRef.current?.click()}
    >
      <div>
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(e) => handleFileSelect(e.target.files)}
        />

        {/* Page Header */}
        <div className="page-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ai-primary)' }}>
                Resume Intelligence & Storage Engine (Phase 2)
              </span>
              {activeVersion ? (
                <Badge variant={activeVersion.isPrimary ? 'success' : 'neutral'}>
                  {activeVersion.version} • ATS Score: {activeVersion.atsScore}%
                </Badge>
              ) : (
                <Badge variant="warning">No Resumes Active</Badge>
              )}
            </div>
            <h1 className="page-title">Resume Intelligence</h1>
            <p className="page-subtitle">
              Upload PDF or DOCX documents for automated truthful entity extraction, version management, and local secure storage.
            </p>
          </div>
          <div className="page-actions">
            {activeVersion && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => downloadResumeFile(activeVersion.id)}
                title="Download original uploaded file"
              >
                <Download size={14} /> Download File
              </button>
            )}
            <button
              className="btn btn-primary btn-sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <UploadCloud size={14} /> Upload New Version
            </button>
          </div>
        </div>

        {/* Top 3-Card Summary: ATS Score, Active Version, Version Count */}
        <div className="stat-grid" style={{ marginBottom: '1.75rem' }}>
          <div className="stat-card">
            <div
              className="stat-icon-wrap"
              style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}
            >
              <CheckCircle2 size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">ATS Match Score</span>
              <span className="stat-value">
                {activeVersion ? `${activeVersion.atsScore}/100` : '—'}
              </span>
              <span className="stat-trend" style={{ color: 'var(--color-success)' }}>
                Targeting: {activeVersion?.targetFocus || profile.targetRole}
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div
              className="stat-icon-wrap"
              style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--ai-primary)' }}
            >
              <FileText size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Active Primary Version</span>
              <span className="stat-value" style={{ fontSize: '1.15rem' }}>
                {activeVersion ? activeVersion.name.substring(0, 22) + (activeVersion.name.length > 22 ? '...' : '') : 'None'}
              </span>
              <span className="stat-trend" style={{ color: 'var(--text-muted)' }}>
                {activeVersion ? `Updated ${activeVersion.lastUpdated}` : 'Upload your first resume'}
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div
              className="stat-icon-wrap"
              style={{ background: 'rgba(2, 132, 199, 0.1)', color: '#0284c7' }}
            >
              <Layers size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Resume Versions</span>
              <span className="stat-value">{resumeVersions.length}</span>
              <span className="stat-trend" style={{ color: '#0284c7' }}>
                {isAuthenticated ? 'IndexedDB User Storage' : 'Sandbox Demo Versions'}
              </span>
            </div>
          </div>
        </div>

        {/* Upload Dropzone */}
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            background: isDragOver ? 'rgba(99, 102, 241, 0.05)' : 'var(--bg-surface)',
            border: isDragOver ? '2px dashed var(--ai-primary)' : '2px dashed var(--border-medium)',
            borderRadius: 'var(--radius-lg)',
            padding: '2.25rem 1.5rem',
            textAlign: 'center',
            cursor: isUploading ? 'not-allowed' : 'pointer',
            marginBottom: '1.75rem',
            transition: 'all var(--transition-fast)',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: isDragOver ? 'var(--ai-primary)' : 'var(--ai-primary-subtle)',
              color: isDragOver ? '#ffffff' : 'var(--ai-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.85rem auto',
              transition: 'all var(--transition-fast)',
            }}
          >
            <UploadCloud size={30} />
          </div>

          {isUploading ? (
            <div style={{ maxWidth: '420px', margin: '0 auto' }}>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                Parsing Resume Document ({uploadProgress}%)
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                {uploadProgress < 40
                  ? 'Reading file and validating mime-type...'
                  : uploadProgress < 75
                  ? 'Extracting raw text from document structure...'
                  : uploadProgress < 95
                  ? 'Identifying verified skills, experience, and contact entities...'
                  : 'Finalizing secure local storage...'}
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${uploadProgress}%`,
                    height: '100%',
                    background: 'var(--ai-gradient)',
                    transition: 'width 250ms ease-out',
                  }}
                />
              </div>
            </div>
          ) : (
            <>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                Click to Upload Resume or Drag & Drop File
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Supports <strong>PDF</strong> and <strong>DOCX</strong> (Max 10MB). Automatically parses skills, education, and career experience without fabricating missing fields.
              </div>
            </>
          )}
        </div>

        {/* Upload Error Banner if any */}
        {(localError || uploadError) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.85rem 1.25rem',
              background: 'var(--color-error-bg)',
              border: '1px solid var(--color-error-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-error)',
              fontSize: '0.85rem',
              marginBottom: '1.75rem',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{localError || uploadError}</span>
          </div>
        )}

        {/* Main 2-Column Section: Versions & AI Analysis on Left, Document Preview on Right */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 390px) 1fr', gap: '1.5rem', alignItems: 'flex-start' }}>
          {/* Left Column: Versions Manager & ATS Analysis */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Version Manager Card */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <FileText size={18} color="var(--ai-primary)" />
                  <span>Resume Versions ({resumeVersions.length})</span>
                </h2>
              </div>

              {resumeVersions.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No resume versions saved yet. Upload a PDF or DOCX file to get started.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {resumeVersions.map((v: ResumeVersion) => {
                    const isSelected = v.id === selectedVersionId;
                    return (
                      <div
                        key={v.id}
                        onClick={() => setSelectedVersionId(v.id)}
                        style={{
                          padding: '0.9rem 1rem',
                          borderRadius: 'var(--radius-md)',
                          border: isSelected ? '2px solid var(--ai-primary)' : '1px solid var(--border-subtle)',
                          background: isSelected ? 'rgba(99, 102, 241, 0.04)' : 'var(--bg-surface)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.45rem',
                          transition: 'all var(--transition-fast)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-main)', wordBreak: 'break-word' }}>
                              {v.name}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                              Focus: {v.targetFocus}
                            </div>
                          </div>
                          {v.isPrimary && <Badge variant="success">Primary</Badge>}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'var(--text-light)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.35rem', marginTop: '0.15rem' }}>
                          <span>ATS Score: <strong style={{ color: 'var(--text-main)' }}>{v.atsScore}%</strong></span>
                          <span>{v.lastUpdated}</span>
                        </div>

                        {/* Action buttons inside version card */}
                        <div
                          style={{
                            display: 'flex',
                            gap: '0.4rem',
                            marginTop: '0.25rem',
                            paddingTop: '0.35rem',
                            borderTop: '1px dashed var(--border-subtle)',
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {!v.isPrimary && (
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => setPrimaryResumeVersion(v.id)}
                              style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                              title="Set as active primary resume"
                            >
                              <Star size={11} /> Set Primary
                            </button>
                          )}
                          {v.extractedData && (
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleOpenReview(v)}
                              style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                              title="View extracted entities & apply to profile"
                            >
                              <Eye size={11} /> Review
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => downloadResumeFile(v.id)}
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                            title="Download file"
                          >
                            <Download size={11} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => deleteResumeVersion(v.id)}
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem', color: 'var(--color-error)' }}
                            title="Delete version"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* AI Analysis & ATS Feedback Card */}
            {activeVersion && (
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">
                    <Sparkles size={18} color="var(--ai-primary)" />
                    <span>ATS Feedback & Keyword Analysis</span>
                  </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#065f46', marginBottom: '0.25rem' }}>
                      Verified Extraction Score: {activeVersion.atsScore}%
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#047857' }}>
                      Document parsed into structured format. Compatible with standard applicant tracking systems.
                    </div>
                  </div>

                  {activeVersion.extractedData && activeVersion.extractedData.missingFields.length > 0 && (
                    <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#92400e', marginBottom: '0.25rem' }}>
                        Missing Sections (Truthful Extraction)
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#78350f' }}>
                        {activeVersion.extractedData.missingFields.join(', ')} were not detected. You can supply them directly in the Profile tab.
                      </div>
                    </div>
                  )}

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
                    Stored in local isolated IndexedDB container: <strong>{activeVersion.storageKey || 'Local'}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Structured Resume Document Preview Area */}
          <div
            className="card"
            style={{
              padding: '2.25rem',
              background: '#ffffff',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {/* Resume Document Header */}
            <div style={{ borderBottom: '2px solid var(--text-main)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                    {profile.name || 'Candidate Name'}
                  </h2>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ai-primary)', marginTop: '0.15rem' }}>
                    {profile.title || 'Professional Title'}
                  </div>
                </div>
                {activeVersion && (
                  <Badge variant="neutral">
                    Previewing: {activeVersion.version}
                  </Badge>
                )}
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                  marginTop: '0.65rem',
                  flexWrap: 'wrap',
                }}
              >
                {profile.email && <span>{profile.email}</span>}
                {profile.phone && <span>• {profile.phone}</span>}
                {profile.location && <span>• {profile.location}</span>}
                {profile.portfolioLinks?.github && <span>• {profile.portfolioLinks.github}</span>}
              </div>
            </div>

            {/* Professional Summary */}
            {profile.summary ? (
              <div style={{ marginBottom: '1.4rem' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  Professional Summary
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.55 }}>
                  {profile.summary}
                </p>
              </div>
            ) : (
              <div style={{ marginBottom: '1.4rem', padding: '0.65rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: 'var(--text-light)' }}>
                No professional summary recorded.
              </div>
            )}

            {/* Experience */}
            <div style={{ marginBottom: '1.4rem' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                Professional Experience
              </h3>
              {profile.experience.length === 0 ? (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>No experience entries.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                  {profile.experience.map((exp) => (
                    <div key={exp.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                          {exp.role} <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>| {exp.company}</span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 500 }}>
                          {exp.startDate} – {exp.endDate}
                        </div>
                      </div>
                      <ul style={{ paddingLeft: '1.25rem', marginTop: '0.4rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        {exp.description.map((bullet: string, i: number) => (
                          <li key={i} style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Education */}
            <div style={{ marginBottom: '1.4rem' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Education
              </h3>
              {profile.education.length === 0 ? (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>No education records.</div>
              ) : (
                profile.education.map((edu) => (
                  <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                        {edu.degree}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {edu.institution} {edu.gpa ? `• GPA ${edu.gpa}` : ''}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>
                      {edu.year}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Technical Competencies */}
            <div>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Key Technical Competencies
              </h3>
              {profile.skills.length === 0 ? (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>No technical skills cataloged.</div>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {profile.skills.map((s, idx: number) => (
                    <Badge key={idx} variant="neutral" style={{ fontSize: '0.75rem' }}>
                      {s.name} ({s.level})
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </StateView>
  );
};
