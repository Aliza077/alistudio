import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Moon, Sun, Heart, Share2, LogOut, Rss, Globe, Award, Send,
  ShoppingCart, Search, Menu, X, StickyNote
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { furnitureProducts, footerCategories } from '../data/furnitureData';
import { studioNavPages } from '../data/studioNav';

const navPages = studioNavPages;

const slides = [
  {
    image: '/slide1.png',
    title: 'Transforming Spaces',
    subtitle: 'Into Extraordinary Experiences'
  },
  {
    image: '/slide2.png',
    title: 'Minimalist Elegance',
    subtitle: 'Crafted For Modern Living'
  },
  {
    image: '/slide3.png',
    title: 'Futuristic Workspaces',
    subtitle: 'Designed For Absolute Focus'
  }
];

const dealSlides = [
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80',
];

// Pic 3 Categories icon models
const visualCategories = [
  { name: 'Popular Categories', label: 'All Designs', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&auto=format&fit=crop&q=80' },
  { name: 'Sofas', label: 'Sofas', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&auto=format&fit=crop&q=80' },
  { name: 'Bed', label: 'Bed', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=200&auto=format&fit=crop&q=80' },
  { name: 'Dressing Table', label: 'Dressing Table', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=200&auto=format&fit=crop&q=80' },
  { name: 'Chairs', label: 'Chairs', image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=200&auto=format&fit=crop&q=80' }
];

const filters = ['Popular Categories', 'Sofas', 'Bed', 'Dressing Table', 'Chairs', 'Tables', 'Wardrobes', 'Lighting', 'Decor'];

export default function Home() {
  const { user, logout, cart, addToCart, submitFeedback } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dealSlide, setDealSlide] = useState(0);
  const [activeFilter, setActiveFilter] = useState('Popular Categories');
  const [favorites, setFavorites] = useState([]);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackType, setFeedbackType] = useState('suggestion');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavPagesOpen, setIsNavPagesOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setDealSlide((prev) => (prev + 1) % dealSlides.length);
    }, 3000);
    return () => clearInterval(timer);
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

  const toggleFavorite = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };

  const handleShare = (e, productTitle) => {
    e.preventDefault();
    e.stopPropagation();
    alert(`Sharing link for: ${productTitle}`);
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    submitFeedback(feedbackText.trim(), feedbackType);
    setFeedbackText('');
    setFeedbackSuccess(true);
    setTimeout(() => setFeedbackSuccess(false), 3000);
  };

  const displayFilters = user ? [...filters, 'My Favourites'] : filters;

  // Filter products dynamically based on search query AND active filter tab
  const filteredProducts = furnitureProducts.filter((product) => {
    // 1. Filter by search query (match title, category or description)
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
                          
    // 2. Filter by category tab
    const matchesCategory = (activeFilter === 'My Favourites' && user)
      ? favorites.includes(product.id)
      : (activeFilter === 'Popular Categories' || product.category === activeFilter);

    return matchesSearch && matchesCategory;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="home-container">
      {/* Background Carousel */}
      <div className="carousel-bg">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="carousel-slide-img"
          />
        </AnimatePresence>
        <div className="carousel-overlay" />
      </div>

      {/* Navigation Header */}
      <header className="header-container">
        <Link to="/" className="logo-link">
          <motion.div 
            className="logo-img-wrapper"
            whileHover={{ rotate: 15, scale: 1.05 }}
          >
            <img src="/logo.svg" alt="Ali Logo" className="logo-img" />
          </motion.div>
          <h1 className="logo-title">
            Ali <span>STUDIO</span>
          </h1>
        </Link>

        <div className="header-center-group">
          {/* Pages menu button */}
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
                  {navPages.map((page) => (
                    <Link
                      key={page.name}
                      to={page.path}
                      className="nav-pages-link"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsNavPagesOpen(false);
                        setIsMobileMenuOpen(false);
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

          {/* Animated Search Bar */}
          <motion.div
            className={`nav-search-bar ${isSearchFocused || searchQuery ? 'expanded' : ''}`}
          >
            <div className="nav-search-inner glass">
              <Search size={18} className="nav-search-icon" />
              <input
                type="text"
                placeholder="Search furniture..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value) {
                    document.getElementById('furn-collection')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
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
                    onClick={() => setSearchQuery('')}
                    className="nav-search-clear"
                    type="button"
                  >
                    <X size={14} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Action Controls: Favourites, Cart, Sign In/Register or User welcome menu state */}
        <div className="header-actions">
          {user && (
            <Link to="/cart" className="icon-btn-mode cart-icon-link" style={{ position: 'relative' }}>
              <ShoppingCart size={18} />
              {cart.length > 0 && (
                <span className="cart-badge-count">{cart.reduce((acc, item) => acc + item.quantity, 0)}</span>
              )}
            </Link>
          )}

          <button onClick={toggleTheme} className="icon-btn-mode">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user && (
            <button
              onClick={() => {
                setActiveFilter('My Favourites');
                document.getElementById('furn-collection')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="icon-btn-mode nav-fav-icon-btn"
              title={`Favourites (${favorites.length})`}
            >
              <Heart size={16} fill="var(--accent-gold)" color="var(--accent-gold)" />
              {favorites.length > 0 && <span className="fav-mini-count">{favorites.length}</span>}
            </button>
          )}

          {user ? (
            <div className="user-menu-wrapper user-menu-compact">
              {user.role === 'Admin' && (
                <Link to="/dashboard" className="btn-futuristic btn-compact-nav">
                  Dashboard
                </Link>
              )}
              <button onClick={logout} className="icon-btn-mode" title="Logout">
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

          {/* Hamburger Menu Toggle (Mobile) */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="mobile-menu-toggle-btn">
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mobile-nav-dropdown glass"
          >
            <div className="nav-search-inner glass" style={{ width: '100%' }}>
              <Search size={18} className="nav-search-icon" />
              <input
                type="text"
                placeholder="Search furniture..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value) {
                    setIsMobileMenuOpen(false);
                    document.getElementById('furn-collection')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="nav-search-input"
              />
            </div>
            <div className="mobile-nav-pages-grid">
              {navPages.map((page) => (
                <Link
                  key={page.name}
                  to={page.path}
                  className="mobile-nav-link"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMobileMenuOpen(false);
                    navigate(page.path);
                  }}
                >
                  {page.name}
                </Link>
              ))}
            </div>
            {user ? (
              <div className="mobile-nav-auth-row">
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

      {/* Main Content Area */}
      <main className="main-content">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="hero-text-block"
        >
          {/* Heading */}
          <motion.h2 
            variants={itemVariants}
            className="hero-title"
          >
            Transforming Spaces <br />
            <span className="text-gradient-gold">Into Extraordinary</span> Experiences
          </motion.h2>

          {/* Subtitle Description */}
          <motion.p 
            variants={itemVariants}
            className="hero-desc"
          >
            Award-winning interior design studio crafting timeless, sophisticated environments for discerning clients across residential, commercial, and hospitality sectors.
          </motion.p>

          {/* Category Filters */}
          <motion.div 
            variants={itemVariants}
            className="filter-container"
          >
            {['Residential', 'Commercial', 'Hospitality', 'Retail'].map((category) => (
              <span key={category} className="tagline" style={{ marginBottom: 0, marginRight: '8px' }}>
                <span className="tagline-dot" />
                <span className="tagline-text">{category}</span>
              </span>
            ))}
          </motion.div>

          {/* Call to Actions */}
          <motion.div 
            variants={itemVariants}
            className="cta-container"
          >
            <a href="#furn-collection" className="btn-gold">
              Explore Furniture
              <ArrowRight size={16} />
            </a>
            <Link to="/contact" className="btn-outline">
              Book Consultation
            </Link>
          </motion.div>
        </motion.div>

        {/* Carousel Indicators (Dots) */}
        <div className="dots-container">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`dot-btn ${currentSlide === idx ? 'active' : ''}`}
            >
              <div className="dot" />
              {currentSlide === idx && (
                <div className="dot-active-ring" />
              )}
            </button>
          ))}
        </div>

      </main>

      {/* NEW: Pic 2 Mega Deals Section */}
      <section className="mega-deals-section glass">
        <div className="deals-banner-content">
          <div className="deals-text-panel">
            <span className="deals-fest-tag">6.6 MID YEAR FESTIVAL</span>
            <h2 className="deals-main-title font-serif">MEGA DEALS</h2>
            <p className="deals-discount-text">UP TO <span>80% OFF</span> ON PREMIUM LUXURY FURNITURE</p>
            <span className="deals-dates-lbl">5 JUNE (8PM) - 10 JUNE</span>
            <div style={{ marginTop: '20px' }}>
              <a href="#furn-collection" className="btn-gold">Shop Now</a>
            </div>
          </div>
          <div className="deals-image-panel deals-carousel-panel">
            <AnimatePresence mode="wait">
              <motion.img
                key={dealSlide}
                src={dealSlides[dealSlide]}
                alt={`Mega Deals ${dealSlide + 1}`}
                className="deals-promo-img"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              />
            </AnimatePresence>
            <div className="deals-carousel-dots">
              {dealSlides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`deals-dot ${dealSlide === idx ? 'active' : ''}`}
                  onClick={() => setDealSlide(idx)}
                  aria-label={`Deal slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Pic 3 Categories Circles Grid */}
      <section className="categories-circles-section">
        <div className="category-section-header">
          <h2 className="category-section-title font-serif">Shop by Category</h2>
          <p className="category-section-subtitle">Select a visual collection to filter products dynamically</p>
        </div>
        <div className="categories-circles-grid">
          {visualCategories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => {
                if (cat.name === 'Popular Categories') {
                  setActiveFilter(cat.name);
                  document.getElementById('furn-collection')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  navigate(`/products?cat=${encodeURIComponent(cat.name)}`);
                }
              }}
              className={`category-circle-card glass ${activeFilter === cat.name ? 'active' : ''}`}
            >
              <div className="category-img-frame">
                <img src={cat.image} alt={cat.label} className="category-circle-img" />
              </div>
              <span className="category-circle-lbl">{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* NEW: Pic 3 Furniture Cards Section */}
      <section id="furn-collection" className="furniture-section">
        <div className="furniture-section-header-row">
          <div>
            <h2 className="furniture-section-title font-serif">Discover Our Furniture Collection</h2>
            <p className="furniture-section-subtitle">Exquisite design, premium materials, and unparalleled craftsmanship.</p>
          </div>
          <Link to="/products" className="btn-gold" style={{ padding: '10px 20px', fontSize: '13px', whiteSpace: 'nowrap' }}>
            View All Products
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Category filters bar from Pic 3 */}
        <div className="furniture-nav-filters">
          {displayFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`furn-nav-btn ${activeFilter === filter ? 'active' : ''}`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="furniture-grid furniture-grid-compact">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="furniture-card furniture-card-compact"
              onClick={() => navigate(`/product/${product.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="furniture-img-wrapper furniture-img-compact">
                <img src={product.image} alt={product.title} className="furniture-img" />
                <div className="furniture-hover-actions furniture-hover-compact">
                  <button
                    onClick={(e) => toggleFavorite(e, product.id)}
                    className="action-btn-circle action-btn-sm"
                    style={{ color: favorites.includes(product.id) ? 'var(--accent-gold)' : '#171717' }}
                    title="Add to Favorite"
                  >
                    <Heart size={14} fill={favorites.includes(product.id) ? 'var(--accent-gold)' : 'none'} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart(product, 1, 'Default Color', 'Standard');
                      navigate('/cart');
                    }}
                    className="action-btn-circle action-btn-sm"
                    title="Add to Cart"
                  >
                    <ShoppingCart size={14} />
                  </button>
                </div>
              </div>
              <div className="furniture-info furniture-info-compact">
                <span className="furn-category">{product.category}</span>
                <h4 className="furn-title furn-title-compact">{product.title}</h4>
                <span className="furn-price furn-price-compact">{product.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="furn-footer furn-footer-compact">
        <div className="footer-inner footer-inner-compact">
          <div className="footer-cols-row footer-cols-compact">
            <div className="footer-link-col">
              <h4 className="footer-col-header">Shop by Category</h4>
              <ul className="footer-link-list footer-cat-grid">
                {footerCategories.map((cat) => (
                  <li key={cat.name}><Link to={cat.path}>{cat.name}</Link></li>
                ))}
              </ul>
            </div>

            <div className="footer-link-col">
              <h4 className="footer-col-header">Popular Items</h4>
              <ul className="footer-link-list footer-cat-grid">
                {furnitureProducts.slice(0, 8).map((p) => (
                  <li key={p.id}><Link to={`/product/${p.id}`}>{p.title}</Link></li>
                ))}
              </ul>
            </div>

            <div className="footer-link-col">
              <h4 className="footer-col-header">Studio Atlas</h4>
              <ul className="footer-link-list">
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/portfolio">Portfolio</Link></li>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/pricing">Pricing</Link></li>
                <li><Link to="/blog">Blog</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/products">All Products</Link></li>
              </ul>
            </div>

            <div className="footer-brand-col footer-brand-compact">
              <div className="footer-brand-top">
                <img src="/logo.svg" alt="Ali Logo" className="footer-bottom-logo" />
                <h3 className="footer-logo-title footer-logo-sm">Ali <span>STUDIO</span></h3>
              </div>
              <div className="footer-feedback-box footer-feedback-compact">
                <div className="footer-feedback-type-row">
                  <button type="button" className={`feedback-type-chip ${feedbackType === 'suggestion' ? 'active' : ''}`} onClick={() => setFeedbackType('suggestion')}>Suggestion</button>
                  <button type="button" className={`feedback-type-chip ${feedbackType === 'complaint' ? 'active' : ''}`} onClick={() => setFeedbackType('complaint')}>Complaint</button>
                </div>
                <form onSubmit={handleFeedbackSubmit} className="footer-feedback-form">
                  <input type="text" placeholder="Your message..." value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} required />
                  <button type="submit" className="btn-gold footer-send-btn"><Send size={11} /></button>
                </form>
                {feedbackSuccess && <p className="footer-feedback-success">Sent to admin!</p>}
              </div>
            </div>
          </div>

          <div className="footer-divider-line" />
          <div className="footer-bottom-row footer-bottom-compact">
            <span className="footer-copyright-text">&copy; {new Date().getFullYear()} Ali Studio</span>
            <div className="footer-social-circles">
              <button className="social-circle-btn social-circle-sm" aria-label="Facebook"><Globe size={14} /></button>
              <button className="social-circle-btn social-circle-sm" aria-label="RSS"><Rss size={14} /></button>
              <button className="social-circle-btn social-circle-sm" aria-label="Award"><Award size={14} /></button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
