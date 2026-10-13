import React from 'react';
import { useApp } from '../context/AppContext';
import { StateView } from '../components/common/StateView';
import { Badge } from '../components/common/Badge';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  Layers,
  BarChart3,
  Target,
} from 'lucide-react';
import { mockMarketDemandSkills } from '../data/mockSkillCoach';
import { SkillCategoryItem } from '../types';

export const SkillCoachPage: React.FC = () => {
  const { skills, setActiveTab } = useApp();

  const strongSkills = skills.filter((s: SkillCategoryItem) => s.status === 'Strong');
  const intermediateSkills = skills.filter((s: SkillCategoryItem) => s.status === 'Intermediate');
  const needsImprovementSkills = skills.filter((s: SkillCategoryItem) => s.status === 'Needs Improvement');
  const notLearnedSkills = skills.filter((s: SkillCategoryItem) => s.status === 'Not Yet Learned');

  const prioritizedSkills = skills
    .filter((s: SkillCategoryItem) => s.priority !== undefined)
    .sort((a: SkillCategoryItem, b: SkillCategoryItem) => (a.priority || 0) - (b.priority || 0));

  return (
    <StateView
      emptyTitle="Skill Analysis Pending"
      emptyMessage="The Skill Gap Agent will analyze your target roles once jobs are ingested."
    >
      <div>
        {/* Page Header */}
        <div className="page-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ai-primary)' }}>
                Skill Gap & Market Intelligence Agent
              </span>
              <Badge variant="ai">Principle 2: What → Why → What Next</Badge>
            </div>
            <h1 className="page-title">AI Skill Coach & Gap Intelligence</h1>
            <p className="page-subtitle">
              Strategic skill prioritization based on market frequency across 48 target Lead Gen AI positions.
            </p>
          </div>
          <div className="page-actions">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setActiveTab('learning')}
            >
              <GraduationCap size={14} /> Open Personalized Learning Plan
            </button>
          </div>
        </div>

        {/* Priority Action Ranking Banner */}
        <div
          className="card"
          style={{
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
            border: '1px solid var(--ai-border)',
          }}
        >
          <div className="card-header" style={{ marginBottom: '0.75rem' }}>
            <h2 className="card-title">
              <Sparkles size={18} color="var(--ai-primary)" />
              <span>Prioritized Strategic Skill Roadmap</span>
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Ordered by career ROI & target job frequency
            </span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            CareerOS Principle 3: Don't learn everything. Focus strictly on closing high-demand gaps for Lead Gen AI roles.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {prioritizedSkills.map((skill: SkillCategoryItem) => (
              <div
                key={skill.name}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  boxShadow: 'var(--shadow-xs)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--text-main)' }}>
                    {skill.name}
                  </span>
                  <Badge variant="warning">Priority #{skill.priority}</Badge>
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  Current: <strong>{skill.currentLevel}</strong> → Goal: <strong>{skill.targetLevel}</strong>
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--ai-primary)', fontWeight: 600 }}>
                  📈 {skill.marketDemand}% frequency in target job postings
                </div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    background: 'var(--bg-surface-subtle)',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    lineHeight: 1.4,
                  }}
                >
                  <strong>Next:</strong> {skill.whatNext}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Quadrants: Strong, Intermediate, Needs Improvement, Not Yet Learned */}
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>
          Categorized Skill Inventory & What → Why → What Next
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* 1. Strong Skills */}
          <div className="card">
            <div className="card-header" style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} color="#059669" />
                <h3 className="card-title" style={{ color: '#065f46' }}>
                  Strong Skills ({strongSkills.length})
                </h3>
              </div>
              <Badge variant="success">Core Strengths</Badge>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Exceeds standard target role expectations. Highlighted prominently in generated applications.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {strongSkills.map((s: SkillCategoryItem) => (
                <div
                  key={s.name}
                  style={{
                    padding: '0.9rem',
                    borderRadius: 'var(--radius-md)',
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#166534' }}>
                      {s.name}
                    </span>
                    <Badge variant="success">{s.currentLevel}</Badge>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#14532d', lineHeight: 1.4 }}>
                    <strong>Why it matters:</strong> {s.why}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#166534' }}>
                    <strong>What Next:</strong> {s.whatNext}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Intermediate Skills */}
          <div className="card">
            <div className="card-header" style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={18} color="#0284c7" />
                <h3 className="card-title" style={{ color: '#0369a1' }}>
                  Intermediate Skills ({intermediateSkills.length})
                </h3>
              </div>
              <Badge variant="neutral">Working Knowledge</Badge>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Solid foundation; deepen architectural nuances for Staff/Lead level interviews.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {intermediateSkills.map((s: SkillCategoryItem) => (
                <div
                  key={s.name}
                  style={{
                    padding: '0.9rem',
                    borderRadius: 'var(--radius-md)',
                    background: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#075985' }}>
                      {s.name}
                    </span>
                    <Badge variant="neutral">{s.currentLevel}</Badge>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#0c4a6e', lineHeight: 1.4 }}>
                    <strong>Why it matters:</strong> {s.why}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#0369a1' }}>
                    <strong>What Next:</strong> {s.whatNext}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Skills Needing Improvement */}
          <div className="card">
            <div className="card-header" style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={18} color="#d97706" />
                <h3 className="card-title" style={{ color: '#92400e' }}>
                  Needs Improvement ({needsImprovementSkills.length})
                </h3>
              </div>
              <Badge variant="warning">Active Focus Gaps</Badge>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Primary drivers of rejection risk or lower match affinity scores. Active learning tasks generated.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {needsImprovementSkills.map((s: SkillCategoryItem) => (
                <div
                  key={s.name}
                  style={{
                    padding: '0.9rem',
                    borderRadius: 'var(--radius-md)',
                    background: '#fffbeb',
                    border: '1px solid #fde68a',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#78350f' }}>
                      {s.name}
                    </span>
                    <Badge variant="warning">Priority #{s.priority}</Badge>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#713f12', lineHeight: 1.4 }}>
                    <strong>Why it matters:</strong> {s.why}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#854d0e' }}>
                    <strong>What Next:</strong> {s.whatNext}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Not Yet Learned Skills */}
          <div className="card">
            <div className="card-header" style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Target size={18} color="var(--ai-primary)" />
                <h3 className="card-title" style={{ color: 'var(--text-main)' }}>
                  Not Yet Learned ({notLearnedSkills.length})
                </h3>
              </div>
              <Badge variant="ai">Emerging Market Skills</Badge>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              High-growth technologies in the target market that will soon differentiate lead applicants.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {notLearnedSkills.map((s: SkillCategoryItem) => (
                <div
                  key={s.name}
                  style={{
                    padding: '0.9rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface-subtle)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      {s.name}
                    </span>
                    <Badge variant="ai">Target: {s.targetLevel}</Badge>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    <strong>Why it matters:</strong> {s.why}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--ai-primary)' }}>
                    <strong>What Next:</strong> {s.whatNext}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Market Skill Demand Chart Mock */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <BarChart3 size={18} color="var(--ai-primary)" />
              <span>Target Role Skill Frequency in Current Job Market</span>
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Sampled from 48 verified positions
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {mockMarketDemandSkills.map((m) => (
              <div key={m.skill} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--text-main)' }}>{m.skill}</span>
                  <span style={{ color: 'var(--ai-primary)' }}>{m.frequency}% of JDs</span>
                </div>
                <div
                  style={{
                    height: '6px',
                    background: 'var(--bg-surface-subtle)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${m.frequency}%`,
                      background: m.category === 'Emerging' ? 'var(--ai-gradient)' : 'var(--ai-primary)',
                      borderRadius: 'var(--radius-full)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StateView>
  );
};
