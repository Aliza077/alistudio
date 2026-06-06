import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Compass, Palette, Wrench, Layers } from 'lucide-react';

const services = [
  { icon: Compass, title: 'Spatial Architecture Planning', desc: 'Detailed blueprint modeling of layout grids for living zones and offices.' },
  { icon: Palette, title: 'Color Palette Curation', desc: 'Harmonizing textures, materials, and paint tones for a high-end luxury feel.' },
  { icon: Wrench, title: 'Custom Furniture Fabrication', desc: 'Bespoke design and crafting of tables, couches, and cabinetry unique to you.' },
  { icon: Layers, title: 'B2B Commercial Consultation', desc: 'Optimizing corporate spaces for productivity and architectural branding.' }
];

export default function Services() {
  return (
    <div className="place-container">
      <div className="place-glow-top" />
      <div className="place-glow-bottom" />

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

      <main className="place-main" style={{ maxWidth: '1000px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ width: '100%', textAlign: 'left' }}
        >
          <span className="place-node-badge" style={{ marginBottom: '16px', display: 'inline-block' }}>
            Bespoke Services
          </span>
          <h1 className="place-title" style={{ marginTop: '8px', marginBottom: '40px', fontSize: '38px' }}>
            Architectural Consulting
          </h1>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
            {services.map((serv, idx) => (
              <motion.div
                key={idx}
                className="place-grid-card"
                whileHover={{ y: -3 }}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'flex-start', 
                  alignItems: 'center', 
                  padding: '24px', 
                  gap: '24px',
                  textAlign: 'left'
                }}
              >
                <div 
                  className="place-card-icon-wrapper" 
                  style={{ 
                    backgroundColor: 'rgba(0, 240, 255, 0.1)', 
                    border: '1px solid rgba(0, 240, 255, 0.2)',
                    flexShrink: 0 
                  }}
                >
                  <serv.icon size={22} style={{ color: 'var(--accent-blue)' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>{serv.title}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: '1.5' }}>{serv.desc}</p>
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
