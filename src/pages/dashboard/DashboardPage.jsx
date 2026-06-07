import React from 'react';
import { motion } from 'framer-motion';

export default function DashboardPage({ title, subtitle, icon: Icon, stats, items }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="dash-page-content"
    >
      <div className="dash-page-header glass">
        <div className="dash-page-icon-wrap">
          <Icon size={24} />
        </div>
        <div>
          <h2 className="dash-page-title">{title}</h2>
          <p className="dash-page-subtitle">{subtitle}</p>
        </div>
      </div>

      {stats && (
        <div className="dash-page-stats-row">
          {stats.map((stat, idx) => (
            <div key={idx} className="dash-page-stat-card glass">
              <span className="dash-page-stat-value">{stat.value}</span>
              <span className="dash-page-stat-label">{stat.label}</span>
              {stat.change && <span className={`dash-page-stat-change ${stat.positive ? 'up' : 'down'}`}>{stat.change}</span>}
            </div>
          ))}
        </div>
      )}

      <div className="dash-page-grid">
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            className="dash-page-item glass"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
          >
            <div className="dash-page-item-top">
              <h4>{item.title}</h4>
              {item.badge && <span className="dash-page-badge">{item.badge}</span>}
            </div>
            <p className="dash-page-item-desc">{item.description}</p>
            {item.value && <span className="dash-page-item-value">{item.value}</span>}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
