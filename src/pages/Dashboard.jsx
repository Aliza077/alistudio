import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Brain, CreditCard, ArrowLeftRight, FileText, 
  TrendingUp, Landmark, Receipt, Sun, Moon, Plus, 
  ChevronRight, Calendar, ArrowUpRight, ArrowDownLeft, Sliders,
  Menu, X
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const [insightPage, setInsightPage] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const insights = [
    "Your Transaction Volume has increased by 5% Since last Month",
    "Ali AI suggests moving $5,000 to high-yield savings account",
    "Subscription audit complete: 2 unused services identified"
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: 'spring', stiffness: 80, damping: 15 }
    }
  };

  // Mock Transactions
  const transactions = [
    { name: 'PlayStation', date: '31 Mar, 3:20 PM', amount: '-$19.99', type: 'expense', card: '**** 0224' },
    { name: 'Netflix', date: '29 Mar, 5:11 PM', amount: '-$30.00', type: 'expense', card: '**** 0224' },
    { name: 'Airbnb', date: '29 Mar, 1:20 PM', amount: '-$300.00', type: 'expense', card: '**** 4432' },
    { name: 'Tommy C.', date: '27 Mar, 2:31 PM', amount: '+$27.00', type: 'income', card: '**** 0224', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
    { name: 'Apple', date: '27 Mar, 11:04 AM', amount: '-$10.00', type: 'expense', card: '**** 4432' },
  ];

  const linePoints = "M 10 75 Q 40 45, 70 85 T 130 35 T 190 65 T 250 20 T 310 50";

  return (
    <div className="dashboard-root">
      {/* Mobile Sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <motion.aside 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`dash-sidebar glass ${isSidebarOpen ? 'sidebar-open' : ''}`}
      >
        <div className="sidebar-glow" />

        {/* Brand Header */}
        <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="sidebar-logo-wrapper">
              <img src="/logo.png" alt="Ali Logo" className="avatar-img" />
            </div>
            <h2 className="sidebar-brand-name">Ali <span>FINTECH</span></h2>
          </div>
          
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="sidebar-close-btn"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>

        {/* User Profile Card */}
        <div className="sidebar-user-card">
          <div className="user-card-top">
            <div className="user-avatar-wrapper">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80" alt="User Profile" className="avatar-img" />
            </div>
            <div className="sidebar-nav-item-left">
              <div className="mode-toggle-pill">
                <button onClick={() => theme !== 'light' && toggleTheme()} className={`pill-btn ${theme === 'light' ? 'active sun' : ''}`} aria-label="Sun Mode">
                  <Sun size={12} />
                </button>
                <button onClick={() => theme !== 'dark' && toggleTheme()} className={`pill-btn ${theme === 'dark' ? 'active moon' : ''}`} aria-label="Moon Mode">
                  <Moon size={12} />
                </button>
              </div>
            </div>
          </div>
          <div>
            <p className="user-date-label">
              <Calendar size={10} />
              Monday, March 24
            </p>
            <h3 className="user-greeting">Welcome back, George!</h3>
          </div>
        </div>

        {/* Menu Links */}
        <nav className="sidebar-nav">
          {[
            { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', active: true },
            { name: 'Ali AI', icon: Brain, path: '/ai' },
            { name: 'Accounts', icon: CreditCard, path: '/accounts' },
            { name: 'Transactions', icon: ArrowLeftRight, path: '/transactions' },
            { name: 'Reports', icon: FileText, path: '/reports' },
            { name: 'Investments', icon: TrendingUp, path: '/investments' },
            { name: 'Loans', icon: Landmark, path: '/loans' },
            { name: 'Taxes', icon: Receipt, path: '/taxes' },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`sidebar-nav-item ${item.active ? 'active' : ''}`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <div className="sidebar-nav-item-left">
                <item.icon size={18} />
                <span>{item.name}</span>
              </div>
              <ChevronRight size={14} className="chevron" />
            </Link>
          ))}
        </nav>

        {/* Go back to Home */}
        <Link to="/" className="sidebar-back-home" onClick={() => setIsSidebarOpen(false)}>
          <ArrowLeftRight size={14} />
          <span>Back to Studio Home</span>
        </Link>

        {/* Pro Card */}
        <div className="sidebar-promo-card">
          <div className="promo-glow" />
          <h4 className="promo-title">
            <span className="promo-dot" />
            Activate Ali Pro
          </h4>
          <p className="promo-desc">Elevate financial management with state-of-the-art predictive AI modeling.</p>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="dash-content-body">
        {/* Top Navbar / Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="dash-header"
        >
          <div className="dash-header-left" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="dash-mobile-toggle"
              aria-label="Open Menu"
            >
              <Menu size={20} />
            </button>
            <span className="header-time-pill">
              <span className="header-time-dot" />
              This Month
            </span>
          </div>

          <div className="dash-header-right">
            <button className="header-btn-widget">
              <Sliders size={14} />
              Manage Widgets
            </button>
            <button className="header-btn-add">
              <Plus size={14} />
              Add Widget
            </button>
          </div>
        </motion.header>

        {/* Dashboard Grid Layout */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="dash-grid"
        >
          {/* Card 1: AI Insights Carousel */}
          <motion.div 
            variants={cardVariants}
            className="dash-card card-span-4 glass ai-insights-card"
          >
            <div className="ai-card-glow-bg" />
            <div className="ai-card-orb" />

            <div>
              <span className="ai-badge">
                AI Insights
              </span>
            </div>

            <div className="ai-slider-section">
              <div className="ai-dots-row">
                {insights.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setInsightPage(idx)}
                    className={`ai-dot ${insightPage === idx ? 'active' : ''}`}
                  />
                ))}
              </div>
              <h3 className="ai-insight-text">
                {insights[insightPage]}
              </h3>
            </div>

            <div className="ai-card-bottom">
              <span className="ai-since-label">Since last month</span>
              <button 
                onClick={() => setInsightPage((prev) => (prev + 1) % insights.length)} 
                className="ai-arrow-btn"
              >
                <ArrowUpRight size={14} />
              </button>
            </div>
          </motion.div>

          {/* Card 2: Balance Overview */}
          <motion.div 
            variants={cardVariants}
            className="dash-card card-span-4 glass"
          >
            <div className="bal-card-top">
              <div>
                <p className="bal-label">Balance Overview</p>
                <h2 className="bal-value">$100,557</h2>
              </div>
              <span className="trend-badge up">
                <TrendingUp size={12} />
                +12%
              </span>
            </div>

            {/* Sparkline chart */}
            <div className="bal-chart-wrapper">
              <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 320 100">
                <defs>
                  <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <motion.path 
                  d={`${linePoints} L 310 100 L 10 100 Z`}
                  fill="url(#chartGlow)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                />
                <motion.path 
                  d={linePoints}
                  fill="none"
                  stroke="#00f0ff"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.2, duration: 1.5, ease: "easeInOut" }}
                />
              </svg>
            </div>

            <div className="bal-buttons-row">
              <button className="bal-action-btn">
                44 Transactions
              </button>
              <button className="bal-action-btn">
                12 Categories
              </button>
            </div>
          </motion.div>

          {/* Card 3: Earnings Gauge */}
          <motion.div 
            variants={cardVariants}
            className="dash-card card-span-4 glass"
          >
            <div className="bal-card-top">
              <div>
                <p className="bal-label">Earnings Status</p>
                <h2 className="bal-value">$100,557</h2>
              </div>
              <span className="trend-badge up">
                <TrendingUp size={12} />
                +7%
              </span>
            </div>

            {/* Radial progress */}
            <div className="radial-gauge-wrapper">
              <svg style={{ width: '144px', height: '144px' }} className="transform -rotate-90" viewBox="0 0 144 144">
                <circle 
                  cx="72" cy="72" r="54" 
                  fill="transparent" 
                  stroke="rgba(255,255,255,0.04)" 
                  strokeWidth="12" 
                  strokeDasharray="339.29"
                  strokeDashoffset="101.78"
                  strokeLinecap="round"
                />
                <motion.circle 
                  cx="72" cy="72" r="54" 
                  fill="transparent" 
                  stroke="url(#purpleBlueGrad)" 
                  strokeWidth="12" 
                  strokeDasharray="339.29"
                  initial={{ strokeDashoffset: 339.29 }}
                  animate={{ strokeDashoffset: 339.29 - (339.29 * 0.58) }}
                  transition={{ delay: 0.3, duration: 1.8, ease: "easeOut" }}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="purpleBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00f0ff" />
                    <stop offset="100%" stopColor="#d000ff" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="radial-percentage">
                <span className="radial-val">58%</span>
                <span className="radial-lbl">Earnings goal</span>
              </div>
            </div>

            <div className="radial-indicators">
              <div className="radial-indicator-item">
                <span className="radial-indicator-dot blue" />
                Current
              </div>
              <div className="radial-indicator-item">
                <span className="radial-indicator-dot purple" />
                Target
              </div>
            </div>
          </motion.div>

          {/* Card 4: Transactions List */}
          <motion.div 
            variants={cardVariants}
            className="dash-card card-span-8 glass"
          >
            <div className="tx-header">
              <h3 className="tx-title">Recent Transactions</h3>
              <button className="tx-view-all-btn">
                View All
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="tx-list">
              {transactions.map((tx, idx) => (
                <div key={idx} className="tx-item">
                  <div className="tx-item-left">
                    {tx.avatar ? (
                      <div className="tx-avatar-web">
                        <img src={tx.avatar} alt={tx.name} className="avatar-img" />
                      </div>
                    ) : (
                      <div className="tx-avatar-mock">
                        {tx.name[0]}
                      </div>
                    )}
                    <div>
                      <h4 className="tx-name">{tx.name}</h4>
                      <p className="tx-date">{tx.date}</p>
                    </div>
                  </div>

                  <div className="tx-item-right">
                    <span className="tx-card-label">{tx.card}</span>
                    <span className={`tx-amount ${tx.type === 'income' ? 'income' : ''}`}>
                      {tx.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card 5: Spending category chart */}
          <motion.div 
            variants={cardVariants}
            className="dash-card card-span-4 glass"
          >
            <div className="bal-card-top">
              <div>
                <p className="bal-label">Spending Category</p>
                <h2 className="bal-value">112,829</h2>
              </div>
              <span className="trend-badge down">
                <ArrowDownLeft size={12} />
                -2%
              </span>
            </div>

            {/* Custom bar chart */}
            <div className="spend-bar-chart">
              {[
                { label: 'Clothing', value: '75%', color: '#00f0ff' },
                { label: 'Groceries', value: '45%', color: '#d000ff' },
                { label: 'Pets', value: '30%', color: '#00ffc4' },
                { label: 'Bills', value: '20%', color: '#ffb700' }
              ].map((bar, idx) => (
                <div key={idx} className="chart-bar-container">
                  <div className="chart-bar-track">
                    <motion.div 
                      className="chart-bar-fill"
                      style={{ 
                        background: `linear-gradient(to top, ${bar.color}44, ${bar.color})`,
                        boxShadow: `0 0 15px ${bar.color}22` 
                      }}
                      initial={{ height: 0 }}
                      animate={{ height: bar.value }}
                      transition={{ delay: idx * 0.1, duration: 1.2, ease: "easeOut" }}
                    />
                  </div>
                  <span className="chart-bar-label">{bar.label}</span>
                </div>
              ))}
            </div>

            <div className="spend-footer">
              <span className="spend-limit-lbl">Active Limit</span>
              <span className="spend-limit-val">$1,200 / Month</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
