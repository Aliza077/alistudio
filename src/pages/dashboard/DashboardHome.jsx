import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp, ArrowUpRight, ArrowDownLeft, ChevronRight, X, Plus, Check
} from 'lucide-react';

const ALL_WIDGETS = [
  { id: 'insights', label: 'AI Insights', span: 'card-span-4' },
  { id: 'balance', label: 'Balance Overview', span: 'card-span-4' },
  { id: 'earnings', label: 'Earnings Status', span: 'card-span-4' },
  { id: 'transactions', label: 'Recent Transactions', span: 'card-span-8' },
  { id: 'spending', label: 'Spending Category', span: 'card-span-4' },
];

export default function DashboardHome() {
  const { showWidgetPanel, setShowWidgetPanel, showAddWidget, setShowAddWidget } = useOutletContext();
  const [insightPage, setInsightPage] = useState(0);
  const [visibleWidgets, setVisibleWidgets] = useState(
    ALL_WIDGETS.map((w) => w.id)
  );

  const insights = [
    'Your Transaction Volume has increased by 5% Since last Month',
    'Ali AI suggests moving $5,000 to high-yield savings account',
    'Subscription audit complete: 2 unused services identified',
  ];

  const transactions = [
    { name: 'PlayStation', date: '31 Mar, 3:20 PM', amount: '-$19.99', type: 'expense', card: '**** 0224' },
    { name: 'Netflix', date: '29 Mar, 5:11 PM', amount: '-$30.00', type: 'expense', card: '**** 0224' },
    { name: 'Airbnb', date: '29 Mar, 1:20 PM', amount: '-$300.00', type: 'expense', card: '**** 4432' },
    { name: 'Tommy C.', date: '27 Mar, 2:31 PM', amount: '+$27.00', type: 'income', card: '**** 0224', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
    { name: 'Apple', date: '27 Mar, 11:04 AM', amount: '-$10.00', type: 'expense', card: '**** 4432' },
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
                <p className="bal-label">Balance Overview</p>
                <h2 className="bal-value">$100,557</h2>
              </div>
              <span className="trend-badge up"><TrendingUp size={12} />+12%</span>
            </div>
            <div className="bal-chart-wrapper">
              <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 320 100">
                <defs>
                  <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <motion.path d={`${linePoints} L 310 100 L 10 100 Z`} fill="url(#chartGlow)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }} />
                <motion.path d={linePoints} fill="none" stroke="#00f0ff" strokeWidth="3.5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 1.5, ease: 'easeInOut' }} />
              </svg>
            </div>
            <div className="bal-buttons-row">
              <button className="bal-action-btn" type="button">44 Transactions</button>
              <button className="bal-action-btn" type="button">12 Categories</button>
            </div>
          </motion.div>
        )}

        {visibleWidgets.includes('earnings') && (
          <motion.div variants={cardVariants} className="dash-card card-span-4 glass">
            <div className="bal-card-top">
              <div>
                <p className="bal-label">Earnings Status</p>
                <h2 className="bal-value">$100,557</h2>
              </div>
              <span className="trend-badge up"><TrendingUp size={12} />+7%</span>
            </div>
            <div className="radial-gauge-wrapper">
              <svg style={{ width: '144px', height: '144px' }} className="transform -rotate-90" viewBox="0 0 144 144">
                <circle cx="72" cy="72" r="54" fill="transparent" stroke="rgba(255,255,255,0.04)" strokeWidth="12" strokeDasharray="339.29" strokeDashoffset="101.78" strokeLinecap="round" />
                <motion.circle cx="72" cy="72" r="54" fill="transparent" stroke="url(#purpleBlueGrad)" strokeWidth="12" strokeDasharray="339.29" initial={{ strokeDashoffset: 339.29 }} animate={{ strokeDashoffset: 339.29 - (339.29 * 0.58) }} transition={{ delay: 0.3, duration: 1.8, ease: 'easeOut' }} strokeLinecap="round" />
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
              <div className="radial-indicator-item"><span className="radial-indicator-dot blue" />Current</div>
              <div className="radial-indicator-item"><span className="radial-indicator-dot purple" />Target</div>
            </div>
          </motion.div>
        )}

        {visibleWidgets.includes('transactions') && (
          <motion.div variants={cardVariants} className="dash-card card-span-8 glass">
            <div className="tx-header">
              <h3 className="tx-title">Recent Transactions</h3>
              <button className="tx-view-all-btn" type="button">View All<ChevronRight size={14} /></button>
            </div>
            <div className="tx-list">
              {transactions.map((tx, idx) => (
                <div key={idx} className="tx-item">
                  <div className="tx-item-left">
                    {tx.avatar ? (
                      <div className="tx-avatar-web"><img src={tx.avatar} alt={tx.name} className="avatar-img" /></div>
                    ) : (
                      <div className="tx-avatar-mock">{tx.name[0]}</div>
                    )}
                    <div>
                      <h4 className="tx-name">{tx.name}</h4>
                      <p className="tx-date">{tx.date}</p>
                    </div>
                  </div>
                  <div className="tx-item-right">
                    <span className="tx-card-label">{tx.card}</span>
                    <span className={`tx-amount ${tx.type === 'income' ? 'income' : ''}`}>{tx.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {visibleWidgets.includes('spending') && (
          <motion.div variants={cardVariants} className="dash-card card-span-4 glass">
            <div className="bal-card-top">
              <div>
                <p className="bal-label">Spending Category</p>
                <h2 className="bal-value">112,829</h2>
              </div>
              <span className="trend-badge down"><ArrowDownLeft size={12} />-2%</span>
            </div>
            <div className="spend-bar-chart">
              {[
                { label: 'Clothing', value: '75%', color: '#00f0ff' },
                { label: 'Groceries', value: '45%', color: '#d000ff' },
                { label: 'Pets', value: '30%', color: '#00ffc4' },
                { label: 'Bills', value: '20%', color: '#ffb700' },
              ].map((bar, idx) => (
                <div key={idx} className="chart-bar-container">
                  <div className="chart-bar-track">
                    <motion.div className="chart-bar-fill" style={{ background: `linear-gradient(to top, ${bar.color}44, ${bar.color})`, boxShadow: `0 0 15px ${bar.color}22` }} initial={{ height: 0 }} animate={{ height: bar.value }} transition={{ delay: idx * 0.1, duration: 1.2, ease: 'easeOut' }} />
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
