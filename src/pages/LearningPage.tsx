import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StateView } from '../components/common/StateView';
import { Badge } from '../components/common/Badge';
import {
  Calendar,
  CheckCircle2,
  Circle,
  FolderGit2,
  Clock,
  Sparkles,
  ArrowRight,
  Code2,
  FileCheck,
} from 'lucide-react';
import {
  mockThirtyDayMilestones,
  mockLearningProjects,
} from '../data/mockLearning';
import { LearningTask, LearningProject } from '../types';

export const LearningPage: React.FC = () => {
  const { learningTasks, toggleCompleteTask, setActiveTab } = useApp();
  const [activePlanTab, setActivePlanTab] = useState<'7-day' | '30-day' | 'projects'>('7-day');

  const completedTasks = learningTasks.filter((t: LearningTask) => t.completed).length;
  const progressPercent = learningTasks.length > 0 ? Math.round((completedTasks / learningTasks.length) * 100) : 0;

  return (
    <StateView
      emptyTitle="Your personalized learning plan will appear here."
      emptyMessage="No learning roadmaps are active. Career Coach will generate structured plans based on your skill gaps."
    >
      <div>
        {/* Page Header */}
        <div className="page-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ai-primary)' }}>
                Personalized Career Growth Engine
              </span>
              <Badge variant="ai">7-Day Sprint Active</Badge>
            </div>
            <h1 className="page-title">Learning Roadmaps & Portfolio Loop</h1>
            <p className="page-subtitle">
              Structured sprints, daily hands-on practice tasks, and project briefs designed to close your verified skill gaps.
            </p>
          </div>
          <div className="page-actions">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setActiveTab('skill-coach')}
            >
              View Skill Matrix
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setActiveTab('interview-prep')}
            >
              Test Knowledge in Interview Prep <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Top Progress & Sprint Status Card */}
        <div
          className="card"
          style={{
            padding: '1.5rem',
            marginBottom: '1.75rem',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
            border: '1px solid var(--ai-border)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="var(--ai-primary)" />
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Current Sprint: LangGraph & Model Serving Mastery
                </h2>
              </div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Targeting completion of <strong>Priority #1 Skill Gap</strong> before NexusAI System Design round on Oct 05.
              </div>
            </div>

            <div style={{ textAlign: 'right', minWidth: '180px' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ai-primary)' }}>
                {progressPercent}% Complete
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                {completedTasks} of {learningTasks.length} daily tasks finished
              </div>
            </div>
          </div>

          <div
            style={{
              height: '8px',
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
              marginTop: '1rem',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progressPercent}%`,
                background: 'var(--ai-gradient)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        {/* View Switcher Tabs: 7-Day Plan | 30-Day Plan | Portfolio Projects */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          <button
            className={`btn btn-sm ${activePlanTab === '7-day' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActivePlanTab('7-day')}
          >
            <Calendar size={14} /> 7-Day Sprint Plan
          </button>
          <button
            className={`btn btn-sm ${activePlanTab === '30-day' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActivePlanTab('30-day')}
          >
            <Clock size={14} /> 30-Day Comprehensive Roadmap
          </button>
          <button
            className={`btn btn-sm ${activePlanTab === 'projects' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActivePlanTab('projects')}
          >
            <FolderGit2 size={14} /> Recommended Portfolio Projects ({mockLearningProjects.length})
          </button>
        </div>

        {/* TAB 1: 7-Day Sprint Plan */}
        {activePlanTab === '7-day' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {learningTasks.map((task: LearningTask) => (
              <div
                key={task.id}
                className="card"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  borderLeft: task.completed ? '4px solid var(--color-success)' : '4px solid var(--ai-primary)',
                  background: task.completed ? 'rgba(240, 253, 244, 0.4)' : '#ffffff',
                }}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleCompleteTask(task.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    marginTop: '0.2rem',
                    color: task.completed ? 'var(--color-success)' : 'var(--text-light)',
                    padding: 0,
                  }}
                  title={task.completed ? 'Mark incomplete' : 'Mark completed'}
                >
                  {task.completed ? (
                    <CheckCircle2 size={22} style={{ fill: 'var(--color-success)', color: '#ffffff' }} />
                  ) : (
                    <Circle size={22} />
                  )}
                </button>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <Badge variant="neutral" style={{ fontWeight: 700 }}>
                        Day {task.day}
                      </Badge>
                      <h3
                        style={{
                          fontSize: '1rem',
                          fontWeight: 700,
                          color: task.completed ? 'var(--text-muted)' : 'var(--text-main)',
                          textDecoration: task.completed ? 'line-through' : 'none',
                        }}
                      >
                        {task.title}
                      </h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Badge variant={task.priority === 'High' ? 'warning' : 'neutral'}>
                        {task.priority} Priority
                      </Badge>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={13} /> ~{task.estimatedHours} hrs
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '0.4rem', lineHeight: 1.5 }}>
                    {task.description}
                  </p>

                  {/* Practice Task Box */}
                  <div
                    style={{
                      background: 'var(--bg-surface-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem 0.9rem',
                      marginTop: '0.65rem',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
                    }}
                  >
                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Code2 size={13} color="var(--ai-primary)" /> Hands-on Practice Challenge:
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontFamily: 'inherit' }}>
                      {task.practiceExercise}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: 30-Day Comprehensive Roadmap */}
        {activePlanTab === '30-day' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {mockThirtyDayMilestones.map((m) => (
              <div key={m.week} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {m.title}
                  </h3>
                  <Badge variant={m.week === 1 ? 'ai' : 'neutral'}>
                    {m.status}
                  </Badge>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  <strong>Curriculum Focus:</strong> {m.focus}
                </div>
                <div
                  style={{
                    background: 'var(--bg-surface-subtle)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.82rem',
                    color: 'var(--text-main)',
                  }}
                >
                  <strong>Target Milestone Outcome:</strong> {m.targetOutcome}
                </div>
                <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--text-light)' }}>
                  Estimated Effort: {m.totalHours} hours total • {m.completedHours} completed
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: Recommended Portfolio Projects */}
        {activePlanTab === 'projects' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              CareerOS connects learning directly to tangible portfolio evidence and truthful resume bullet points.
            </div>
            {mockLearningProjects.map((proj: LearningProject) => (
              <div key={proj.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      {proj.title}
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--ai-primary)', fontWeight: 600, marginTop: '0.15rem' }}>
                      Target Role Fit: {proj.targetRole}
                    </div>
                  </div>
                  <Badge variant="ai">{proj.status}</Badge>
                </div>

                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {proj.description}
                </p>

                {/* Demonstrated Skills */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    Skills Demonstrated:
                  </span>
                  {proj.demonstratedSkills.map((s: string, i: number) => (
                    <Badge key={i} variant="neutral">
                      {s}
                    </Badge>
                  ))}
                </div>

                {/* Architecture & Portfolio Details */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  <div style={{ background: 'var(--bg-surface-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                      System Architecture:
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {proj.architectureDetails}
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-surface-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                      Portfolio Artifact / Evidence:
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {proj.portfolioEvidence}
                    </div>
                  </div>
                </div>

                {/* Truthful Resume Bullet */}
                <div
                  style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                    <FileCheck size={14} /> Truthful Resume Bullet Generated on Completion:
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#14532d', fontStyle: 'italic' }}>
                    "{proj.truthfulResumeBullet}"
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
