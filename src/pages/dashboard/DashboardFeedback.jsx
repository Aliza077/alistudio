import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, AlertTriangle, Lightbulb, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function DashboardFeedback() {
  const { feedbackList, deleteFeedback } = useAuth();
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All', icon: MessageSquare },
    { id: 'complaint', label: 'Complaints', icon: AlertTriangle },
    { id: 'suggestion', label: 'Suggestions', icon: Lightbulb },
  ];

  const filtered = feedbackList.filter((f) =>
    activeTab === 'all' ? true : f.type === activeTab
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="dash-page-content"
    >
      <div className="dash-page-header glass">
        <div className="dash-page-icon-wrap" style={{ background: 'rgba(197,168,128,0.1)', borderColor: 'rgba(197,168,128,0.2)', color: '#c5a880' }}>
          <MessageSquare size={24} />
        </div>
        <div>
          <h2 className="dash-page-title">Reports & Complaints</h2>
          <p className="dash-page-subtitle">All user complaints and suggestions with Gmail ID and username</p>
        </div>
      </div>

      <div className="feedback-tabs-row">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`feedback-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={14} />
            {tab.label}
            <span className="feedback-tab-count">
              {tab.id === 'all' ? feedbackList.length : feedbackList.filter((f) => f.type === tab.id).length}
            </span>
          </button>
        ))}
      </div>

      <div className="feedback-list">
        {filtered.length === 0 ? (
          <div className="feedback-empty glass">
            <MessageSquare size={32} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
            <p>No {activeTab === 'all' ? 'feedback' : activeTab + 's'} yet.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <motion.div
              key={item.id}
              className="feedback-card glass"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="feedback-card-top">
                <span className={`feedback-type-badge ${item.type}`}>
                  {item.type === 'complaint' ? <AlertTriangle size={12} /> : <Lightbulb size={12} />}
                  {item.type}
                </span>
                <span className="feedback-date">{new Date(item.date).toLocaleString()}</span>
                <button type="button" className="feedback-delete-btn" onClick={() => deleteFeedback(item.id)} aria-label="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
              <p className="feedback-message">{item.message}</p>
              <div className="feedback-user-info">
                <div className="feedback-user-field">
                  <span className="feedback-field-label">Username</span>
                  <span className="feedback-field-value">{item.username}</span>
                </div>
                <div className="feedback-user-field">
                  <span className="feedback-field-label">Gmail</span>
                  <span className="feedback-field-value">{item.email}</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
