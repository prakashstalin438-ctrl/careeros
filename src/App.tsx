import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { AuthModal } from './components/auth/AuthModal';
import { DashboardPage } from './pages/DashboardPage';
import { FindJobsPage } from './pages/FindJobsPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { ResumePage } from './pages/ResumePage';
import { ProfilePage } from './pages/ProfilePage';
import { PreferencesPage } from './pages/PreferencesPage';
import { SkillCoachPage } from './pages/SkillCoachPage';
import { LearningPage } from './pages/LearningPage';
import { InterviewPrepPage } from './pages/InterviewPrepPage';
import { SettingsPage } from './pages/SettingsPage';
import { Sparkles } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, authStatus } = useApp();

  // Route Gate: Loading Splash
  if (authStatus === 'loading') {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
          color: '#ffffff',
          gap: '1.25rem',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'var(--ai-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 25px rgba(99, 102, 241, 0.6)',
          }}
        >
          <Sparkles size={28} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
            CareerOS
          </h2>
          <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            Synchronizing Career Digital Twin...
          </div>
        </div>
      </div>
    );
  }

  // Route Gate: Unauthenticated User -> Login / Register Screen
  if (authStatus === 'unauthenticated') {
    return <AuthModal isOpen={true} isFullPage={true} onClose={() => {}} />;
  }

  // Authenticated User -> CareerOS Workspace
  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'find-jobs':
        return <FindJobsPage />;
      case 'applications':
        return <ApplicationsPage />;
      case 'resume':
        return <ResumePage />;
      case 'profile':
        return <ProfilePage />;
      case 'preferences':
        return <PreferencesPage />;
      case 'skill-coach':
        return <SkillCoachPage />;
      case 'learning':
        return <LearningPage />;
      case 'interview-prep':
        return <InterviewPrepPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return <Layout>{renderActivePage()}</Layout>;
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
