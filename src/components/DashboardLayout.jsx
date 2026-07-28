import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, ShoppingBag, Sun, Moon, Plus, ChevronRight,
  Calendar, Sliders, Menu, X, User, MessageSquare, Users, Package, Images, Tags, Home
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Products Management', icon: Package, path: '/dashboard/products' },
  { name: 'Categories Management', icon: Tags, path: '/dashboard/categories' },
  { name: 'Home Carousel & Deals', icon: Images, path: '/dashboard/home-settings' },
  { name: 'Users Management', icon: Users, path: '/dashboard/users' },
  { name: 'Orders Management', icon: ShoppingBag, path: '/dashboard/orders' },
  { name: 'Reports & Complaints', icon: MessageSquare, path: '/dashboard/feedback' },
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
    // Restore user theme preference inside the admin dashboard
    const savedTheme = localStorage.getItem('ali_theme') || 'dark';
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, []);

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

      <aside
        className={`dash-sidebar glass ${isSidebarOpen ? 'sidebar-open' : ''}`}
      >
        <div className="sidebar-glow" />

        <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="sidebar-logo-wrapper">
              <Logo size={40} variant={theme === 'light' ? 'gold' : 'blue'} />
            </div>
            <h2 className="sidebar-brand-name">Ali <span>STUDIO</span></h2>
          </div>
          <button onClick={(e) => { e.stopPropagation(); closeSidebar(); }} className="sidebar-close-btn" aria-label="Close menu" type="button">
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-user-card">
          <div className="user-card-top">
            <div className="user-avatar-wrapper">
              <img src={user?.avatar || '/logo.svg'} alt={displayName} className="avatar-img" style={{ objectFit: 'contain', padding: (user?.avatar ? '0' : '4px'), backgroundColor: '#0a0a0a', borderRadius: '10px' }} />
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
            <motion.h3 
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="user-greeting"
            >
              Welcome back, <span className="greeting-name">{displayName}</span>!
            </motion.h3>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`sidebar-nav-item ${location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path)) ? 'active' : ''}`}
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

        <div className="sidebar-promo-card">
          <div className="promo-glow" />
          <h4 className="promo-title">
            <span className="promo-dot" />
            Ali Studio Admin
          </h4>
          <p className="promo-desc">Manage furniture inventory, customer orders, and user accounts from one place.</p>
        </div>
      </aside>

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

          <div className="dash-header-right">
            {location.pathname === '/dashboard' && (
              <>
                <button className="header-btn-widget" type="button" onClick={() => setShowWidgetPanel(true)}>
                  <Sliders size={14} />
                  <span>Manage Widgets</span>
                </button>
                <button className="header-btn-add" type="button" onClick={() => setShowAddWidget(true)}>
                  <Plus size={14} />
                  <span>Add Widget</span>
                </button>
              </>
            )}
            <Link to="/" className="header-btn-home-animated">
              <Home size={14} />
              <span>Return to Home Page</span>
            </Link>
          </div>
        </motion.header>

        <Outlet context={{ showWidgetPanel, setShowWidgetPanel, showAddWidget, setShowAddWidget }} />
      </div>
    </div>
  );
}
