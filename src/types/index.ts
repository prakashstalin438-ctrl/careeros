export type OperatingMode = 'auto' | 'approval' | 'coach';

export type ApplicationStatus = 
  | 'Saved'
  | 'Ready'
  | 'Applied'
  | 'Under Review'
  | 'Assessment'
  | 'Interview'
  | 'Offer'
  | 'Rejected';

export type WorkMode = 'Remote' | 'Hybrid' | 'Onsite';

export interface NormalizedJob {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  workMode: WorkMode;
  salary: string;
  experience: string;
  matchScore: number;
  matchReasoning: string;
  requiredSkills: string[];
  preferredSkills: string[];
  matchingSkills: string[];
  missingSkills: string[];
  description: string;
  responsibilities: string[];
  source: string;
  sourceUrl: string;
  applyUrl: string;
  postedAt: string;
  saved: boolean;
  featured?: boolean;
}

export interface ApplicationItem {
  id: string;
  jobId: string;
  company: string;
  role: string;
  location: string;
  matchScore: number;
  appliedDate: string;
  resumeVersion: string;
  status: ApplicationStatus;
  nextAction: string;
  nextActionDate?: string;
  source: string;
  notes?: string;
  timeline: {
    date: string;
    status: ApplicationStatus;
    note: string;
  }[];
}

export interface SkillCategoryItem {
  name: string;
  category: 'Core AI/ML' | 'Backend Systems' | 'Cloud & DevOps' | 'Languages & Tools';
  currentLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  targetLevel: 'Intermediate' | 'Advanced' | 'Expert';
  status: 'Strong' | 'Intermediate' | 'Needs Improvement' | 'Not Yet Learned';
  priority?: 1 | 2 | 3 | 4;
  marketDemand: number; // e.g. 92%
  what: string;
  why: string;
  whatNext: string;
  recommendedProject?: string;
}

export interface LearningTask {
  id: string;
  title: string;
  day?: number;
  week?: number;
  skill: string;
  priority: 'High' | 'Medium' | 'Low';
  estimatedHours: number;
  description: string;
  practiceExercise: string;
  completed: boolean;
}

export interface LearningProject {
  id: string;
  title: string;
  targetRole: string;
  demonstratedSkills: string[];
  difficulty: 'Intermediate' | 'Advanced';
  timeEstimate: string;
  description: string;
  architectureDetails: string;
  portfolioEvidence: string;
  truthfulResumeBullet: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
}

export interface InterviewQuestion {
  id: string;
  mode: 'Technical' | 'HR' | 'Project' | 'System Design' | 'Mock Interview';
  roleTarget: string;
  question: string;
  relatedSkillGap?: string;
  context: string;
  keyDiscussionPoints: string[];
  modelAnswerSummary: string;
  aiFeedbackCriteria: string[];
  difficulty: 'Medium' | 'Hard';
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface User {
  id: string; // Permanent Firebase UID
  uid?: string;
  email?: string;
  phoneNumber?: string;
  name: string;
  displayName?: string;
  avatarUrl?: string;
  photoURL?: string;
  authProvider?: 'password' | 'google' | 'phone';
  createdAt: string;
  lastLoginAt?: string;
  isDemo?: boolean;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: number;
}

export interface ParsedResumeData {
  rawText: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    title?: string;
    summary: string;
  };
  portfolioLinks: {
    github: string;
    linkedin: string;
    portfolio: string;
    huggingface?: string;
  };
  skills: {
    name: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    category: string;
    years?: number;
  }[];
  experience: {
    id?: string;
    role: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string[];
  }[];
  education: {
    id?: string;
    degree: string;
    institution: string;
    field?: string;
    startDate?: string;
    endDate?: string;
    year: string;
    gpa?: string;
    honors?: string;
  }[];
  projects: {
    id?: string;
    title: string;
    description: string;
    technologies: string[];
    link?: string;
    metrics: string;
  }[];
  certifications: {
    id?: string;
    name: string;
    issuer: string;
    issueDate: string;
    credentialId?: string;
    credentialUrl?: string;
  }[];
  missingFields: string[];
  parsingConfidence: number;
}

export interface UserProfile {
  id?: string;
  userId?: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  avatarUrl?: string;
  careerReadinessScore: number;
  targetRole: string;
  targetLevel: string;
  targetIndustries: string[];
  yearsExperience: number;
  portfolioLinks: {
    github: string;
    linkedin: string;
    portfolio: string;
    huggingface?: string;
  };
  skills: {
    name: string;
    level: string;
    category: string;
    years?: number;
  }[];
  experience: {
    id: string;
    role: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string[];
  }[];
  education: {
    id: string;
    degree: string;
    institution: string;
    field?: string;
    startDate?: string;
    endDate?: string;
    year: string;
    gpa?: string;
    honors?: string;
  }[];
  projects: {
    id: string;
    title: string;
    description: string;
    technologies: string[];
    link?: string;
    metrics: string;
  }[];
  certifications: {
    id: string;
    name: string;
    issuer: string;
    issueDate: string;
    credentialId?: string;
    credentialUrl?: string;
  }[];
}

export interface ResumeVersion {
  id: string;
  userId?: string;
  name: string;
  version: string;
  versionNumber?: number;
  lastUpdated: string;
  uploadedAt?: string;
  isPrimary: boolean;
  targetFocus: string;
  atsScore: number;
  tailoredApplicationsCount: number;
  fileSize?: number;
  fileType?: string;
  storageKey?: string;
  extractedData?: ParsedResumeData;
}

export interface JobPreferences {
  targetRoles: string[];
  preferredLocations: string[];
  workModes: WorkMode[];
  minimumSalary: number; // in LPA
  experienceLevel: string;
  matchThreshold: number; // e.g. 75
  applicationMode: OperatingMode;
  autoApplyDailyLimit: number;
  requireSkillVerification: boolean;
  notifyOnApplicationPrep: boolean;
}

export interface AIAgentStatus {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'analyzing' | 'ready' | 'syncing';
  lastAction: string;
}

export type ViewState = 'normal' | 'loading' | 'empty' | 'error';
