import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import StudioPageLayout from '../components/StudioPageLayout';

const projects = [
  { title: 'The Glass Pavilion', category: 'Residential', image: '/slide1.png', year: '2025', desc: 'Open-plan living with floor-to-ceiling glass and minimalist oak furniture.' },
  { title: 'Cybernetic Office Suite', category: 'Commercial', image: '/slide3.png', year: '2026', desc: 'Futuristic workspace with ergonomic mesh chairs and smart lighting.' },
  { title: 'Golden Arch Lounge', category: 'Hospitality', image: '/slide2.png', year: '2024', desc: 'Luxury hotel lobby featuring velvet sofas and marble accent tables.' },
  { title: 'Amber Pendant Lobby', category: 'Retail', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80', year: '2025', desc: 'High-end retail showroom with custom display furniture.' },
  { title: 'Nordic Bedroom Retreat', category: 'Residential', image: '/register_side.png', year: '2025', desc: 'Scandinavian-inspired master bedroom with ash wood bed frame.' },
  { title: 'Emerald Velvet Suite', category: 'Hospitality', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80', year: '2024', desc: 'Boutique hotel suite with custom emerald velvet seating.' },
];

export default function Portfolio() {
  return (
    <StudioPageLayout maxWidth="1100px">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <span className="place-node-badge">Our Archives</span>
        <h1 className="studio-page-title font-serif">Featured Portfolio</h1>
        <p className="studio-page-lead">Explore our completed projects across residential, commercial, hospitality, and retail sectors.</p>
        <div className="furniture-grid studio-portfolio-grid">
          {projects.map((proj, idx) => (
            <motion.div
              key={idx}
              className="furniture-card furniture-card-compact"
              whileHover={{ y: -6 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
            >
              <div className="furniture-img-wrapper furniture-img-compact">
                <img src={proj.image} alt={proj.title} className="furniture-img" />
                <div className="furniture-hover-actions furniture-hover-compact">
                  <button type="button" className="action-btn-circle action-btn-sm"><ArrowUpRight size={14} /></button>
                </div>
              </div>
              <div className="furniture-info furniture-info-compact">
                <span className="furn-category">{proj.category} • {proj.year}</span>
                <h4 className="furn-title furn-title-compact">{proj.title}</h4>
                <p className="studio-card-desc">{proj.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </StudioPageLayout>
  );
}
