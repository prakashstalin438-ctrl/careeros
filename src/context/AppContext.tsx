import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  OperatingMode,
  NormalizedJob,
  ApplicationItem,
  UserProfile,
  JobPreferences,
  SkillCategoryItem,
  LearningTask,
  ViewState,
  User,
  ResumeVersion,
  ParsedResumeData,
  AuthStatus,
  DemoNoticeState,
} from '../types';
import { mockJobs } from '../data/mockJobs';
import { mockPreferences } from '../data/mockPreferences';
import { mockProfile, mockResumeVersions } from '../data/mockProfile';
import { mockApplications } from '../data/mockApplications';
import { mockSevenDayPlan } from '../data/mockLearning';
import { mockSkills } from '../data/mockSkillCoach';
import { authService } from '../services/authService';
import {
  subscribeToUserProfile,
  saveUserProfileToFirestore,
  initEmptyProfile,
  saveResumeVersionMetadata,
  fetchUserResumeVersions,
  deleteResumeVersionMetadata,
} from '../services/firestoreService';
import { resumeStorageService } from '../services/storageService';
import { resumeParserService } from '../services/resumeParserService';

export interface Toast {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
}

const EMPTY_PROFILE: UserProfile = {
  name: '',
  title: '',
  email: '',
  phone: '',
  location: '',
  summary: '',
  avatarUrl: '',
  careerReadinessScore: 0,
  targetRole: '',
  targetLevel: '',
  targetIndustries: [],
  yearsExperience: 0,
  portfolioLinks: {
    github: '',
    linkedin: '',
    portfolio: '',
    huggingface: '',
  },
  skills: [],
  experience: [],
  education: [],
  projects: [],
  certifications: [],
};

