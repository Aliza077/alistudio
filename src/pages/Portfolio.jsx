import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

const projects = [
  { title: 'The Glass Pavilion', category: 'Residential', image: '/slide1.png', year: '2025' },
  { title: 'Cybernetic Office Suite', category: 'Commercial', image: '/slide3.png', year: '2026' },
  { title: 'Golden Arch Lounge', category: 'Hospitality', image: '/slide2.png', year: '2024' },
  { title: 'Amber Pendant Lobby', category: 'Retail', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80', year: '2025' }
];

export default function Portfolio() {
  return (
    <div className="place-container">
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
        <Link to="/" className="btn-outline place-btn-back">
          <ArrowLeft size={12} />
          Back to Home
        </Link>
      </header>

      {/* Main Content */}
      <main className="place-main" style={{ maxWidth: '1100px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ width: '100%', textAlign: 'left' }}
        >
          <span className="place-node-badge" style={{ marginBottom: '16px', display: 'inline-block' }}>
            Our Archives
          </span>
          <h1 className="place-title" style={{ marginTop: '8px', marginBottom: '40px', fontSize: '38px' }}>
            Featured Portfolio
          </h1>

          <div className="furniture-grid">
            {projects.map((proj, idx) => (
              <motion.div
                key={idx}
                className="furniture-card"
                whileHover={{ y: -6 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
              >
                <div className="furniture-img-wrapper">
                  <img src={proj.image} alt={proj.title} className="furniture-img" />
                  <div className="furniture-hover-actions">
                    <button className="action-btn-circle" style={{ width: '40px', height: '40px' }}>
                      <ArrowUpRight size={16} />
                    </button>
                  </div>
                </div>
                <div className="furniture-info">
                  <span className="furn-category">{proj.category} • {proj.year}</span>
                  <h4 className="furn-title">{proj.title}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      <footer className="place-footer">
        <p className="place-footer-text">
          &copy; {new Date().getFullYear()} Ali Studio. All Systems Operational.
        </p>
      </footer>
    </div>
  );
}
