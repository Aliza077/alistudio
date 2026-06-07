import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Brain, CreditCard, ArrowLeftRight, FileText,
  TrendingUp, Landmark, Receipt, Sun, Moon, Plus, ChevronRight,
  Calendar, Sliders, Menu, X, User, MessageSquare
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Ali AI', icon: Brain, path: '/dashboard/ai' },
  { name: 'Accounts', icon: CreditCard, path: '/dashboard/accounts' },
  { name: 'Transactions', icon: ArrowLeftRight, path: '/dashboard/transactions' },
  { name: 'Reports', icon: FileText, path: '/dashboard/reports' },
  { name: 'Reports & Complaints', icon: MessageSquare, path: '/dashboard/feedback' },
  { name: 'Investments', icon: TrendingUp, path: '/dashboard/investments' },
  { name: 'Loans', icon: Landmark, path: '/dashboard/loans' },
  { name: 'Taxes', icon: Receipt, path: '/dashboard/taxes' },
];

export default function DashboardLayout() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showWidgetPanel, setShowWidgetPanel] = useState(false);
  const [showAddWidget, setShowAddWidget] = useState(false);

  const displayName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username
    : 'Admin';

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isSidebarOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsSidebarOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="dashboard-root">
      {isSidebarOpen && (
        <div className="sidebar-backdrop" onClick={closeSidebar} role="presentation" />
      )}

      <motion.aside
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`dash-sidebar glass ${isSidebarOpen ? 'sidebar-open' : ''}`}
      >
        <div className="sidebar-glow" />

        <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="sidebar-logo-wrapper">
              <img src="/logo.svg" alt="Ali Logo" className="avatar-img" />
            </div>
            <h2 className="sidebar-brand-name">Ali <span>FINTECH</span></h2>
          </div>
          <button onClick={closeSidebar} className="sidebar-close-btn" aria-label="Close menu" type="button">
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-user-card">
          <div className="user-card-top">
            <div className="user-avatar-wrapper">
              {user?.avatar ? (
                <img src={user.avatar} alt={displayName} className="avatar-img" />
              ) : (
                <div className="avatar-fallback">
                  <User size={20} />
                </div>
              )}
            </div>
            <div className="sidebar-nav-item-left">
              <div className="mode-toggle-pill">
                <button onClick={() => theme !== 'light' && toggleTheme()} className={`pill-btn ${theme === 'light' ? 'active sun' : ''}`} aria-label="Sun Mode" type="button">
                  <Sun size={12} />
                </button>
                <button onClick={() => theme !== 'dark' && toggleTheme()} className={`pill-btn ${theme === 'dark' ? 'active moon' : ''}`} aria-label="Moon Mode" type="button">
                  <Moon size={12} />
                </button>
              </div>
            </div>
          </div>
          <div>
            <p className="user-date-label">
              <Calendar size={10} />
              {today}
            </p>
            <h3 className="user-greeting">Welcome back, {displayName}!</h3>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`sidebar-nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <div className="sidebar-nav-item-left">
                <item.icon size={18} />
                <span>{item.name}</span>
              </div>
              <ChevronRight size={14} className="chevron" />
            </Link>
          ))}
        </nav>

        <Link to="/" className="sidebar-back-home" onClick={closeSidebar}>
          <ArrowLeftRight size={14} />
          <span>Back to Studio Home</span>
        </Link>

        <div className="sidebar-promo-card">
          <div className="promo-glow" />
          <h4 className="promo-title">
            <span className="promo-dot" />
            Activate Ali Pro
          </h4>
          <p className="promo-desc">Elevate financial management with state-of-the-art predictive AI modeling.</p>
        </div>
      </motion.aside>

      <div className="dash-content-body">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="dash-header"
        >
          <div className="dash-header-left" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => setIsSidebarOpen(true)} className="dash-mobile-toggle" aria-label="Open Menu" type="button">
              <Menu size={20} />
            </button>
            <span className="header-time-pill">
              <span className="header-time-dot" />
              This Month
            </span>
          </div>

          {location.pathname === '/dashboard' && (
            <div className="dash-header-right">
              <button className="header-btn-widget" type="button" onClick={() => setShowWidgetPanel(true)}>
                <Sliders size={14} />
                Manage Widgets
              </button>
              <button className="header-btn-add" type="button" onClick={() => setShowAddWidget(true)}>
                <Plus size={14} />
                Add Widget
              </button>
            </div>
          )}
        </motion.header>

        <Outlet context={{ showWidgetPanel, setShowWidgetPanel, showAddWidget, setShowAddWidget }} />
      </div>
    </div>
  );
}