interface AppContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  operatingMode: OperatingMode;
  setOperatingMode: (mode: OperatingMode) => void;
  aiPanelOpen: boolean;
  setAiPanelOpen: (open: boolean) => void;
  toggleAiPanel: () => void;
  viewState: ViewState;
  setViewState: (state: ViewState) => void;

  // Demo Mode Controls & Explanations
  isDemoMode: boolean;
  enterDemoMode: () => void;
  exitDemoMode: () => void;
  demoNoticeModal: DemoNoticeState | null;
  showDemoNotice: (
    title: string,
    message: string,
    actionName?: string,
    category?: DemoNoticeState['category']
  ) => void;
  closeDemoNoticeModal: () => void;

  // Real Firebase Authentication State & Actions
  user: User | null;
  authStatus: AuthStatus;
  isAuthenticated: boolean;
  loginWithGoogle: () => Promise<User>;
  sendPhoneOTP: (countryCode: string, localNumber: string, recaptchaContainerId?: string) => Promise<{ success: boolean; cooldownSeconds: number }>;
  verifyPhoneOTP: (otp: string) => Promise<User>;
  linkGoogleAccount: () => Promise<User>;
  logout: () => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;

  // Real-time Firestore Profile & Application Data
  jobs: NormalizedJob[];
  toggleSaveJob: (jobId: string) => void;
  applications: ApplicationItem[];
  submitApplication: (jobId: string, notes?: string, resumeVersionName?: string) => void;
  profile: UserProfile;
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
  preferences: JobPreferences;
  updatePreferences: (updated: Partial<JobPreferences>) => void;
  skills: SkillCategoryItem[];
  learningTasks: LearningTask[];
  toggleCompleteTask: (taskId: string) => void;

  // Resume Intelligence & Version Storage
  resumeVersions: ResumeVersion[];
  selectedVersionId: string;
  setSelectedVersionId: (id: string) => void;
  activeResumeVersion: ResumeVersion | null;
  setPrimaryResumeVersion: (versionId: string) => Promise<void>;
  deleteResumeVersion: (versionId: string) => Promise<void>;
  downloadResumeFile: (versionId: string) => Promise<void>;
  uploadAndParseResume: (file: File) => Promise<ResumeVersion>;
  isUploading: boolean;
  uploadProgress: number;
  uploadError: string | null;

  // Resume Review Modal
  isReviewModalOpen: boolean;
  reviewedParsedData: ParsedResumeData | null;
  reviewedVersion: ResumeVersion | null;
  openReviewModal: (data: ParsedResumeData, version: ResumeVersion) => void;
  closeReviewModal: () => void;
  applyReviewedDataToProfile: (data: Partial<UserProfile>) => Promise<void>;

  // Active Modals & Selections
  selectedJobForDetails: NormalizedJob | null;
  openJobDetails: (job: NormalizedJob) => void;
  closeJobDetails: () => void;

  selectedJobForApply: NormalizedJob | null;
  openApplyModal: (job: NormalizedJob) => void;
  closeApplyModal: () => void;

  isEditProfileOpen: boolean;
  openEditProfile: () => void;
  closeEditProfile: () => void;

  // Toast System
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [operatingMode, setOperatingModeState] = useState<OperatingMode>('approval');
  const [aiPanelOpen, setAiPanelOpen] = useState<boolean>(false);
  const [viewState, setViewState] = useState<ViewState>('normal');

  // Demo Mode State Initialization
  const checkInitialDemo = (): boolean => {
    if (typeof window === 'undefined') return false;
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('demo') === 'true') return true;
    try {
      return localStorage.getItem('careeros_demo_mode') === 'true';
    } catch {
      return false;
    }
  };

  const initialDemo = checkInitialDemo();
  const [isDemoMode, setIsDemoMode] = useState<boolean>(initialDemo);
  const [demoNoticeModal, setDemoNoticeModal] = useState<DemoNoticeState | null>(null);

  // Firebase Auth State
  const [user, setUser] = useState<User | null>(authService.getCurrentUser());
  const [authStatus, setAuthStatus] = useState<AuthStatus>(authService.getAuthStatus());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Profile & Resume State (Pre-populated with rich fictional dataset if Demo Mode)
  const [profile, setProfile] = useState<UserProfile>(initialDemo ? mockProfile : EMPTY_PROFILE);
  const [resumeVersions, setResumeVersions] = useState<ResumeVersion[]>(initialDemo ? mockResumeVersions : []);
  const [selectedVersionId, setSelectedVersionId] = useState<string>(
    initialDemo && mockResumeVersions.length > 0 ? mockResumeVersions[0].id : ''
  );

  // Resume Upload & Review State
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [reviewedParsedData, setReviewedParsedData] = useState<ParsedResumeData | null>(null);
  const [reviewedVersion, setReviewedVersion] = useState<ResumeVersion | null>(null);

  // Application & Job Pipeline Data
  const [jobs, setJobs] = useState<NormalizedJob[]>(mockJobs);
  const [applications, setApplications] = useState<ApplicationItem[]>(initialDemo ? mockApplications : []);
  const [preferences, setPreferences] = useState<JobPreferences>(mockPreferences);
  const [learningTasks, setLearningTasks] = useState<LearningTask[]>(initialDemo ? mockSevenDayPlan : []);

  const [selectedJobForDetails, setSelectedJobForDetails] = useState<NormalizedJob | null>(null);
  const [selectedJobForApply, setSelectedJobForApply] = useState<NormalizedJob | null>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Centralized Firebase Auth & Real-Time Firestore Synchronization
  useEffect(() => {
    let unsubscribeProfileListener: (() => void) | null = null;

    const unsubscribeAuth = authService.subscribe(async (firebaseUser, status) => {
      setUser(firebaseUser);
      setAuthStatus(status);

      if (unsubscribeProfileListener) {
        unsubscribeProfileListener();
        unsubscribeProfileListener = null;
      }

      if (firebaseUser) {
        // Authenticated user detected: Disable demo mode and load real user assets
        setIsDemoMode(false);
        try {
          localStorage.removeItem('careeros_demo_mode');
        } catch {}

        // 1. Real-time Firestore Profile Listener
        unsubscribeProfileListener = subscribeToUserProfile(
          firebaseUser.id,
          async (realtimeProfile) => {
            if (realtimeProfile) {
              setProfile(realtimeProfile);
            } else {
              // Initialize truthful empty profile in profiles/{uid} if first login
              try {
                const newProfile = await initEmptyProfile(firebaseUser.id, {
                  name: firebaseUser.name,
                  email: firebaseUser.email,
                  phone: firebaseUser.phoneNumber,
                  avatarUrl: firebaseUser.avatarUrl,
                });
                setProfile(newProfile);
              } catch (initErr) {
                console.warn('Could not initialize empty Firestore profile:', initErr);
              }
            }
          }
        );

        // 2. Fetch User Resume Versions from Firestore & IndexedDB
        try {
          const versions = await fetchUserResumeVersions(firebaseUser.id);
          setResumeVersions(versions);
          if (versions.length > 0) {
            setSelectedVersionId(versions[0].id);
          } else {
            setSelectedVersionId('');
          }
        } catch (fetchErr) {
          console.warn('Could not fetch resume versions from Firestore:', fetchErr);
          setResumeVersions([]);
          setSelectedVersionId('');
        }
      } else {
        // Unauthenticated: Clear user data only if NOT in Demo Mode
        if (!isDemoMode && !checkInitialDemo()) {
          setProfile(EMPTY_PROFILE);
          setResumeVersions([]);
          setSelectedVersionId('');
          setApplications([]);
          setLearningTasks([]);
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfileListener) {
        unsubscribeProfileListener();
      }
    };
  }, [isDemoMode]);

  // Demo Mode Handlers
  const enterDemoMode = () => {
    setIsDemoMode(true);
    try {
      localStorage.setItem('careeros_demo_mode', 'true');
    } catch {}
    setProfile(mockProfile);
    setResumeVersions(mockResumeVersions);
    if (mockResumeVersions.length > 0) {
      setSelectedVersionId(mockResumeVersions[0].id);
    }
    setApplications(mockApplications);
    setLearningTasks(mockSevenDayPlan);
    setJobs(mockJobs);
    setPreferences(mockPreferences);
    setActiveTab('dashboard');
    setIsAuthModalOpen(false);
    addToast({
      type: 'info',
      title: '✨ Demo Mode Activated',
      message: 'Exploring CareerOS with sample candidate Alex Rivera (Lead Gen AI Engineer). Fictional data loaded.',
    });
  };

  const exitDemoMode = () => {
    setIsDemoMode(false);
    try {
      localStorage.removeItem('careeros_demo_mode');
    } catch {}
    if (!user) {
      setProfile(EMPTY_PROFILE);
      setResumeVersions([]);
      setSelectedVersionId('');
      setApplications([]);
      setLearningTasks([]);
    }
    setActiveTab('dashboard');
    addToast({
      type: 'info',
      title: 'Exited Demo Mode',
      message: 'Sign in to access your personal CareerOS workspace.',
    });
  };

  const showDemoNotice = (
    title: string,
    message: string,
    actionName?: string,
    category?: DemoNoticeState['category']
  ) => {
    setDemoNoticeModal({
      isOpen: true,
      title,
      message,
      actionName,
      category: category || 'general',
    });
  };

  const closeDemoNoticeModal = () => {
    setDemoNoticeModal(null);
  };

  // Real-time Profile Updating in Firestore (or local state in Demo Mode)
  const updateProfile = async (updated: Partial<UserProfile>): Promise<void> => {
    // Update local state immediately for instant responsive UI
    setProfile((prev) => ({ ...prev, ...updated }));

    if (isDemoMode || !user) {
      addToast({
        type: 'info',
        title: 'Demo Profile Updated',
        message: 'Changes updated for this demo session. Sign in with Google to save permanently.',
      });
      return;
    }

    try {
      await saveUserProfileToFirestore(user.id, updated);
      addToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your Career Digital Twin has been saved to Firestore.',
      });
    } catch (err: any) {
      console.error('Error persisting profile to Firestore:', err);
      addToast({
        type: 'error',
        title: 'Sync Warning',
        message: 'Unable to write profile updates to Firestore. Check connection or security rules.',
      });
    }
  };

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setOperatingMode = (mode: OperatingMode) => {
    setOperatingModeState(mode);
    const modeNames = {
      auto: '⚡ Auto Apply Mode',
      approval: '🛡️ Approval Mode',
      coach: '🧠 Coach Mode',
    };
    const modeDescriptions = {
      auto: 'Automated evaluation within safety boundaries and daily caps.',
      approval: 'AI drafts tailored packages awaiting your review and approval before submission.',
      coach: 'Focuses on skill gap intelligence, personalized learning plans, and interview drills.',
    };
    addToast({
      type: 'info',
      title: `Switched to ${modeNames[mode]}`,
      message: modeDescriptions[mode],
    });
  };

  const toggleAiPanel = () => {
    setAiPanelOpen((prev) => !prev);
  };

  const toggleSaveJob = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          const nextState = !j.saved;
          addToast({
            type: nextState ? 'success' : 'info',
            title: nextState ? 'Job Saved' : 'Job Removed',
            message: `${j.title} at ${j.company}`,
          });
          return { ...j, saved: nextState };
        }
        return j;
      })
    );
  };

  const submitApplication = (jobId: string, notes?: string, resumeVersionName?: string) => {
    const targetJob = jobs.find((j) => j.id === jobId);
    if (!targetJob) return;

    const primaryResume = resumeVersions.find((v) => v.isPrimary) || resumeVersions[0];
    const resumeFilename = resumeVersionName || (primaryResume ? primaryResume.name : 'Primary_Resume.pdf');

    const newApp: ApplicationItem = {
      id: `app-${Date.now()}`,
      jobId: targetJob.id,
      company: targetJob.company,
      role: targetJob.title,
      location: targetJob.location,
      matchScore: targetJob.matchScore,
      appliedDate: new Date().toISOString().split('T')[0],
      resumeVersion: resumeFilename,
      status: operatingMode === 'auto' ? 'Applied' : 'Ready',
      nextAction:
        operatingMode === 'auto'
          ? 'Auto Apply queued'
          : operatingMode === 'approval'
          ? 'Review & Apply package awaiting user sign-off'
          : 'Role queued in Coach prep roadmap',
      source: targetJob.source,
      notes: notes || 'Application package recorded in CareerOS.',
      timeline: [
        {
          date: new Date().toISOString().split('T')[0],
          status: operatingMode === 'auto' ? 'Applied' : 'Ready',
          note: `Tailored package prepared using ${resumeFilename}.`,
        },
      ],
    };

    setApplications((prev) => [newApp, ...prev]);

    if (isDemoMode) {
      showDemoNotice(
        'Simulated Application Recorded',
        `Your application package for ${targetJob.title} at ${targetJob.company} has been queued on your sample pipeline board. In production, this package is reviewed and dispatched to the employer.`,
        'Submit Application',
        'apply'
      );
    } else {
      addToast({
        type: 'info',
        title:
          operatingMode === 'auto'
            ? 'Auto Apply Queued'
            : operatingMode === 'approval'
            ? 'Review & Apply Prepared'
            : 'Preparation Saved',
        message: `Application package registered for ${targetJob.title} at ${targetJob.company}.`,
      });
    }
  };

  const updatePreferences = (updated: Partial<JobPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updated }));
    addToast({
      type: 'success',
      title: 'Preferences Saved',
      message: 'Target roles and thresholds updated successfully.',
    });
  };

  const toggleCompleteTask = (taskId: string) => {
    setLearningTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const completed = !t.completed;
          addToast({
            type: completed ? 'success' : 'info',
            title: completed ? 'Task Completed' : 'Task Reopened',
            message: t.title,
          });
          return { ...t, completed };
        }
        return t;
      })
    );
  };

  // Resume Upload, Client-side Parsing, and Dual-Storage (IndexedDB blob + Firestore metadata)
  const uploadAndParseResume = async (file: File): Promise<ResumeVersion> => {
    setIsUploading(true);
    setUploadProgress(15);
    setUploadError(null);

    try {
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (ext !== '.pdf' && ext !== '.docx') {
        throw new Error('Invalid file type: Please upload a valid .pdf or .docx document.');
      }
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File exceeds maximum size limit (10MB).');
      }

      setUploadProgress(35);

      // Extract raw text with client parser
      const rawText = await resumeParserService.extractRawText(file);
      setUploadProgress(60);

      // Truthful entity extraction
      const parsedData = resumeParserService.parseResumeText(rawText, file.name);
      const atsScore = resumeParserService.calculateATSScore(parsedData);
      setUploadProgress(80);

      const currentUserId = user?.id || 'guest_user';
      const versionId = `res-v${Date.now()}`;

      // Store binary blob in local IndexedDB
      const storageKey = await resumeStorageService.saveResumeFile(
        currentUserId,
        versionId,
        file,
        file.name
      );

      const nextVersionNum = resumeVersions.length + 1;
      const newVersion: ResumeVersion = {
        id: versionId,
        userId: currentUserId,
        name: file.name,
        version: `v${nextVersionNum}.0`,
        versionNumber: nextVersionNum,
        lastUpdated: 'Just now',
        uploadedAt: new Date().toISOString(),
        isPrimary: resumeVersions.length === 0,
        targetFocus: parsedData.personalInfo.title || profile.targetRole || 'Software Engineering',
        atsScore,
        tailoredApplicationsCount: 0,
        fileSize: file.size,
        fileType: file.type || (ext === '.pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
        storageKey,
        extractedData: parsedData,
      };

      // Persist resume metadata to Firestore
      if (user && !isDemoMode) {
        await saveResumeVersionMetadata(user.id, newVersion);
      }

      const updatedVersions = [newVersion, ...resumeVersions];
      setResumeVersions(updatedVersions);
      setSelectedVersionId(newVersion.id);

      setUploadProgress(100);

      // Open review modal so user can examine extracted entities before updating profile
      openReviewModal(parsedData, newVersion);

      addToast({
        type: 'success',
        title: 'Resume Uploaded & Parsed',
        message: `${file.name} saved. Review the extracted fields to update your profile.`,
      });

      return newVersion;
    } catch (err: any) {
      setUploadError(err.message || 'Failed to process resume file.');
      addToast({
        type: 'error',
        title: 'Resume Upload Error',
        message: err.message || 'Failed to process resume file.',
      });
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const setPrimaryResumeVersion = async (versionId: string): Promise<void> => {
    const updated = resumeVersions.map((v) => ({
      ...v,
      isPrimary: v.id === versionId,
    }));
    setResumeVersions(updated);

    if (user && !isDemoMode) {
      const selected = updated.find((v) => v.id === versionId);
      if (selected) {
        await saveResumeVersionMetadata(user.id, selected);
      }
    }

    addToast({
      type: 'success',
      title: 'Primary Resume Selected',
      message: 'Active resume version updated for job matching and application workflows.',
    });
  };

  const deleteResumeVersion = async (versionId: string): Promise<void> => {
    if (isDemoMode) {
      const updated = resumeVersions.filter((v) => v.id !== versionId);
      if (updated.length > 0 && !updated.some((v) => v.isPrimary)) {
        updated[0].isPrimary = true;
      }
      setResumeVersions(updated);

      if (selectedVersionId === versionId) {
        setSelectedVersionId(updated.length > 0 ? updated[0].id : '');
      }

      addToast({
        type: 'info',
        title: 'Demo Resume Removed',
        message: 'Resume removed from active demo view.',
      });
      return;
    }

    const currentUserId = user?.id || 'guest_user';
    await resumeStorageService.deleteResumeFile(currentUserId, versionId);

    if (user) {
      await deleteResumeVersionMetadata(user.id, versionId);
    }

    const updated = resumeVersions.filter((v) => v.id !== versionId);
    if (updated.length > 0 && !updated.some((v) => v.isPrimary)) {
      updated[0].isPrimary = true;
    }
    setResumeVersions(updated);

    if (selectedVersionId === versionId) {
      setSelectedVersionId(updated.length > 0 ? updated[0].id : '');
    }

    addToast({
      type: 'info',
      title: 'Resume Version Removed',
      message: 'Version and stored file asset deleted.',
    });
  };

  const downloadResumeFile = async (versionId: string): Promise<void> => {
    const version = resumeVersions.find((v) => v.id === versionId);
    if (!version) return;

    if (isDemoMode && !version.storageKey) {
      const demoText = `=====================================================
CAREEROS AI RESUME ASSET (DEMO EXPORT)
=====================================================
Candidate: ${profile.name}
Role Target: ${version.targetFocus || profile.targetRole}
ATS Score: ${version.atsScore}%
Version: ${version.version} (${version.name})

SUMMARY:
${profile.summary}

VERIFIED SKILLS:
${(profile.skills || []).map((s) => `• ${s.name} (${s.level})`).join('\n')}

EXPERIENCE HIGHLIGHTS:
${(profile.experience || [])
  .map(
    (e) => `[${e.company}] ${e.role} (${e.startDate} - ${e.endDate})
${e.description.map((d) => `  - ${d}`).join('\n')}`
  )
  .join('\n\n')}

=====================================================
Exported from CareerOS Demo Mode • Sample Portfolio Candidate
=====================================================`;

      const blob = new Blob([demoText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = version.name.replace(/\.(pdf|docx)$/i, '') + '_Demo_Export.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addToast({
        type: 'success',
        title: 'Demo Resume Exported',
        message: `Sample resume asset exported: ${version.name}.`,
      });
      return;
    }

    const currentUserId = user?.id || 'guest_user';
    try {
      await resumeStorageService.downloadResumeFile(currentUserId, versionId, version.name);
      addToast({
        type: 'success',
        title: 'Download Started',
        message: `Exporting ${version.name} from secure local storage.`,
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Download Failed',
        message: 'Could not access file blob from local storage.',
      });
    }
  };

  const openReviewModal = (data: ParsedResumeData, version: ResumeVersion) => {
    setReviewedParsedData(data);
    setReviewedVersion(version);
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setReviewedParsedData(null);
    setReviewedVersion(null);
  };

  const applyReviewedDataToProfile = async (data: Partial<UserProfile>): Promise<void> => {
    await updateProfile(data);
  };

  // Real Firebase Auth Actions
  const loginWithGoogle = async (): Promise<User> => {
    return authService.loginWithGoogle();
  };

  const sendPhoneOTP = async (
    countryCode: string,
    localNumber: string,
    recaptchaContainerId?: string
  ): Promise<{ success: boolean; cooldownSeconds: number }> => {
    return authService.sendPhoneOTP(countryCode, localNumber, recaptchaContainerId);
  };

  const verifyPhoneOTP = async (otp: string): Promise<User> => {
    return authService.verifyPhoneOTP(otp);
  };

  const linkGoogleAccount = async (): Promise<User> => {
    return authService.linkGoogleAccount();
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been safely signed out of CareerOS.',
    });
  };

  // Dynamic skills: In demo mode, provide rich skill coach prioritized data
  const dynamicSkills: SkillCategoryItem[] = isDemoMode
    ? mockSkills
    : (profile.skills || []).map((s) => ({
        name: s.name,
        category: (s.category as any) || 'Languages & Tools',
        currentLevel: (s.level as any) || 'Intermediate',
        targetLevel: 'Advanced',
        status: (s.level === 'Expert' || s.level === 'Advanced' ? 'Strong' : s.level === 'Intermediate' ? 'Intermediate' : 'Needs Improvement') as any,
        marketDemand: 88,
        what: `${s.name} core competency.`,
        why: `Demonstrated in verified profile skills.`,
        whatNext: `Continue practicing advanced patterns.`,
      }));

  const activeResumeVersion =
    resumeVersions.find((v) => v.id === selectedVersionId) ||
    resumeVersions.find((v) => v.isPrimary) ||
    (resumeVersions.length > 0 ? resumeVersions[0] : null);

  const value: AppContextType = {
    activeTab,
    setActiveTab,
    operatingMode,
    setOperatingMode,
    aiPanelOpen,
    setAiPanelOpen,
    toggleAiPanel,
    viewState,
    setViewState,

    // Demo Mode State & Controls
    isDemoMode,
    enterDemoMode,
    exitDemoMode,
    demoNoticeModal,
    showDemoNotice,
    closeDemoNoticeModal,

    user,
    authStatus,
    isAuthenticated: authStatus === 'authenticated' && !!user && !isDemoMode,
    loginWithGoogle,
    sendPhoneOTP,
    verifyPhoneOTP,
    linkGoogleAccount,
    logout,
    isAuthModalOpen,
    openAuthModal: () => setIsAuthModalOpen(true),
    closeAuthModal: () => setIsAuthModalOpen(false),

    jobs,
    toggleSaveJob,
    applications,
    submitApplication,
    profile,
    updateProfile,
    preferences,
    updatePreferences,
    skills: dynamicSkills,
    learningTasks,
    toggleCompleteTask,

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

    isReviewModalOpen,
    reviewedParsedData,
    reviewedVersion,
    openReviewModal,
    closeReviewModal,
    applyReviewedDataToProfile,

    selectedJobForDetails,
    openJobDetails: (job: NormalizedJob) => setSelectedJobForDetails(job),
    closeJobDetails: () => setSelectedJobForDetails(null),

    selectedJobForApply,
    openApplyModal: (job: NormalizedJob) => setSelectedJobForApply(job),
    closeApplyModal: () => setSelectedJobForApply(null),

    isEditProfileOpen,
    openEditProfile: () => setIsEditProfileOpen(true),
    closeEditProfile: () => setIsEditProfileOpen(false),

    toasts,
    addToast,
    removeToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
