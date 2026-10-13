import React from 'react';
import { useApp } from '../context/AppContext';
import { StateView } from '../components/common/StateView';
import { Badge } from '../components/common/Badge';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  Award,
  FolderGit2,
  Edit3,
  Target,
  Sparkles,
  ExternalLink,
  UploadCloud,
  UserCheck,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { profile, openEditProfile, setActiveTab, isAuthenticated } = useApp();

  return (
    <StateView
      emptyTitle="Complete your profile to unlock Career Intelligence."
      emptyMessage="Complete your Career Digital Twin profile with your work history, verified skills, and target career goals."
      emptyActionText="Edit Profile"
      onEmptyAction={openEditProfile}
    >
      <div>
        {/* Page Header */}
        <div className="page-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ai-primary)' }}>
                Career Digital Twin • Ground Truth Profile
              </span>
              <Badge variant="success">
                Readiness: {profile.careerReadinessScore}%
              </Badge>
            </div>
            <h1 className="page-title">My Career Profile</h1>
            <p className="page-subtitle">
              Your truthful career representation. All skills, work history, projects, and goals are strictly grounded in user-supplied or parsed resume documents.
            </p>
          </div>
          <div className="page-actions">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setActiveTab('resume')}
              title="Upload resume to parse and auto-populate"
            >
              <UploadCloud size={14} /> Update from Resume
            </button>
            <button className="btn btn-primary btn-sm" onClick={openEditProfile}>
              <Edit3 size={14} /> Edit Profile Details
            </button>
          </div>
        </div>

        {/* Top Profile Hero Card */}
        <div
          className="card"
          style={{
            padding: '1.75rem',
            marginBottom: '1.75rem',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(248, 250, 252, 1) 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'var(--ai-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '1.75rem',
                fontWeight: 800,
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
                flexShrink: 0,
              }}
            >
              {profile.name
                ? profile.name
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')
                    .substring(0, 2)
                : 'U'}
            </div>

            <div style={{ flex: 1, minWidth: '260px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {profile.name || 'Unnamed Candidate'}
                </h2>
                {isAuthenticated ? (
                  <Badge variant="success">
                    <UserCheck size={11} style={{ display: 'inline', marginRight: '3px' }} /> Verified User
                  </Badge>
                ) : (
                  <Badge variant="warning">Sample Candidate</Badge>
                )}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ai-primary)', marginTop: '0.2rem' }}>
                {profile.title || 'Professional Title Not Set'}
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '1.25rem',
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                  marginTop: '0.6rem',
                  flexWrap: 'wrap',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={14} /> {profile.location || 'Location Not Specified'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Mail size={14} /> {profile.email || 'Email Not Specified'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Phone size={14} /> {profile.phone || 'Phone Not Specified'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Briefcase size={14} /> {profile.yearsExperience || 0} Years Experience
                </span>
              </div>

              {profile.summary ? (
                <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginTop: '0.85rem', lineHeight: 1.55 }}>
                  {profile.summary}
                </p>
              ) : (
                <div style={{ marginTop: '0.85rem', padding: '0.65rem 0.85rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-light)' }}>
                  No executive summary provided. Click "Edit Profile Details" to add one.
                </div>
              )}

              {/* Social & Portfolio Links */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                {profile.portfolioLinks?.github && (
                  <a
                    href={profile.portfolioLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ textDecoration: 'none' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    GitHub
                  </a>
                )}
                {profile.portfolioLinks?.linkedin && (
                  <a
                    href={profile.portfolioLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ textDecoration: 'none' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    LinkedIn
                  </a>
                )}
                {profile.portfolioLinks?.portfolio && (
                  <a
                    href={profile.portfolioLinks.portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ textDecoration: 'none' }}
                  >
                    <Globe size={14} /> Personal Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem' }}>
          {/* Left Column: Career Targets, Skills, Certifications */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* Career Targets Card */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <Target size={18} color="var(--ai-primary)" />
                  <span>Career Targets & Direction</span>
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Target Role:
                  </span>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)', marginTop: '0.15rem' }}>
                    {profile.targetRole || 'Not specified'}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      Seniority Level:
                    </span>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '0.15rem' }}>
                      {profile.targetLevel || 'Mid-Senior'}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      Career Readiness:
                    </span>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--ai-primary)', marginTop: '0.15rem' }}>
                      {profile.careerReadinessScore}% Aligned
                    </div>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Target Industries:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.35rem' }}>
                    {profile.targetIndustries && profile.targetIndustries.length > 0 ? (
                      profile.targetIndustries.map((ind: string, i: number) => (
                        <Badge key={i} variant="neutral">
                          {ind}
                        </Badge>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>No industries selected</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Inventory */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <Sparkles size={18} color="var(--ai-primary)" />
                  <span>Verified Skill Inventory ({profile.skills.length})</span>
                </h3>
              </div>

              {profile.skills.length === 0 ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  No skills added yet. Upload a resume or add skills using "Edit Profile".
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {profile.skills.map((skill, index: number) => (
                    <div
                      key={index}
                      style={{
                        padding: '0.7rem 0.85rem',
                        background: 'var(--bg-surface-subtle)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                          {skill.name}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          {skill.category}
                        </div>
                      </div>
                      <Badge
                        variant={
                          skill.level === 'Expert'
                            ? 'success'
                            : skill.level === 'Advanced'
                            ? 'ai'
                            : 'neutral'
                        }
                      >
                        {skill.level}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Certifications */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <Award size={18} color="#d97706" />
                  <span>Certifications & Credentials ({profile.certifications.length})</span>
                </h3>
              </div>
              {profile.certifications.length === 0 ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  No certifications recorded.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {profile.certifications.map((cert) => (
                    <div
                      key={cert.id}
                      style={{
                        padding: '0.85rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-surface)',
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                        {cert.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        {cert.issuer} • Issued {cert.issueDate}
                      </div>
                      {cert.credentialId && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
                          Credential ID: {cert.credentialId}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Work Experience, Projects, Education */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* Experience Timeline */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <Briefcase size={18} color="var(--ai-primary)" />
                  <span>Work Experience ({profile.experience.length})</span>
                </h3>
              </div>

              {profile.experience.length === 0 ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  No work experience entries recorded.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {profile.experience.map((exp) => (
                    <div
                      key={exp.id}
                      style={{
                        borderLeft: '2px solid var(--ai-primary)',
                        paddingLeft: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.35rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.96rem', color: 'var(--text-main)' }}>
                          {exp.role}
                        </div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 500 }}>
                          {exp.startDate} – {exp.endDate}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ai-primary)' }}>
                        {exp.company} • {exp.location}
                      </div>
                      <ul style={{ paddingLeft: '1rem', marginTop: '0.4rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {exp.description.map((b: string, i: number) => (
                          <li key={i} style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Featured Projects */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <FolderGit2 size={18} color="#0284c7" />
                  <span>Projects & Technical Evidence ({profile.projects.length})</span>
                </h3>
              </div>

              {profile.projects.length === 0 ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  No projects recorded.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {profile.projects.map((proj) => (
                    <div
                      key={proj.id}
                      style={{
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-surface-subtle)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                          {proj.title}
                        </h4>
                        {proj.link && (
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: 'var(--ai-primary)', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.75rem', textDecoration: 'none' }}
                          >
                            Code <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                      {proj.description && (
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.35rem', lineHeight: 1.45 }}>
                          {proj.description}
                        </p>
                      )}
                      {proj.technologies && proj.technologies.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.6rem' }}>
                          {proj.technologies.map((t: string, i: number) => (
                            <Badge key={i} variant="neutral">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {proj.metrics && (
                        <div style={{ fontSize: '0.74rem', color: '#065f46', marginTop: '0.5rem', fontWeight: 600 }}>
                          ⚡ Result: {proj.metrics}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Education Card */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <GraduationCap size={18} color="var(--text-muted)" />
                  <span>Education ({profile.education.length})</span>
                </h3>
              </div>
              {profile.education.length === 0 ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  No education records provided.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {profile.education.map((edu) => (
                    <div key={edu.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                        {edu.degree}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {edu.institution}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-light)', marginTop: '0.15rem' }}>
                        Graduated {edu.year} {edu.gpa ? `• GPA: ${edu.gpa}` : ''} {edu.honors ? `• ${edu.honors}` : ''}
                      </div>
                    </div>
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
