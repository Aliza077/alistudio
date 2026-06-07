import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, StickyNote } from 'lucide-react';
import { studioNavPages } from '../data/studioNav';

export default function StudioPageLayout({ children, maxWidth = '1000px' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.studio-atlas-wrapper')) setIsNavOpen(false);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="place-container">
      <div className="place-glow-top" />
      <div className="place-glow-bottom" />

      <header className="place-header studio-page-header">
        <Link to="/" className="place-logo-block">
          <div className="place-logo-wrapper">
            <img src="/logo.svg" alt="Ali Logo" className="avatar-img" />
          </div>
          <span className="place-logo-title">Ali <span>STUDIO</span></span>
        </Link>

        <div className="studio-header-actions">
          <div className="studio-atlas-wrapper nav-pages-wrapper">
            <button
              type="button"
              className="nav-pages-btn glass"
              onClick={(e) => {
                e.stopPropagation();
                setIsNavOpen(!isNavOpen);
              }}
              aria-label="Studio Atlas menu"
            >
              <StickyNote size={16} />
              <span className="nav-pages-btn-text">Studio Atlas</span>
            </button>
            <AnimatePresence>
              {isNavOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="nav-pages-dropdown glass studio-atlas-dropdown"
                >
                  {studioNavPages.map((page) => (
                    <Link
                      key={page.path}
                      to={page.path}
                      className={`nav-pages-link ${location.pathname === page.path ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsNavOpen(false);
                        navigate(page.path);
                      }}
                    >
                      {page.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/" className="btn-outline place-btn-back">
            <ArrowLeft size={12} />
            Home
          </Link>
        </div>
      </header>

      <main className="place-main studio-page-main" style={{ maxWidth }}>
        {children}
      </main>

      <footer className="place-footer">
        <p className="place-footer-text">&copy; {new Date().getFullYear()} Ali Studio. All rights reserved.</p>
      </footer>
    </div>
  );
}
