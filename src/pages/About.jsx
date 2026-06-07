import React from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, Heart, Users, Globe } from 'lucide-react';
import StudioPageLayout from '../components/StudioPageLayout';

export default function About() {
  return (
    <StudioPageLayout>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="place-box glass studio-page-box"
      >
        <div className="place-scanner" />
        <span className="place-node-badge">Inside Ali Studio</span>
        <h1 className="studio-page-title font-serif">About Us</h1>
        <p className="studio-page-lead">
          Ali Studio is a premium furniture and interior design house founded on the belief that every space deserves extraordinary craftsmanship.
        </p>
        <div className="studio-page-body">
          <p>Since 2010, we have transformed over 500 residential, commercial, and hospitality spaces across the globe. Our curated collections blend timeless materials — solid oak, Italian marble, premium velvet, and hand-forged steel — with contemporary design sensibilities.</p>
          <p>Our in-house design team works closely with each client to understand lifestyle, spatial flow, and aesthetic preferences before recommending the perfect furniture pieces. From a single accent chair to a full home furnishing project, we deliver end-to-end service.</p>
          <blockquote className="studio-page-quote">
            "We don't just sell furniture — we craft environments where life unfolds beautifully."
          </blockquote>
        </div>
        <div className="place-grid-items studio-stats-grid">
          {[
            { icon: Users, label: '500+ Clients', desc: 'Satisfied customers worldwide' },
            { icon: Globe, label: '15 Countries', desc: 'International delivery network' },
            { icon: Award, label: '12 Awards', desc: 'Design excellence recognitions' },
            { icon: ShieldCheck, label: '5-Year Warranty', desc: 'On all premium collections' },
            { icon: Heart, label: '98% Satisfaction', desc: 'Client retention rate' },
          ].map((card, idx) => (
            <motion.div key={idx} className="place-grid-card" whileHover={{ y: -4 }}>
              <div className="place-card-icon-wrapper studio-icon-gold">
                <card.icon size={20} style={{ color: 'var(--accent-gold)' }} />
              </div>
              <h4 className="place-card-label">{card.label}</h4>
              <p className="studio-card-desc">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </StudioPageLayout>
  );
}
