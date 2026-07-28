import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp, ArrowUpRight, ArrowDownLeft, ChevronRight, X, Plus, Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ALL_WIDGETS = [
  { id: 'insights', label: 'AI Insights', span: 'card-span-4' },
  { id: 'balance', label: 'Sales Revenue Overview', span: 'card-span-4' },
  { id: 'earnings', label: 'Users Count Status', span: 'card-span-4' },
  { id: 'transactions', label: 'Recent Orders', span: 'card-span-8' },
  { id: 'spending', label: 'Products Inventory Overview', span: 'card-span-4' },
];

export default function DashboardHome() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { showWidgetPanel, setShowWidgetPanel, showAddWidget, setShowAddWidget } = useOutletContext();
  const [insightPage, setInsightPage] = useState(0);
  const [visibleWidgets, setVisibleWidgets] = useState(
    ALL_WIDGETS.map((w) => w.id)
  );

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const currentToken = token || localStorage.getItem('ali_token');
        const res = await fetch('/api/admin/stats', {
          headers: {
            'Authorization': `Bearer ${currentToken}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setStats(data.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  const insights = stats
    ? [
        `${stats.totalProducts || 0} products in catalog across ${(stats.categoryBreakdown || []).length} categories`,
        `${stats.totalUsers || 0} registered customers — ${stats.totalOrders || 0} orders placed so far`,
        stats.recentOrders?.length
          ? `Latest order ${stats.recentOrders[0].trackingId || ''} — $${stats.recentOrders[0].totalAmount || 0}`
          : 'No orders yet — promote your furniture collection on the home page',
      ]
    : [
        'Connect to the API to load live store insights',
        'Manage products and inventory from Products Management',
        'Review customer feedback under Reports & Complaints',
      ];

  const linePoints = 'M 10 75 Q 40 45, 70 85 T 130 35 T 190 65 T 250 20 T 310 50';

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 80, damping: 15 } },
  };

  const toggleWidget = (id) => {
    setVisibleWidgets((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  };

  const hiddenWidgets = ALL_WIDGETS.filter((w) => !visibleWidgets.includes(w.id));

  return (
    <>
      {loading && (
        <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Loading dashboard data...</p>
      )}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="dash-grid">
        {visibleWidgets.includes('insights') && (
          <motion.div variants={cardVariants} className="dash-card card-span-4 glass ai-insights-card">
            <div className="ai-card-glow-bg" />
            <div className="ai-card-orb" />
            <div><span className="ai-badge">AI Insights</span></div>
            <div className="ai-slider-section">
              <div className="ai-dots-row">
                {insights.map((_, idx) => (
                  <button key={idx} onClick={() => setInsightPage(idx)} className={`ai-dot ${insightPage === idx ? 'active' : ''}`} type="button" />
                ))}
              </div>
              <h3 className="ai-insight-text">{insights[insightPage]}</h3>
            </div>
            <div className="ai-card-bottom">
              <span className="ai-since-label">Since last month</span>
              <button onClick={() => setInsightPage((prev) => (prev + 1) % insights.length)} className="ai-arrow-btn" type="button">
                <ArrowUpRight size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {visibleWidgets.includes('balance') && (
          <motion.div variants={cardVariants} className="dash-card card-span-4 glass">
            <div className="bal-card-top">
              <div>
                <p className="bal-label">Sales Revenue Overview</p>
                <h2 className="bal-value">${stats ? stats.totalSales.toLocaleString() : '0'}</h2>
              </div>
              <span className="trend-badge up"><TrendingUp size={12} />+12%</span>
            </div>
            <div className="bal-chart-wrapper">
              <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 320 100">
                <defs>
                  <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-blue)" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="var(--accent-blue)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <motion.path d={`${linePoints} L 310 100 L 10 100 Z`} fill="url(#chartGlow)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }} />
                <motion.path d={linePoints} fill="none" stroke="var(--accent-blue)" strokeWidth="3.5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 1.5, ease: 'easeInOut' }} />
              </svg>
            </div>
            <div className="bal-buttons-row">
              <button className="bal-action-btn" type="button">{stats ? stats.totalOrders : 0} Orders Placed</button>
              <button className="bal-action-btn" type="button">{(stats?.categoryBreakdown || []).length} Active Categories</button>
            </div>
          </motion.div>
        )}

        {visibleWidgets.includes('earnings') && (
          <motion.div variants={cardVariants} className="dash-card card-span-4 glass">
            <div className="bal-card-top">
              <div>
                <p className="bal-label">Registered Members</p>
                <h2 className="bal-value">{stats ? stats.totalUsers : '0'} Members</h2>
              </div>
              <span className="trend-badge up"><TrendingUp size={12} />+7%</span>
            </div>
            <div className="radial-gauge-wrapper">
              <svg style={{ width: '144px', height: '144px' }} className="transform -rotate-90" viewBox="0 0 144 144">
                <circle cx="72" cy="72" r="54" fill="transparent" stroke="var(--bg-tertiary)" strokeWidth="12" strokeDasharray="339.29" strokeDashoffset="101.78" strokeLinecap="round" />
                <motion.circle cx="72" cy="72" r="54" fill="transparent" stroke="url(#purpleBlueGrad)" strokeWidth="12" strokeDasharray="339.29" initial={{ strokeDashoffset: 339.29 }} animate={{ strokeDashoffset: 339.29 - (339.29 * 0.75) }} transition={{ delay: 0.3, duration: 1.8, ease: 'easeOut' }} strokeLinecap="round" />
                <defs>
                  <linearGradient id="purpleBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--accent-blue)" />
                    <stop offset="100%" stopColor="var(--accent-purple)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="radial-percentage">
                <span className="radial-val">{stats ? stats.totalUsers : 0}</span>
                <span className="radial-lbl">Active Accounts</span>
              </div>
            </div>
            <div className="radial-indicators">
              <div className="radial-indicator-item"><span className="radial-indicator-dot blue" />Standard Users</div>
              <div className="radial-indicator-item"><span className="radial-indicator-dot purple" />Administrator Accounts</div>
            </div>
          </motion.div>
        )}

        {visibleWidgets.includes('transactions') && (
          <motion.div variants={cardVariants} className="dash-card card-span-8 glass">
            <div className="tx-header">
              <h3 className="tx-title">Recent Customer Orders</h3>
              <button className="tx-view-all-btn" type="button" onClick={() => navigate('/dashboard/products')}>Manage Inventory<ChevronRight size={14} /></button>
            </div>
            <div className="tx-list">
              {stats && stats.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => {
                  const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });
                  return (
                    <div key={order._id} className="tx-item">
                      <div className="tx-item-left">
                        <div className="tx-avatar-mock">{order.email[0].toUpperCase()}</div>
                        <div>
                          <h4 className="tx-name" style={{ fontSize: '13px' }}>{order.email}</h4>
                          <p className="tx-date">{dateStr}</p>
                        </div>
                      </div>
                      <div className="tx-item-right">
                        <span className="tx-card-label" style={{ fontSize: '11px' }}>{order.trackingId}</span>
                        <span className="tx-amount income">${order.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p style={{ color: 'var(--text-muted)', padding: '16px 0' }}>No recent orders found.</p>
              )}
            </div>
          </motion.div>
        )}

        {visibleWidgets.includes('spending') && (
          <motion.div variants={cardVariants} className="dash-card card-span-4 glass">
            <div className="bal-card-top">
              <div>
                <p className="bal-label">Catalogue Products</p>
                <h2 className="bal-value">{stats ? stats.totalProducts : '0'} Items</h2>
              </div>
              <span className="trend-badge up"><TrendingUp size={12} />Active</span>
            </div>
            <div className="spend-bar-chart">
              {stats && stats.categoryBreakdown && stats.categoryBreakdown.length > 0 ? (
                stats.categoryBreakdown.slice(0, 4).map((cat, idx) => {
                  const colors = ['var(--accent-blue)', 'var(--accent-purple)', 'var(--accent-gold)', '#ffb700'];
                  const totalStock = stats.categoryBreakdown.reduce((acc, c) => acc + c.stock, 0) || 1;
                  const pct = Math.min(100, Math.floor((cat.stock / totalStock) * 100)) + '%';
                  return (
                    <div key={cat._id} className="chart-bar-container">
                      <div className="chart-bar-track">
                        <motion.div className="chart-bar-fill" style={{ background: `linear-gradient(to top, ${colors[idx % 4]}44, ${colors[idx % 4]})`, boxShadow: `0 0 15px ${colors[idx % 4]}22` }} initial={{ height: 0 }} animate={{ height: pct }} transition={{ delay: idx * 0.1, duration: 1.2, ease: 'easeOut' }} />
                      </div>
                      <span className="chart-bar-label">{cat._id}</span>
                    </div>
                  );
                })
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>No inventory breakdown available.</p>
              )}
            </div>
            <div className="spend-footer">
              <span className="spend-limit-lbl">Total Stock Count</span>
              <span className="spend-limit-val">
                {stats && stats.categoryBreakdown ? stats.categoryBreakdown.reduce((acc, c) => acc + c.stock, 0) : 0} Units
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {showWidgetPanel && (
        <div className="widget-modal-overlay" onClick={() => setShowWidgetPanel(false)} role="presentation">
          <div className="widget-modal glass" onClick={(e) => e.stopPropagation()}>
            <div className="widget-modal-header">
              <h3>Manage Widgets</h3>
              <button onClick={() => setShowWidgetPanel(false)} type="button" className="widget-modal-close"><X size={18} /></button>
            </div>
            <div className="widget-modal-body">
              {ALL_WIDGETS.map((w) => (
                <label key={w.id} className="widget-toggle-row">
                  <input type="checkbox" checked={visibleWidgets.includes(w.id)} onChange={() => toggleWidget(w.id)} />
                  <span>{w.label}</span>
                  {visibleWidgets.includes(w.id) && <Check size={14} className="widget-check-icon" />}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {showAddWidget && (
        <div className="widget-modal-overlay" onClick={() => setShowAddWidget(false)} role="presentation">
          <div className="widget-modal glass" onClick={(e) => e.stopPropagation()}>
            <div className="widget-modal-header">
              <h3>Add Widget</h3>
              <button onClick={() => setShowAddWidget(false)} type="button" className="widget-modal-close"><X size={18} /></button>
            </div>
            <div className="widget-modal-body">
              {hiddenWidgets.length === 0 ? (
                <p className="widget-empty-msg">All widgets are already visible.</p>
              ) : (
                hiddenWidgets.map((w) => (
                  <button key={w.id} className="widget-add-row" type="button" onClick={() => { setVisibleWidgets((prev) => [...prev, w.id]); setShowAddWidget(false); }}>
                    <Plus size={14} />
                    <span>{w.label}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
