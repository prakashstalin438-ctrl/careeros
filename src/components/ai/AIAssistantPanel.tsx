import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Sparkles,
  Bot,
  Send,
  Target,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { mockAIAgents } from '../../data/mockActivity';

export const AIAssistantPanel: React.FC = () => {
  const { aiPanelOpen, toggleAiPanel, operatingMode, activeTab, setActiveTab } = useApp();
  const [messages, setMessages] = useState<
    { sender: 'ai' | 'user'; text: string; time: string; action?: { label: string; tab: string } }[]
  >([
    {
      sender: 'ai',
      text: `Hello Alex! I am the CareerOS Orchestrator coordinating your 6 specialized career agents. You are currently in ${operatingMode.toUpperCase()} mode. How can we accelerate your journey toward Lead Gen AI Engineer today?`,
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [activeTabSub, setActiveTabSub] = useState<'chat' | 'agents'>('chat');

  if (!aiPanelOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: query,
      time: 'Just now',
    };

    let replyText = '';
    let actionItem: { label: string; tab: string } | undefined = undefined;

    if (query.toLowerCase().includes('gap') || query.toLowerCase().includes('skill')) {
      replyText = `Based on our Skill Gap Agent analysis of 48 active target roles, your #1 high-impact gap is LangGraph (cyclic graph multi-agent systems). Closing this increases your target job match pass rate from 72% to 94%.`;
      actionItem = { label: 'Open 7-Day Sprint Plan', tab: 'learning' };
    } else if (query.toLowerCase().includes('nexus') || query.toLowerCase().includes('interview')) {
      replyText = `For NexusAI Platforms (Lead Gen AI Engineer), your match score is 94%. Your Round 2 System Design interview is scheduled for Oct 05. The primary focus is multi-stage RAG ingestion and reciprocal rank fusion reranking.`;
      actionItem = { label: 'Launch System Design Drill', tab: 'interview-prep' };
    } else if (query.toLowerCase().includes('mode') || query.toLowerCase().includes('auto')) {
      replyText = `CareerOS is operating in ${operatingMode.toUpperCase()} mode. In Approval Mode, we draft truthful applications, tailor your verified resume bullet points, and prompt you for final confirmation before submitting to authorized endpoints.`;
      actionItem = { label: 'Configure Auto Rules', tab: 'preferences' };
    } else {
      replyText = `Understood! I've consulted with the Matching Agent and Career Coach Agent. We recommend completing Day 3 of your LangGraph sprint to demonstrate verifiable multi-agent human-in-the-loop workflows.`;
      actionItem = { label: 'View Skill Coach', tab: 'skill-coach' };
    }

    setMessages((prev) => [
      ...prev,
      userMsg,
      {
        sender: 'ai',
        text: replyText,
        time: 'Just now',
        action: actionItem,
      },
    ]);
    setInput('');
  };

  const quickPrompts = [
    'What skill gap should I prioritize next?',
    'Review my readiness for NexusAI interview',
    'How does Approval Mode protect my profile?',
  ];

  return (
    <>
      <div className="ai-panel-overlay" onClick={toggleAiPanel} />
      <aside className="ai-panel">
        <div className="ai-panel-header">
          <div className="ai-panel-title">
            <Sparkles size={18} color="var(--ai-primary)" />
            <span>AI Career Orchestrator</span>
          </div>
          <button
            onClick={toggleAiPanel}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.25rem',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Sub-tabs: Chat vs Agent Swarm */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface-subtle)',
            padding: '0.4rem 1rem',
            gap: '0.5rem',
          }}
        >
          <button
            onClick={() => setActiveTabSub('chat')}
            style={{
              flex: 1,
              padding: '0.4rem',
              border: 'none',
              background: activeTabSub === 'chat' ? '#ffffff' : 'transparent',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '0.78rem',
              color: activeTabSub === 'chat' ? 'var(--text-main)' : 'var(--text-muted)',
              cursor: 'pointer',
              boxShadow: activeTabSub === 'chat' ? 'var(--shadow-xs)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
            }}
          >
            <Bot size={14} /> Career Assistant
          </button>
          <button
            onClick={() => setActiveTabSub('agents')}
            style={{
              flex: 1,
              padding: '0.4rem',
              border: 'none',
              background: activeTabSub === 'agents' ? '#ffffff' : 'transparent',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '0.78rem',
              color: activeTabSub === 'agents' ? 'var(--text-main)' : 'var(--text-muted)',
              cursor: 'pointer',
              boxShadow: activeTabSub === 'agents' ? 'var(--shadow-xs)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
            }}
          >
            <Layers size={14} /> Agent Swarm ({mockAIAgents.length})
          </button>
        </div>

        {activeTabSub === 'chat' ? (
          <>
            <div className="ai-panel-body">
              {/* Current Context Pill */}
              <div
                style={{
                  background: 'var(--ai-gradient-subtle)',
                  border: '1px solid var(--ai-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--ai-primary)',
                }}
              >
                <Target size={14} />
                <span>
                  Context: Viewing <strong>{activeTab.toUpperCase()}</strong> in{' '}
                  <strong>{operatingMode.toUpperCase()}</strong> mode
                </span>
              </div>

              {/* Message List */}
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start',
                    gap: '0.3rem',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '85%',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-lg)',
                      fontSize: '0.84rem',
                      lineHeight: 1.45,
                      background:
                        m.sender === 'user'
                          ? 'var(--ai-primary)'
                          : 'var(--bg-surface-subtle)',
                      color: m.sender === 'user' ? '#ffffff' : 'var(--text-main)',
                      border:
                        m.sender === 'user'
                          ? 'none'
                          : '1px solid var(--border-subtle)',
                    }}
                  >
                    {m.text}
                    {m.action && (
                      <div style={{ marginTop: '0.75rem' }}>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setActiveTab(m.action!.tab);
                            toggleAiPanel();
                          }}
                          style={{
                            fontSize: '0.75rem',
                            padding: '0.3rem 0.65rem',
                            background: '#4f46e5',
                          }}
                        >
                          {m.action.label} <ArrowRight size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-light)' }}>
                    {m.time}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick Prompts */}
            <div
              style={{
                padding: '0.5rem 1rem',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
              }}
            >
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Suggested Prompts:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {quickPrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(p)}
                    style={{
                      background: 'var(--bg-surface-subtle)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-full)',
                      padding: '0.25rem 0.6rem',
                      fontSize: '0.72rem',
                      color: 'var(--text-main)',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Input */}
            <div
              style={{
                padding: '1rem',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                gap: '0.5rem',
                background: 'var(--bg-surface)',
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask your career agent orchestrator..."
                style={{
                  flex: 1,
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  fontSize: '0.82rem',
                  outline: 'none',
                }}
              />
              <button
                className="btn btn-primary"
                onClick={() => handleSend()}
                style={{ padding: '0.6rem 0.85rem' }}
              >
                <Send size={15} />
              </button>
            </div>
          </>
        ) : (
          <div className="ai-panel-body">
            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                lineHeight: 1.4,
                marginBottom: '0.5rem',
              }}
            >
              CareerOS uses a multi-agent cooperative architecture (Section 5, CAREEROS_MASTER.md).
            </div>
            {mockAIAgents.map((agent) => (
              <div
                key={agent.id}
                style={{
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    {agent.name}
                  </span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      padding: '0.15rem 0.45rem',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 600,
                      background:
                        agent.status === 'ready'
                          ? 'var(--color-success-bg)'
                          : 'rgba(99, 102, 241, 0.1)',
                      color:
                        agent.status === 'ready'
                          ? '#065f46'
                          : 'var(--ai-primary)',
                      border:
                        agent.status === 'ready'
                          ? '1px solid var(--color-success-border)'
                          : '1px solid rgba(99, 102, 241, 0.25)',
                    }}
                  >
                    {agent.status.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  {agent.role}
                </div>
                <div
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-main)',
                    marginTop: '0.2rem',
                    background: '#ffffff',
                    padding: '0.35rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <strong>Latest:</strong> {agent.lastAction}
                </div>
              </div>
            ))}
          </div>
        )}
      </aside>
    </>
  );
};
