import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen } from 'lucide-react';

const posts = [
  { title: 'The Rise of Minimalist Japandi Decor', date: 'June 01, 2026', readTime: '5 min read', desc: 'Discover how Japanese zen elements combine with Scandinavian comfort in modern furniture design.' },
  { title: 'Choosing the Perfect Lighting for Cyber Office Spaces', date: 'May 20, 2026', readTime: '7 min read', desc: 'A guide to warm amber lighting arrays vs neon backlighting to optimize focal attention.' },
  { title: 'Sourcing Sustainably Fabricated Woods', date: 'April 14, 2026', readTime: '4 min read', desc: 'Understanding durability certifications and carbon footprints behind furniture production.' }
];

export default function Blog() {
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

      <main className="place-main" style={{ maxWidth: '900px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ width: '100%', textAlign: 'left' }}
        >
          <span className="place-node-badge" style={{ marginBottom: '16px', display: 'inline-block' }}>
            Latest Insights
          </span>
          <h1 className="place-title" style={{ marginTop: '8px', marginBottom: '40px', fontSize: '38px' }}>
            Design Chronicles
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {posts.map((post, idx) => (
              <motion.div
                key={idx}
                className="place-grid-card glass"
                whileHover={{ y: -3 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                style={{ 
                  padding: '24px', 
                  alignItems: 'stretch',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: '700', textTransform: 'uppercase' }}>
                    {post.date}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
                    {post.readTime}
                  </span>
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>{post.title}</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{post.desc}</p>
                <a href="#read" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: 'var(--accent-blue)', textDecoration: 'none', marginTop: '8px' }}>
                  Read Article
                  <BookOpen size={12} />
                </a>
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
