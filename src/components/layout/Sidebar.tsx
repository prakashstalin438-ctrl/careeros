import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Search,
  Briefcase,
  FileText,
  User,
  Sliders,
  Target,
  GraduationCap,
  MessageSquareCode,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Bot,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { activeTab, setActiveTab, profile, operatingMode, isAuthenticated, applications, activeResumeVersion } = useApp();
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      section: 'Career Intelligence',
    },
    {
      id: 'find-jobs',
      label: 'Find Jobs',
      icon: Search,
      section: 'Career Intelligence',
      badge: '48',
    },
    {
      id: 'applications',
      label: 'Applications',
      icon: Briefcase,
      section: 'Career Intelligence',
      badge: applications.length > 0 ? String(applications.length) : undefined,
    },
    {
      id: 'resume',
      label: 'Resume Intelligence',
      icon: FileText,
      section: 'Career Assets',
      badge: activeResumeVersion ? `${activeResumeVersion.atsScore}%` : undefined,
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: User,
      section: 'Career Assets',
    },
    {
      id: 'preferences',
      label: 'Job Preferences',
      icon: Sliders,
      section: 'Career Assets',
    },
    {
      id: 'skill-coach',
      label: 'Skill Coach',
      icon: Target,
      section: 'Career Growth',
      badge: profile.skills && profile.skills.length > 0 ? `${profile.skills.length} Skills` : undefined,
    },
    {
      id: 'learning',
      label: 'Learning Plans',
      icon: GraduationCap,
      section: 'Career Growth',
    },
    {
      id: 'interview-prep',
      label: 'Interview Prep',
      icon: MessageSquareCode,
      section: 'Career Growth',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      section: 'System',
    },
  ];

  const sections = Array.from(new Set(navItems.map((item) => item.section)));

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileOpen(false);
  };

  const getModeBadge = () => {
    if (operatingMode === 'auto') {
      return { icon: Zap, label: 'Auto Apply Active', color: '#10b981' };
    }
    if (operatingMode === 'coach') {
      return { icon: Bot, label: 'Coach Mode Active', color: '#0284c7' };
    }
    return { icon: ShieldCheck, label: 'Approval Required', color: '#818cf8' };
  };

  const modeBadge = getModeBadge();
  const ModeIcon = modeBadge.icon;

  return (
    <aside
      className={`app-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
    >
      <div className="sidebar-brand">
        <div className="brand-logo-wrap" onClick={() => handleNavClick('dashboard')} style={{ cursor: 'pointer' }}>
          <div className="brand-icon">
            <Sparkles size={20} />
          </div>
          {!collapsed && (
            <div className="brand-text">
              <span className="brand-name">
                CareerOS{' '}
                <span
                  className="brand-badge"
                  style={{
                    background: isAuthenticated ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: isAuthenticated ? '#34d399' : '#fbbf24',
                  }}
                >
                  {isAuthenticated ? 'Active User' : 'Demo Data'}
                </span>
              </span>
              <span className="brand-sub">
                {isAuthenticated ? 'Production Intelligence' : 'Sample Career Dataset'}
              </span>
            </div>
          )}
        </div>
        <button
          className="sidebar-toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          style={{ color: '#94a3b8' }}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {sections.map((section) => (
          <div key={section} style={{ display: 'flex', flexDirection: 'column' }}>
            {!collapsed && <div className="nav-section-title">{section}</div>}
            {navItems
              .filter((item) => item.section === section)
              .map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <div
                    key={item.id}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.id)}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className="nav-icon" />
                    {!collapsed && <span className="nav-label">{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span className="nav-pill">{item.badge}</span>
                    )}
                  </div>
                );
              })}
          </div>
        ))}
      </nav>

      {!collapsed && (
        <div className="sidebar-footer">
          <div className="digital-twin-card">
            <div className="dt-header">
              <span className="dt-title">
                <Sparkles size={13} color="#818cf8" /> Career Readiness {isAuthenticated ? '' : '(Sample)'}
              </span>
              <span className="dt-score">{profile.careerReadinessScore}%</span>
            </div>
            <div className="dt-progress-bar">
              <div
                className="dt-progress-fill"
                style={{ width: `${profile.careerReadinessScore}%` }}
              />
            </div>
            <div className="dt-sub" title={profile.targetRole}>
              Target: {profile.targetRole || 'Not configured'}
            </div>
            <div
              style={{
                marginTop: '0.45rem',
                paddingTop: '0.45rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.68rem',
                color: modeBadge.color,
                fontWeight: 600,
              }}
            >
              <ModeIcon size={12} />
              <span>{modeBadge.label}</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
