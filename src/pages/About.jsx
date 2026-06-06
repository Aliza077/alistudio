import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Award, ShieldCheck, Heart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function About() {
  const { theme } = useTheme();

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
      <main className="place-main" style={{ maxWidth: '1000px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="place-box glass"
          style={{ textAlign: 'left', maxWidth: '100%' }}
        >
          <div className="place-scanner" />

          <span className="place-node-badge" style={{ marginBottom: '24px', display: 'inline-block' }}>
            Inside Ali Studio
          </span>

          <h1 className="place-title" style={{ marginTop: '12px', fontSize: '38px' }}>
            About Us
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '24px' }}>
            <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text-primary)', fontWeight: '400' }}>
              Welcome to our furniture store, where quality, comfort, and style come together. We offer a wide range of modern and classic furniture designed to make your home and office beautiful and functional.
            </p>

            <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'var(--text-secondary)', fontWeight: '300' }}>
              Our mission is to provide high-quality furniture at affordable prices while ensuring customer satisfaction. From sofas and beds to dining tables and office furniture, every product is carefully selected to meet the highest standards of durability and design.
            </p>

            <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'var(--text-secondary)', fontWeight: '300' }}>
              We believe that furniture is more than just decoration—it creates a comfortable and welcoming environment for you and your family. Our team is dedicated to helping customers find the perfect pieces to match their needs and preferences.
            </p>

            <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'var(--text-secondary)', fontWeight: '300', fontStyle: 'italic', borderLeft: '3px solid var(--accent-gold)', paddingLeft: '16px' }}>
              Thank you for choosing us. We look forward to helping you create spaces you will love for years to come.
            </p>
          </div>

          {/* Interactive Core Cards */}
          <div className="place-grid-items" style={{ marginTop: '40px' }}>
            {[
              { icon: Award, label: 'Highest Quality', desc: 'Sourced from premium wood, marble, and custom steel.' },
              { icon: ShieldCheck, label: 'Affordable Rates', desc: 'Transparent luxury pricing models.' },
              { icon: Heart, label: 'Customer First', desc: 'Support with custom spatial layout configurations.' }
            ].map((card, idx) => (
              <motion.div
                key={idx}
                className="place-grid-card"
                whileHover={{ y: -4 }}
                style={{ textAlign: 'center', padding: '24px 16px' }}
              >
                <div className="place-card-icon-wrapper" style={{ backgroundColor: 'rgba(197, 168, 128, 0.15)', border: '1px solid rgba(197, 168, 128, 0.3)' }}>
                  <card.icon size={20} style={{ color: 'var(--accent-gold)' }} />
                </div>
                <h4 className="place-card-label" style={{ color: '#fff', fontSize: '13px', marginTop: '12px' }}>{card.label}</h4>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px' }}>{card.desc}</p>
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
