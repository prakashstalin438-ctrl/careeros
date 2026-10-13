import { AIAgentStatus } from '../types';

export interface ActivityItem {
  id: string;
  type: 'application' | 'match' | 'learning' | 'interview';
  title: string;
  description: string;
  timestamp: string;
  tag: string;
  linkTab?: string;
}

export const mockActivities: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'interview',
    title: 'Interview Scheduled: NexusAI Platforms',
    description: 'Round 2 System Design for Lead Gen AI role confirmed for Oct 05 at 3:00 PM IST.',
    timestamp: '2 hours ago',
    tag: 'Interview',
    linkTab: 'interview-prep',
  },
  {
    id: 'act-2',
    type: 'learning',
    title: 'Practice Task Completed: LangGraph Checkpointing',
    description: 'Finished Day 2 state persistence exercise with AsyncPostgreSQL storage.',
    timestamp: '5 hours ago',
    tag: 'Learning',
    linkTab: 'learning',
  },
  {
    id: 'act-3',
    type: 'application',
    title: 'Application Draft Ready for Review: Aether Cloud',
    description: 'Approval queue ready: Tailored v2.4 resume generated with 84% match score.',
    timestamp: 'Yesterday',
    tag: 'Approval Mode',
    linkTab: 'applications',
  },
  {
    id: 'act-4',
    type: 'match',
    title: 'New High-Match Job Discovered: Synth Labs',
    description: 'Staff LLM Systems Engineer matched your profile at 89% affinity from verified tech feed.',
    timestamp: '2 days ago',
    tag: 'Job Discovery',
    linkTab: 'find-jobs',
  },
  {
    id: 'act-5',
    type: 'application',
    title: 'Offer Letter Received: Prism Analytics',
    description: 'Formal package received for Backend AI Systems Developer (CTC ₹34.5 LPA).',
    timestamp: '3 days ago',
    tag: 'Offer',
    linkTab: 'applications',
  },
];

export const mockAICareerInsights = [
  {
    id: 'ins-1',
    type: 'high-impact',
    headline: 'LangGraph mastery unlocks 8 additional Senior AI roles (+₹8 LPA avg salary)',
    detail: 'Analysis of 48 active matching roles in Bengaluru & Remote shows that adding verified multi-agent graph experience increases your match threshold pass rate from 72% to 94%.',
    actionText: 'Resume 7-Day LangGraph Sprint',
    targetTab: 'learning',
  },
  {
    id: 'ins-2',
    type: 'recommendation',
    headline: 'Upcoming NexusAI System Design Interview: Focus on Hybrid Search & RRF',
    detail: 'NexusAI’s architecture heavily uses Qdrant hybrid retrieval. Re-read the System Design prep drill on Reciprocal Rank Fusion and cross-encoder latency trade-offs.',
    actionText: 'Open Interview Drill',
    targetTab: 'interview-prep',
  },
];

export const mockAIAgents: AIAgentStatus[] = [
  {
    id: 'agent-orch',
    name: 'Career Orchestrator',
    role: 'Coordinates specialized sub-agents and manages career state loops.',
    status: 'ready',
    lastAction: 'Synchronized profile changes with 48 discovered jobs',
  },
  {
    id: 'agent-disc',
    name: 'Job Discovery Agent',
    role: 'Discovers verified openings from authorized adapters and career pages.',
    status: 'idle',
    lastAction: 'Scanned 12 partner feeds; found 2 new high-match positions',
  },
  {
    id: 'agent-match',
    name: 'Matching Agent',
    role: 'Calculates requirement-to-profile affinity and explainable reasoning.',
    status: 'ready',
    lastAction: 'Updated match breakdown for NexusAI (94%) and Synth Labs (89%)',
  },
  {
    id: 'agent-skill',
    name: 'Skill Gap Agent',
    role: 'Maps job requirements to your career digital twin to identify missing skills.',
    status: 'idle',
    lastAction: 'Prioritized LangGraph, Triton Server, and Kubernetes as top 3 gaps',
  },
  {
    id: 'agent-app',
    name: 'Application Agent',
    role: 'Prepares truthful application materials adhering to the selected operating mode.',
    status: 'ready',
    lastAction: 'Prepared approval draft for Aether Cloud Innovations',
  },
  {
    id: 'agent-coach',
    name: 'Career Coach Agent',
    role: 'Generates structured roadmaps, project briefs, and interview drills.',
    status: 'idle',
    lastAction: 'Updated Day 3 practice task in 7-day sprint plan',
  },
];
