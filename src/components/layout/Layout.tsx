import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer } from '../common/ToastContainer';
import { AIAssistantPanel } from '../ai/AIAssistantPanel';
import { JobDetailsModal } from '../modals/JobDetailsModal';
import { ApplyModal } from '../modals/ApplyModal';
import { EditProfileModal } from '../modals/EditProfileModal';
import { ResumeReviewModal } from '../modals/ResumeReviewModal';
import { AuthModal } from '../auth/AuthModal';
import { useApp } from '../../context/AppContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const {
    isAuthModalOpen,
    closeAuthModal,
    isReviewModalOpen,
    closeReviewModal,
    reviewedParsedData,
    reviewedVersion,
    applyReviewedDataToProfile,
  } = useApp();

  return (
    <div className="app-container">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="main-wrapper">
        <Header onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />
        <main className="page-viewport">{children}</main>
      </div>

      {/* Global Drawers & Modals */}
      <AIAssistantPanel />
      <JobDetailsModal />
      <ApplyModal />
      <EditProfileModal />
      <ResumeReviewModal
        isOpen={isReviewModalOpen}
        onClose={closeReviewModal}
        parsedData={reviewedParsedData}
        uploadedVersion={reviewedVersion}
        onApplyToProfile={applyReviewedDataToProfile}
      />
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
      <ToastContainer />
    </div>
  );
};
