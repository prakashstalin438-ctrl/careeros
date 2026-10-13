import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import {
  Save,
  User,
  Briefcase,
  GraduationCap,
  Sparkles,
  Award,
  Target,
  Plus,
  Trash2,
} from 'lucide-react';

export const EditProfileModal: React.FC = () => {
  const { isEditProfileOpen, closeEditProfile, profile, updateProfile } = useApp();

  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'targets'>('personal');

  // Form states initialized from active profile
  const [name, setName] = useState(profile.name);
  const [title, setTitle] = useState(profile.title);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [location, setLocation] = useState(profile.location);
  const [summary, setSummary] = useState(profile.summary);
  const [yearsExperience, setYearsExperience] = useState(profile.yearsExperience);

  const [github, setGithub] = useState(profile.portfolioLinks?.github || '');
  const [linkedin, setLinkedin] = useState(profile.portfolioLinks?.linkedin || '');
  const [portfolio, setPortfolio] = useState(profile.portfolioLinks?.portfolio || '');
  const [huggingface, setHuggingface] = useState(profile.portfolioLinks?.huggingface || '');

  const [targetRole, setTargetRole] = useState(profile.targetRole);
  const [targetLevel, setTargetLevel] = useState(profile.targetLevel);
  const [targetIndustries, setTargetIndustries] = useState(profile.targetIndustries.join(', '));

  const [skills, setSkills] = useState(profile.skills || []);
  const [experience, setExperience] = useState(profile.experience || []);
  const [education, setEducation] = useState(profile.education || []);
  const [projects, setProjects] = useState(profile.projects || []);
  const [certifications, setCertifications] = useState(profile.certifications || []);

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Intermediate');
  const [newSkillCategory, setNewSkillCategory] = useState('Languages & Tools');

  // Sync state whenever modal opens or profile changes
  useEffect(() => {
    if (isEditProfileOpen) {
      setName(profile.name);
      setTitle(profile.title);
      setEmail(profile.email);
      setPhone(profile.phone);
      setLocation(profile.location);
      setSummary(profile.summary);
      setYearsExperience(profile.yearsExperience);
      setGithub(profile.portfolioLinks?.github || '');
      setLinkedin(profile.portfolioLinks?.linkedin || '');
      setPortfolio(profile.portfolioLinks?.portfolio || '');
      setHuggingface(profile.portfolioLinks?.huggingface || '');
      setTargetRole(profile.targetRole);
      setTargetLevel(profile.targetLevel);
      setTargetIndustries(profile.targetIndustries?.join(', ') || '');
      setSkills(profile.skills || []);
      setExperience(profile.experience || []);
      setEducation(profile.education || []);
      setProjects(profile.projects || []);
      setCertifications(profile.certifications || []);
    }
  }, [isEditProfileOpen, profile]);

  if (!isEditProfileOpen) return null;

  const handleSave = () => {
    updateProfile({
      name,
      title,
      email,
      phone,
      location,
      summary,
      yearsExperience: Number(yearsExperience) || 0,
      targetRole,
      targetLevel,
      targetIndustries: targetIndustries.split(',').map((s) => s.trim()).filter(Boolean),
      portfolioLinks: {
        github,
        linkedin,
        portfolio,
        huggingface,
      },
      skills,
      experience,
      education,
      projects,
      certifications,
    });
    closeEditProfile();
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    setSkills([
      ...skills,
      {
        name: newSkillName.trim(),
        level: newSkillLevel,
        category: newSkillCategory,
        years: 2,
      },
    ]);
    setNewSkillName('');
  };

  const handleAddExperience = () => {
    setExperience([
      ...experience,
      {
        id: `exp-${Date.now()}`,
        role: 'AI / Software Engineer',
        company: 'New Organization',
        location: location || 'Hybrid',
        startDate: '2023',
        endDate: 'Present',
        current: true,
        description: ['Documented engineering contribution and technical achievements.'],
      },
    ]);
  };

  const handleAddEducation = () => {
    setEducation([
      ...education,
      {
        id: `edu-${Date.now()}`,
        degree: 'Bachelor of Science / Technology',
        institution: 'University / College',
        year: '2020 – 2024',
        gpa: '8.5 / 10.0',
      },
    ]);
  };

  const handleAddProject = () => {
    setProjects([
      ...projects,
      {
        id: `proj-${Date.now()}`,
        title: 'New Technical Project',
        description: 'Engineered high-performance module demonstrating modern architecture.',
        technologies: ['Python', 'FastAPI'],
        link: '',
        metrics: 'Evaluated latency and benchmark performance',
      },
    ]);
  };

  const handleAddCertification = () => {
    setCertifications([
      ...certifications,
      {
        id: `cert-${Date.now()}`,
        name: 'Professional Cloud / AI Certification',
        issuer: 'Issuing Body',
        issueDate: '2024',
        credentialId: 'CERT-123456',
      },
    ]);
  };

  return (
    <Modal
      isOpen={isEditProfileOpen}
      onClose={closeEditProfile}
      title="Edit Career Digital Twin Profile"
      maxWidth="820px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', width: '100%' }}>
          <button className="btn btn-secondary btn-sm" onClick={closeEditProfile}>
            Cancel
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleSave}>
            <Save size={14} /> Save Profile Changes
          </button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.35rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', overflowX: 'auto' }}>
          {[
            { id: 'personal', label: 'Personal & Contacts', icon: User },
            { id: 'skills', label: `Skills (${skills.length})`, icon: Sparkles },
            { id: 'experience', label: `Experience (${experience.length})`, icon: Briefcase },
            { id: 'education', label: `Education (${education.length})`, icon: GraduationCap },
            { id: 'projects', label: `Projects (${projects.length})`, icon: Award },
            { id: 'certifications', label: `Certifications (${certifications.length})`, icon: Award },
            { id: 'targets', label: 'Career Targets', icon: Target },
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
                  gap: '0.35rem',
                  padding: '0.45rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: isActive ? 'var(--ai-primary)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div style={{ maxHeight: '440px', overflowY: 'auto', paddingRight: '0.5rem' }}>
          {/* 1. Personal & Contact Info */}
          {activeTab === 'personal' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>
                    Professional Title / Headline
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>
                  Professional Executive Summary
                </label>
                <textarea
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', fontSize: '0.84rem', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>
                    GitHub Profile URL
                  </label>
                  <input
                    type="text"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>
                    Personal Portfolio URL
                  </label>
                  <input
                    type="text"
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. Skills Tab */}
          {activeTab === 'skills' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr auto', gap: '0.5rem', alignItems: 'end' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                    Skill Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PyTorch"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    style={{ width: '100%', padding: '0.45rem 0.7rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                    Proficiency
                  </label>
                  <select
                    value={newSkillLevel}
                    onChange={(e) => setNewSkillLevel(e.target.value as any)}
                    style={{ width: '100%', padding: '0.45rem 0.7rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.82rem' }}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                    Category
                  </label>
                  <select
                    value={newSkillCategory}
                    onChange={(e) => setNewSkillCategory(e.target.value)}
                    style={{ width: '100%', padding: '0.45rem 0.7rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.82rem' }}
                  >
                    <option value="Core AI/ML">Core AI/ML</option>
                    <option value="Backend Systems">Backend Systems</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                    <option value="Languages & Tools">Languages & Tools</option>
                  </select>
                </div>
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddSkill} style={{ height: '34px' }}>
                  <Plus size={14} /> Add
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
                      padding: '0.6rem 0.8rem',
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
                        {skill.category} • <strong>{skill.level}</strong>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSkills(skills.filter((_, i) => i !== index))}
                      style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', padding: '0.2rem' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Experience Tab */}
          {activeTab === 'experience' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddExperience} style={{ alignSelf: 'flex-start' }}>
                <Plus size={14} /> Add Work Experience
              </button>

              {experience.map((exp, idx) => (
                <div
                  key={exp.id || idx}
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--ai-primary)' }}>Role #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => setExperience(experience.filter((_, i) => i !== idx))}
                      style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <input
                      type="text"
                      placeholder="Role Title"
                      value={exp.role}
                      onChange={(e) => {
                        const copy = [...experience];
                        copy[idx] = { ...copy[idx], role: e.target.value };
                        setExperience(copy);
                      }}
                      style={{ padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                    />
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => {
                        const copy = [...experience];
                        copy[idx] = { ...copy[idx], company: e.target.value };
                        setExperience(copy);
                      }}
                      style={{ padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                    <input
                      type="text"
                      placeholder="Location"
                      value={exp.location}
                      onChange={(e) => {
                        const copy = [...experience];
                        copy[idx] = { ...copy[idx], location: e.target.value };
                        setExperience(copy);
                      }}
                      style={{ padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                    />
                    <input
                      type="text"
                      placeholder="Start Date"
                      value={exp.startDate}
                      onChange={(e) => {
                        const copy = [...experience];
                        copy[idx] = { ...copy[idx], startDate: e.target.value };
                        setExperience(copy);
                      }}
                      style={{ padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                    />
                    <input
                      type="text"
                      placeholder="End Date"
                      value={exp.endDate}
                      onChange={(e) => {
                        const copy = [...experience];
                        copy[idx] = { ...copy[idx], endDate: e.target.value };
                        setExperience(copy);
                      }}
                      style={{ padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                    />
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Achievements / bullet description (one per line)"
                    value={exp.description.join('\n')}
                    onChange={(e) => {
                      const copy = [...experience];
                      copy[idx] = { ...copy[idx], description: e.target.value.split('\n') };
                      setExperience(copy);
                    }}
                    style={{ padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.82rem', fontFamily: 'inherit' }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* 4. Education Tab */}
          {activeTab === 'education' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddEducation} style={{ alignSelf: 'flex-start' }}>
                <Plus size={14} /> Add Education
              </button>

              {education.map((edu, idx) => (
                <div
                  key={edu.id || idx}
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--ai-primary)' }}>Education #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => setEducation(education.filter((_, i) => i !== idx))}
                      style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <input
                      type="text"
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) => {
                        const copy = [...education];
                        copy[idx] = { ...copy[idx], degree: e.target.value };
                        setEducation(copy);
                      }}
                      style={{ padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                    />
                    <input
                      type="text"
                      placeholder="Institution"
                      value={edu.institution}
                      onChange={(e) => {
                        const copy = [...education];
                        copy[idx] = { ...copy[idx], institution: e.target.value };
                        setEducation(copy);
                      }}
                      style={{ padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <input
                      type="text"
                      placeholder="Graduation Year"
                      value={edu.year}
                      onChange={(e) => {
                        const copy = [...education];
                        copy[idx] = { ...copy[idx], year: e.target.value };
                        setEducation(copy);
                      }}
                      style={{ padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                    />
                    <input
                      type="text"
                      placeholder="GPA / Grade"
                      value={edu.gpa || ''}
                      onChange={(e) => {
                        const copy = [...education];
                        copy[idx] = { ...copy[idx], gpa: e.target.value };
                        setEducation(copy);
                      }}
                      style={{ padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 5. Projects Tab */}
          {activeTab === 'projects' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddProject} style={{ alignSelf: 'flex-start' }}>
                <Plus size={14} /> Add Project
              </button>

              {projects.map((proj, idx) => (
                <div
                  key={proj.id || idx}
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--ai-primary)' }}>Project #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => setProjects(projects.filter((_, i) => i !== idx))}
                      style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <input
                      type="text"
                      placeholder="Project Title"
                      value={proj.title}
                      onChange={(e) => {
                        const copy = [...projects];
                        copy[idx] = { ...copy[idx], title: e.target.value };
                        setProjects(copy);
                      }}
                      style={{ padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                    />
                    <input
                      type="text"
                      placeholder="Repository / Demo Link"
                      value={proj.link || ''}
                      onChange={(e) => {
                        const copy = [...projects];
                        copy[idx] = { ...copy[idx], link: e.target.value };
                        setProjects(copy);
                      }}
                      style={{ padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Technologies (comma separated)"
                    value={proj.technologies.join(', ')}
                    onChange={(e) => {
                      const copy = [...projects];
                      copy[idx] = { ...copy[idx], technologies: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) };
                      setProjects(copy);
                    }}
                    style={{ padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                  />
                  <textarea
                    rows={2}
                    placeholder="Project architecture and description"
                    value={proj.description}
                    onChange={(e) => {
                      const copy = [...projects];
                      copy[idx] = { ...copy[idx], description: e.target.value };
                      setProjects(copy);
                    }}
                    style={{ padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.82rem', fontFamily: 'inherit' }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* 6. Certifications Tab */}
          {activeTab === 'certifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddCertification} style={{ alignSelf: 'flex-start' }}>
                <Plus size={14} /> Add Certification
              </button>

              {certifications.map((cert, idx) => (
                <div
                  key={cert.id || idx}
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--ai-primary)' }}>Certification #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => setCertifications(certifications.filter((_, i) => i !== idx))}
                      style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <input
                      type="text"
                      placeholder="Certification Name"
                      value={cert.name}
                      onChange={(e) => {
                        const copy = [...certifications];
                        copy[idx] = { ...copy[idx], name: e.target.value };
                        setCertifications(copy);
                      }}
                      style={{ padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                    />
                    <input
                      type="text"
                      placeholder="Issuer (e.g. AWS, Coursera)"
                      value={cert.issuer}
                      onChange={(e) => {
                        const copy = [...certifications];
                        copy[idx] = { ...copy[idx], issuer: e.target.value };
                        setCertifications(copy);
                      }}
                      style={{ padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <input
                      type="text"
                      placeholder="Issue Date"
                      value={cert.issueDate}
                      onChange={(e) => {
                        const copy = [...certifications];
                        copy[idx] = { ...copy[idx], issueDate: e.target.value };
                        setCertifications(copy);
                      }}
                      style={{ padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                    />
                    <input
                      type="text"
                      placeholder="Credential ID"
                      value={cert.credentialId || ''}
                      onChange={(e) => {
                        const copy = [...certifications];
                        copy[idx] = { ...copy[idx], credentialId: e.target.value };
                        setCertifications(copy);
                      }}
                      style={{ padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 7. Targets Tab */}
          {activeTab === 'targets' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>
                  Target Role Goal
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>
                  Target Seniority Level
                </label>
                <input
                  type="text"
                  value={targetLevel}
                  onChange={(e) => setTargetLevel(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>
                  Target Industries (comma separated)
                </label>
                <input
                  type="text"
                  value={targetIndustries}
                  onChange={(e) => setTargetIndustries(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
