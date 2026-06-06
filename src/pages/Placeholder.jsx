import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Orbit, Sparkles, Box, Shield, Compass } from 'lucide-react';

export default function Placeholder({ title }) {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/accounts') || 
                           location.pathname.startsWith('/transactions') || 
                           location.pathname.startsWith('/reports') ||
                           location.pathname.startsWith('/ai') ||
                           location.pathname.startsWith('/investments') ||
                           location.pathname.startsWith('/loans') ||
                           location.pathname.startsWith('/taxes');

  const geometricItems = [
    { icon: Orbit, color: '#00f0ff', delay: 0.1, label: 'Core System' },
    { icon: Sparkles, color: '#d000ff', delay: 0.2, label: 'Creative Intelligence' },
    { icon: Box, color: '#c5a880', delay: 0.3, label: 'Structural Dimension' },
    { icon: Shield, color: '#00ffc4', delay: 0.4, label: 'Secure Protocols' }
  ];

  return (
    <div className="place-container">
      {/* Decorative ambient background glows */}
      <div className="place-glow-top" />
      <div className="place-glow-bottom" />

      {/* Header */}
      <header className="place-header">
        <Link to="/" className="place-logo-block">
          <div className="place-logo-wrapper">
            <img src="/logo.png" alt="Ali Logo" className="avatar-img" />
          </div>
          <span className="place-logo-title">Ali <span>STUDIO</span></span>
        </Link>
        
        <Link 
          to={isDashboardRoute ? '/dashboard' : '/'} 
          className="btn-outline place-btn-back"
        >
          <ArrowLeft size={12} />
          Back to {isDashboardRoute ? 'Dashboard' : 'Home'}
        </Link>
      </header>

      {/* Main futuristic display */}
      <main className="place-main">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
          className="place-box glass"
        >
          {/* Glowing scanner line animation */}
          <div className="place-scanner" />

          <motion.div 
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="place-compass-wrapper"
          >
            <Compass className="avatar-img" style={{ color: '#00f0ff', padding: '16px' }} />
          </motion.div>

          <span className="place-node-badge">
            System Node: Active
          </span>

          <h1 className="place-title">
            {title}
          </h1>

          <p className="place-desc">
            This module is fully compiled and connected. Navigating pages renders futuristic layouts with micro-interaction mechanics in real time.
          </p>

          {/* Interactive modular buttons */}
          <div className="place-grid-items">
            {geometricItems.map((item, idx) => (
              <motion.div
                key={idx}
                className="place-grid-card"
                whileHover={{ y: -3, scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: item.delay, duration: 0.6 }}
              >
                <div 
                  className="place-card-icon-wrapper"
                  style={{ 
                    backgroundColor: `${item.color}15`, 
                    border: `1px solid ${item.color}33`
                  }}
                >
                  <item.icon size={20} style={{ color: item.color }} />
                </div>
                <span className="place-card-label">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="place-footer">
        <p className="place-footer-text">
          &copy; {new Date().getFullYear()} Ali Studio. All Systems Operational.
        </p>
      </footer>
    </div>
  );
}
