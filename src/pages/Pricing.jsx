import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';

const tiers = [
  { 
    name: 'Spatial Consult', 
    price: '$299', 
    period: 'Per Room',
    desc: 'Perfect for quick single-room upgrades.',
    features: ['3D CAD layout blueprint', 'Material recommendations', 'Color board matching', '1 revision cycle']
  },
  { 
    name: 'Premium Design', 
    price: '$1,499', 
    period: 'Flat Rate',
    desc: 'For comprehensive home structural designs.',
    features: ['Full apartment mapping', 'Custom fabric sourcing', 'Lighting blueprint setup', 'Unlimited revisions', 'Supplier discount nodes']
  },
  { 
    name: 'Enterprise/B2B', 
    price: 'Custom', 
    period: 'On Quote',
    desc: 'For commercial offices and architectural lobbies.',
    features: ['Scale workspace modeling', 'Bespoke corporate furniture', 'Acoustic integration planning', 'Dedicated project manager']
  }
];

export default function Pricing() {
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

      <main className="place-main" style={{ maxWidth: '1100px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ width: '100%', textAlign: 'left' }}
        >
          <span className="place-node-badge" style={{ marginBottom: '16px', display: 'inline-block' }}>
            Investment Tiers
          </span>
          <h1 className="place-title" style={{ marginTop: '8px', marginBottom: '40px', fontSize: '38px' }}>
            Consultation Plans
          </h1>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }} className="pricing-grid-cols">
            {tiers.map((tier, idx) => (
              <motion.div
                key={idx}
                className="place-grid-card glass"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                style={{ 
                  padding: '32px 24px', 
                  alignItems: 'stretch',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--accent-gold)' }}>{tier.name}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{tier.desc}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
                  <span style={{ fontSize: '32px', fontWeight: '800', color: '#fff' }}>{tier.price}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/ {tier.period}</span>
                </div>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1 }}>
                  {tier.features.map((feat, fIdx) => (
                    <li key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <Check size={14} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button className="btn-gold" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}>
                  Select Plan
                </button>
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
