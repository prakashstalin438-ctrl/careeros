import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StateView } from '../components/common/StateView';
import { Badge } from '../components/common/Badge';
import {
  Sparkles,
  CheckCircle2,
  Cpu,
  ChevronDown,
  ChevronUp,
  Building2,
} from 'lucide-react';
import { mockInterviewQuestions } from '../data/mockInterview';
import { InterviewQuestion } from '../types';

export const InterviewPrepPage: React.FC = () => {
  const { addToast } = useApp();
  const [selectedMode, setSelectedMode] = useState<string>('All');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(mockInterviewQuestions[0].id);
  const [practiceAnswer, setPracticeAnswer] = useState<string>('');
  const [simulatedScore, setSimulatedScore] = useState<boolean>(false);

  const modes = ['All', 'System Design', 'Technical', 'Project', 'HR', 'Mock Interview'];

  const filteredQuestions = mockInterviewQuestions.filter((q: InterviewQuestion) => {
    if (selectedMode === 'All') return true;
    return q.mode === selectedMode;
  });

  const handleSimulateFeedback = () => {
    if (!practiceAnswer.trim()) {
      addToast({
        type: 'warning',
        title: 'Empty Response',
        message: 'Write a practice response before triggering simulated AI feedback.',
      });
      return;
    }
    setSimulatedScore(true);
    addToast({
      type: 'success',
      title: 'AI Interview Analysis Generated',
      message: 'Evaluated response structure against senior engineering rubrics.',
    });
  };

  return (
    <StateView
      emptyTitle="No interviews scheduled yet."
      emptyMessage="Select a target role or application to generate tailored interview preparation questions."
    >
      <div>
        {/* Page Header */}
        <div className="page-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ai-primary)' }}>
                Job-Specific & Skill-Gap Interview Intelligence
              </span>
              <Badge variant="ai">Interview Prep Drills</Badge>
            </div>
            <h1 className="page-title">Interview Preparation & Mock Drills</h1>
            <p className="page-subtitle">
              Personalized technical, architectural, behavioral, and simulation questions tailored to your active job applications.
            </p>
          </div>
          <div className="page-actions">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                setSelectedMode('System Design');
                setExpandedQuestionId(mockInterviewQuestions[0].id);
              }}
            >
              <Cpu size={14} /> Practice NexusAI System Design
            </button>
          </div>
        </div>

        {/* Target Job Context Spotlight */}
        <div
          className="card"
          style={{
            padding: '1.25rem 1.5rem',
            marginBottom: '1.75rem',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(139, 92, 246, 0.06) 100%)',
            border: '1px solid var(--ai-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--ai-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
              }}
            >
              <Building2 size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Target Context: NexusAI Platforms (Lead Gen AI Engineer)
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Round 2 System Design • Date: Oct 05, 2026 • Primary Evaluator: Principal Platform Architect
              </div>
            </div>
          </div>
          <Badge variant="ai" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', fontWeight: 700 }}>
            94% Profile Alignment
          </Badge>
        </div>

        {/* Mode Selector Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {modes.map((mode) => (
            <button
              key={mode}
              className={`btn btn-sm ${selectedMode === mode ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedMode(mode)}
              style={{ fontSize: '0.78rem' }}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Questions List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredQuestions.map((q: InterviewQuestion) => {
            const isExpanded = expandedQuestionId === q.id;
            return (
              <div
                key={q.id}
                className="card"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  borderLeft: '4px solid var(--ai-primary)',
                }}
              >
                {/* Question Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <Badge variant="ai">{q.mode}</Badge>
                      <Badge variant={q.difficulty === 'Hard' ? 'error' : 'warning'}>
                        {q.difficulty}
                      </Badge>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-light)' }}>
                        {q.roleTarget}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.4 }}>
                      {q.question}
                    </h3>
                  </div>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setExpandedQuestionId(isExpanded ? null : q.id);
                      setSimulatedScore(false);
                      setPracticeAnswer('');
                    }}
                  >
                    {isExpanded ? (
                      <>
                        Collapse <ChevronUp size={13} />
                      </>
                    ) : (
                      <>
                        Practice Question <ChevronDown size={13} />
                      </>
                    )}
                  </button>
                </div>

                {/* Context Tag */}
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <strong>Origin Context:</strong> {q.context}
                </div>

                {/* Expanded Drill View */}
                {isExpanded && (
                  <div
                    style={{
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1.25rem',
                    }}
                  >
                    {/* Key Discussion Points */}
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                        Key Technical Talking Points & Architecture Elements:
                      </h4>
                      <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {q.keyDiscussionPoints.map((point: string, idx: number) => (
                          <li key={idx} style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Model Answer Summary */}
                    <div
                      style={{
                        background: 'var(--bg-surface-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1rem',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                        <Sparkles size={14} color="var(--ai-primary)" />
                        <span>AI Reference Solution / Architecture Blueprint:</span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                        {q.modelAnswerSummary}
                      </p>
                    </div>

                    {/* Interactive Practice Response Area */}
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                        Practice Your Response (STAR Method or System Architecture Outline):
                      </label>
                      <textarea
                        rows={3}
                        value={practiceAnswer}
                        onChange={(e) => setPracticeAnswer(e.target.value)}
                        placeholder="Draft your bullet points or architectural response here..."
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-medium)',
                          fontSize: '0.82rem',
                          fontFamily: 'inherit',
                          outline: 'none',
                        }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                        <button className="btn btn-primary btn-sm" onClick={handleSimulateFeedback}>
                          <Sparkles size={13} /> Evaluate Response with AI Interview Agent
                        </button>
                      </div>
                    </div>

                    {/* Simulated Evaluation Criteria Feedback */}
                    {simulatedScore && (
                      <div
                        style={{
                          background: '#ecfdf5',
                          border: '1px solid #a7f3d0',
                          borderRadius: 'var(--radius-md)',
                          padding: '1rem',
                        }}
                      >
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#065f46', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <CheckCircle2 size={16} /> Rubric Feedback (Simulated Assessment):
                        </div>
                        <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          {q.aiFeedbackCriteria.map((c: string, i: number) => (
                            <li key={i} style={{ fontSize: '0.78rem', color: '#047857' }}>
                              {c} — <em>Verified strong in draft answer</em>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </StateView>
  );
};
