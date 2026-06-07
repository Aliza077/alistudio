import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import StudioPageLayout from '../components/StudioPageLayout';

const tiers = [
  { name: 'Essential Consult', price: '$299', period: 'Per Room', desc: 'Quick single-room upgrade with expert guidance.', features: ['3D CAD layout blueprint', 'Material recommendations', 'Color board matching', '1 revision cycle'], popular: false },
  { name: 'Premium Design', price: '$1,499', period: 'Flat Rate', desc: 'Full home or office design package.', features: ['Full apartment mapping', 'Custom fabric sourcing', 'Lighting blueprint setup', 'Unlimited revisions', '15% furniture discount'], popular: true },
  { name: 'Enterprise / B2B', price: 'Custom', period: 'On Quote', desc: 'Commercial offices and architectural lobbies.', features: ['Scale workspace modeling', 'Bespoke corporate furniture', 'Acoustic integration planning', 'Dedicated project manager', 'Priority support'], popular: false },
];

export default function Pricing() {
  return (
    <StudioPageLayout maxWidth="1100px">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <span className="place-node-badge">Investment Tiers</span>
        <h1 className="studio-page-title font-serif">Pricing Plans</h1>
        <p className="studio-page-lead">Transparent pricing for design consultation and furniture packages. All plans include a satisfaction guarantee.</p>
        <div className="studio-pricing-grid">
          {tiers.map((tier, idx) => (
            <motion.div
              key={idx}
              className={`place-grid-card glass studio-pricing-card ${tier.popular ? 'popular' : ''}`}
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              {tier.popular && <span className="studio-pricing-badge">Most Popular</span>}
              <h4>{tier.name}</h4>
              <p className="studio-card-desc">{tier.desc}</p>
              <div className="studio-pricing-amount">
                <span>{tier.price}</span>
                <small>/ {tier.period}</small>
              </div>
              <ul className="studio-pricing-features">
                {tier.features.map((feat, fIdx) => (
                  <li key={fIdx}><Check size={14} /> {feat}</li>
                ))}
              </ul>
              <Link to="/contact" className="btn-gold studio-pricing-btn">Get Started</Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </StudioPageLayout>
  );
}
