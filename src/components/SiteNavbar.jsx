import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Moon, Sun, Heart, LogOut, ShoppingCart, Search, Menu, X, StickyNote
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { studioNavPages } from '../data/studioNav';
import Logo from './Logo';

export default function SiteNavbar({
  variant = 'standalone',
  searchQuery: controlledQuery,
  onSearchChange,
  onSearchSubmit,
}) {
  const { user, logout, cart } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [internalQuery, setInternalQuery] = useState('');
  const searchQuery = controlledQuery !== undefined ? controlledQuery : internalQuery;
  const setSearchQuery = onSearchChange || setInternalQuery;
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavPagesOpen, setIsNavPagesOpen] = useState(false);

  useEffect(() => {
    // Force dark theme on all public website pages
    document.body.classList.remove('light-theme');
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.nav-pages-wrapper')) {
        setIsNavPagesOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSearch = (query) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setIsMobileMenuOpen(false);

    if (onSearchSubmit) {
      onSearchSubmit(trimmed);
      return;
    }

    navigate(`/products?search=${encodeURIComponent(trimmed)}`);
  };

  const headerClass = variant === 'overlay'
    ? 'header-container'
    : 'header-container header-standalone';

  return (
    <>
      <header className={headerClass}>
        <Link to="/" className="logo-link">
          <motion.div
            className="logo-img-wrapper"
            whileHover={{ rotate: 15, scale: 1.05 }}
          >
            <Logo size={40} variant="gold" className="logo-img" />
          </motion.div>
          <h1 className="logo-title">
            Ali <span>STUDIO</span>
          </h1>
        </Link>

        <div className="header-center-group">
          <div className="nav-pages-wrapper">
            <button
              type="button"
              className="nav-pages-btn glass"
              onClick={(e) => {
                e.stopPropagation();
                setIsNavPagesOpen(!isNavPagesOpen);
              }}
              aria-label="Open pages menu"
              title="Pages"
            >
              <StickyNote size={16} />
              <span className="nav-pages-btn-text">Studio Atlas</span>
            </button>
            <AnimatePresence>
              {isNavPagesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="nav-pages-dropdown glass"
                >
                  {studioNavPages.map((page) => (
                    <Link
                      key={page.name}
                      to={page.path}
                      className="nav-pages-link"
                      onClick={() => {
                        setIsNavPagesOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {page.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div className={`nav-search-bar ${isSearchFocused || searchQuery ? 'expanded' : ''}`}>
            <form
              className="nav-search-inner glass"
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch(searchQuery);
              }}
            >
              <Search size={18} className="nav-search-icon" />
              <input
                type="text"
                placeholder="Search furniture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="nav-search-input"
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="nav-search-clear"
                  >
                    <X size={14} />
                  </motion.button>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>

        <div className="header-actions">
          {user && (
            <Link to="/cart" className="icon-btn-mode cart-icon-link" style={{ position: 'relative' }}>
              <ShoppingCart size={18} />
              {cart.length > 0 && (
                <span className="cart-badge-count">
                  {cart.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </Link>
          )}

          {user && user.email && (
            <button
              type="button"
              onClick={() => navigate('/favourites')}
              className="icon-btn-mode nav-fav-icon-btn"
              title="Favourites"
            >
              <Heart size={16} fill="var(--accent-gold)" color="var(--accent-gold)" />
            </button>
          )}

          {user ? (
            <div className="user-menu-wrapper user-menu-compact">
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt={user.username || 'Profile'}
                  style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.15)' }}
                />
              )}
              {user.role === 'Admin' && (
                <Link to="/dashboard" className="btn-futuristic btn-compact-nav">
                  Dashboard
                </Link>
              )}
              <button onClick={logout} className="icon-btn-mode" title="Logout" type="button">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="header-auth-desktop">
              <Link to="/login" className="btn-outline header-auth-btn">
                Sign In
              </Link>
              <Link to="/register" className="btn-gold header-auth-btn">
                Register
              </Link>
            </div>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mobile-menu-toggle-btn"
            type="button"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mobile-nav-dropdown glass"
          >
            <form
              className="nav-search-inner glass"
              style={{ width: '100%' }}
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch(searchQuery);
              }}
            >
              <Search size={18} className="nav-search-icon" />
              <input
                type="text"
                placeholder="Search furniture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="nav-search-input"
              />
            </form>

            <div className="mobile-nav-pages-grid">
              {studioNavPages.map((page) => (
                <Link
                  key={page.name}
                  to={page.path}
                  className="mobile-nav-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {page.name}
                </Link>
              ))}
            </div>

            {user && user.email ? (
              <div className="mobile-nav-auth-row">
                <Link
                  to="/favourites"
                  className="btn-outline mobile-auth-btn"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Favourites
                </Link>
                {user.role === 'Admin' && (
                  <Link
                    to="/dashboard"
                    className="btn-futuristic mobile-auth-btn"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  type="button"
                  className="btn-outline mobile-auth-btn"
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="mobile-nav-auth-row">
                <Link
                  to="/login"
                  className="btn-outline mobile-auth-btn"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-gold mobile-auth-btn"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
