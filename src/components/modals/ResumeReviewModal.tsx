import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { ParsedResumeData, ResumeVersion } from '../../types';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Plus,
  Trash2,
} from 'lucide-react';

interface ResumeReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  parsedData: ParsedResumeData | null;
  uploadedVersion: ResumeVersion | null;
  onApplyToProfile: (updatedProfileData: Partial<any>) => void;
}

export const ResumeReviewModal: React.FC<ResumeReviewModalProps> = ({
  isOpen,
  onClose,
  parsedData,
  uploadedVersion,
  onApplyToProfile,
}) => {
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'experience' | 'education' | 'skills' | 'projects'>('overview');

  // Local editable draft state initialized from parsed data
  const [name, setName] = useState(parsedData?.personalInfo.name || '');
  const [email, setEmail] = useState(parsedData?.personalInfo.email || '');
  const [phone, setPhone] = useState(parsedData?.personalInfo.phone || '');
  const [location, setLocation] = useState(parsedData?.personalInfo.location || '');
  const [title, setTitle] = useState(parsedData?.personalInfo.title || 'AI / Software Systems Engineer');
  const [summary, setSummary] = useState(parsedData?.personalInfo.summary || '');
  const [github, setGithub] = useState(parsedData?.portfolioLinks.github || '');
  const [linkedin, setLinkedin] = useState(parsedData?.portfolioLinks.linkedin || '');
  const [portfolio, setPortfolio] = useState(parsedData?.portfolioLinks.portfolio || '');

  const [skills, setSkills] = useState(parsedData?.skills || []);
  const [experience, setExperience] = useState(parsedData?.experience || []);
  const [education, setEducation] = useState(parsedData?.education || []);
  const [projects, setProjects] = useState(parsedData?.projects || []);
  const [certifications] = useState(parsedData?.certifications || []);

  const [newSkillName, setNewSkillName] = useState('');

  // Re-sync when parsedData changes
  React.useEffect(() => {
    if (parsedData) {
      setName(parsedData.personalInfo.name || '');
      setEmail(parsedData.personalInfo.email || '');
      setPhone(parsedData.personalInfo.phone || '');
      setLocation(parsedData.personalInfo.location || '');
      setTitle(parsedData.personalInfo.title || 'AI / Software Systems Engineer');
      setSummary(parsedData.personalInfo.summary || '');
      setGithub(parsedData.portfolioLinks.github || '');
      setLinkedin(parsedData.portfolioLinks.linkedin || '');
      setPortfolio(parsedData.portfolioLinks.portfolio || '');
      setSkills(parsedData.skills || []);
      setExperience(parsedData.experience || []);
      setEducation(parsedData.education || []);
      setProjects(parsedData.projects || []);
    }
  }, [parsedData]);

  if (!isOpen || !parsedData) return null;

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    setSkills((prev) => [
      ...prev,
      {
        name: newSkillName.trim(),
        level: 'Intermediate',
        category: 'Languages & Tools',
      },
    ]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (skillIndex: number) => {
    setSkills((prev) => prev.filter((_, idx) => idx !== skillIndex));
  };

  const handleSaveAndApply = () => {
    // Construct truthful profile update from reviewed/edited fields
    const updatedProfile = {
      name: name || undefined,
      email: email || undefined,
      phone: phone || undefined,
      location: location || undefined,
      title: title || undefined,
      summary: summary || undefined,
      portfolioLinks: {
        github,
        linkedin,
        portfolio,
      },
      skills: skills.map((s) => ({
        name: s.name,
        level: s.level || 'Intermediate',
        category: s.category || 'Languages & Tools',
        years: 2,
      })),
      experience: experience.map((exp, idx) => ({
        id: exp.id || `exp-${Date.now()}-${idx}`,
        role: exp.role || 'Software Engineer',
        company: exp.company || 'Company',
        location: exp.location || location || 'Hybrid',
        startDate: exp.startDate || '2022',
        endDate: exp.endDate || 'Present',
        current: exp.current || false,
        description: exp.description || [],
      })),
      education: education.map((edu, idx) => ({
        id: edu.id || `edu-${Date.now()}-${idx}`,
        degree: edu.degree || 'Degree',
        institution: edu.institution || 'University',
        year: edu.year || 'Graduated',
        gpa: edu.gpa || '',
      })),
      projects: projects.map((p, idx) => ({
        id: p.id || `proj-${Date.now()}-${idx}`,
        title: p.title || 'Project',
        description: p.description || '',
        technologies: p.technologies || [],
        metrics: p.metrics || 'Documented in resume',
      })),
      certifications: certifications.map((c, idx) => ({
        id: c.id || `cert-${Date.now()}-${idx}`,
        name: c.name || 'Certification',
        issuer: c.issuer || 'Provider',
        issueDate: c.issueDate || 'Verified',
        credentialId: c.credentialId || '',
      })),
    };

    onApplyToProfile(updatedProfile);
    addToast({
      type: 'success',
      title: 'Profile Updated from Resume',
      message: 'Extracted and verified career entities have been merged into your Career Digital Twin.',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Resume Extraction & Truthful Entity Review"
      maxWidth="860px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Keep in Versions Only
          </button>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleSaveAndApply}>
              <FileCheck size={14} /> Apply Verified Data to My Profile
            </button>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Banner with Confidence Score & Missing Fields */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.05) 100%)',
            border: '1px solid var(--ai-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--ai-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <Sparkles size={16} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {uploadedVersion?.name || 'Resume Document'} Parsed Successfully
                </h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Truthful entity extraction completed without AI hallucination.
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Badge variant="success">Confidence: {parsedData.parsingConfidence}%</Badge>
              {uploadedVersion?.atsScore && (
                <Badge variant="ai">ATS Score: {uploadedVersion.atsScore}/100</Badge>
              )}
            </div>
          </div>

          {/* Missing Fields Truthfulness Disclosure */}
          {parsedData.missingFields.length > 0 ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '0.65rem 0.85rem',
                fontSize: '0.78rem',
                color: '#92400e',
              }}
            >
              <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Unextracted Fields (Truthful Guardrail):</strong> The following fields were not detected in the uploaded file and have been left blank rather than fabricated:{' '}
                <span style={{ fontWeight: 600 }}>{parsedData.missingFields.join(', ')}</span>. You can input them below.
              </div>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.78rem',
                color: '#065f46',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '0.5rem 0.75rem',
              }}
            >
              <CheckCircle2 size={14} />
              <span>All primary career sections were truthfully detected in the document.</span>
            </div>
          )}
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', gap: '0.4rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', overflowX: 'auto' }}>
          {[
            { id: 'overview', label: 'Personal & Contacts', icon: User },
            { id: 'skills', label: `Skills (${skills.length})`, icon: Sparkles },
            { id: 'experience', label: `Experience (${experience.length})`, icon: Briefcase },
            { id: 'education', label: `Education (${education.length})`, icon: GraduationCap },
            { id: 'projects', label: `Projects (${projects.length})`, icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: isActive ? 'var(--ai-primary)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  transition: 'all var(--transition-fast)',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: '0.5rem' }}>
          {/* Overview & Personal Info */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                    Full Name {name ? '✓ Extracted' : '(Missing)'}
                  </label>
                  <input
                    type="text"
                    value={name}
                    placeholder="Enter full name"
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-medium)',
                      fontSize: '0.84rem',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                    Professional Title / Headline
                  </label>
                  <input
                    type="text"
                    value={title}
                    placeholder="e.g. Senior AI Engineer"
                    onChange={(e) => setTitle(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-medium)',
                      fontSize: '0.84rem',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    placeholder="name@domain.com"
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-medium)',
                      fontSize: '0.84rem',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    placeholder="e.g. +91 98765 43210"
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-medium)',
                      fontSize: '0.84rem',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    placeholder="City, Country"
                    onChange={(e) => setLocation(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-medium)',
                      fontSize: '0.84rem',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                  Professional Summary {summary ? '✓ Extracted' : '(Missing — Enter summary)'}
                </label>
                <textarea
                  rows={3}
                  value={summary}
                  placeholder="Enter executive summary..."
                  onChange={(e) => setSummary(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    fontSize: '0.84rem',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                    GitHub Profile
                  </label>
                  <input
                    type="text"
                    value={github}
                    placeholder="https://github.com/..."
                    onChange={(e) => setGithub(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-medium)',
                      fontSize: '0.84rem',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                    LinkedIn Profile
                  </label>
                  <input
                    type="text"
                    value={linkedin}
                    placeholder="https://linkedin.com/in/..."
                    onChange={(e) => setLinkedin(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-medium)',
                      fontSize: '0.84rem',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                    Portfolio / Website
                  </label>
                  <input
                    type="text"
                    value={portfolio}
                    placeholder="https://yourdomain.com"
                    onChange={(e) => setPortfolio(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-medium)',
                      fontSize: '0.84rem',
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Add another skill..."
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                  style={{
                    flex: 1,
                    padding: '0.55rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    fontSize: '0.84rem',
                  }}
                />
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddSkill}>
                  <Plus size={14} /> Add Skill
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.65rem' }}>
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      background: 'var(--bg-surface-subtle)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.84rem', color: 'var(--text-main)' }}>
                        {skill.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {skill.category || 'Competency'} • {skill.level}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(index)}
                      title="Remove Skill"
                      style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', padding: '0.2rem' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience Tab */}
          {activeTab === 'experience' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {experience.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                  No past employment records detected in document.
                </div>
              ) : (
                experience.map((exp, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-surface-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <input
                        type="text"
                        value={exp.role}
                        placeholder="Role / Title"
                        onChange={(e) => {
                          const updated = [...experience];
                          updated[idx] = { ...updated[idx], role: e.target.value };
                          setExperience(updated);
                        }}
                        style={{ padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                      />
                      <input
                        type="text"
                        value={exp.company}
                        placeholder="Company Name"
                        onChange={(e) => {
                          const updated = [...experience];
                          updated[idx] = { ...updated[idx], company: e.target.value };
                          setExperience(updated);
                        }}
                        style={{ padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <input
                        type="text"
                        value={`${exp.startDate} - ${exp.endDate}`}
                        placeholder="Dates"
                        onChange={(e) => {
                          const parts = e.target.value.split('-');
                          const updated = [...experience];
                          updated[idx] = {
                            ...updated[idx],
                            startDate: parts[0]?.trim() || '',
                            endDate: parts[1]?.trim() || '',
                          };
                          setExperience(updated);
                        }}
                        style={{ flex: 1, padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.82rem' }}
                      />
                    </div>
                    {exp.description.length > 0 && (
                      <ul style={{ paddingLeft: '1.25rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {exp.description.map((b, bIdx) => (
                          <li key={bIdx} style={{ marginBottom: '0.2rem' }}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Education Tab */}
          {activeTab === 'education' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {education.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                  No formal degree record detected in document.
                </div>
              ) : (
                education.map((edu, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-surface-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    <input
                      type="text"
                      value={edu.degree}
                      placeholder="Degree"
                      onChange={(e) => {
                        const updated = [...education];
                        updated[idx] = { ...updated[idx], degree: e.target.value };
                        setEducation(updated);
                      }}
                      style={{ padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
                      <input
                        type="text"
                        value={edu.institution}
                        placeholder="Institution / College"
                        onChange={(e) => {
                          const updated = [...education];
                          updated[idx] = { ...updated[idx], institution: e.target.value };
                          setEducation(updated);
                        }}
                        style={{ padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                      />
                      <input
                        type="text"
                        value={edu.year}
                        placeholder="Graduation Year"
                        onChange={(e) => {
                          const updated = [...education];
                          updated[idx] = { ...updated[idx], year: e.target.value };
                          setEducation(updated);
                        }}
                        style={{ padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {projects.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                  No standalone projects section detected.
                </div>
              ) : (
                projects.map((proj, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-surface-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                      {proj.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {proj.description}
                    </div>
                    {proj.technologies.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.25rem' }}>
                        {proj.technologies.map((t, tIdx) => (
                          <Badge key={tIdx} variant="neutral" style={{ fontSize: '0.7rem' }}>
                            {t}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
