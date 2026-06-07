import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Moon, Sun, Heart, Share2, LogOut, Rss, Globe, Award, Send,
  ShoppingCart, Search, Menu, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

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

// Pic 3 Categories icon models
const visualCategories = [
  { name: 'Popular Categories', label: 'All Designs', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&auto=format&fit=crop&q=80' },
  { name: 'Sofas', label: 'Sofas', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&auto=format&fit=crop&q=80' },
  { name: 'Bed', label: 'Bed', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=200&auto=format&fit=crop&q=80' },
  { name: 'Dressing Table', label: 'Dressing Table', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=200&auto=format&fit=crop&q=80' },
  { name: 'Chairs', label: 'Chairs', image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=200&auto=format&fit=crop&q=80' }
];

const filters = ['Popular Categories', 'Sofas', 'Bed', 'Dressing Table', 'Chairs'];

// Mock catalog furniture products with descriptions and high-resolution images
export const furnitureProducts = [
  {
    id: 1,
    title: 'Oatmeal Accent Lounge Chair',
    category: 'Chairs',
    price: '$640',
    description: 'A cozy accent chair with soft premium oatmeal upholstery and solid oak legs.',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    title: 'Oakwood Dressing Cabinet',
    category: 'Dressing Table',
    price: '$1,250',
    description: 'Minimalist solid oak dressing table and cabinet with soft-close drawers and clean lines.',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    title: 'Classic Wooden Dining Chair',
    category: 'Chairs',
    price: '$180',
    description: 'Solid wood dining chair with comfortable seat padding and minimalist backrest.',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 4,
    title: 'Emerald Velvet Occasional Sofa',
    category: 'Sofas',
    price: '$2,100',
    description: 'Luxurious emerald velvet sofa with sleek golden legs and high-density foam cushions.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 5,
    title: 'Walnut Dressing Table & Mirror',
    category: 'Dressing Table',
    price: '$890',
    description: 'Premium dark walnut dressing vanity with a large circular mirror and multiple jewelry organizers.',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 6,
    title: 'Luxury King Master Bed Set',
    category: 'Bed',
    price: '$3,400',
    description: 'King size bed set with high-grade tufted headboard, matching side tables, and organic sheets.',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 7,
    title: 'Elegant Dressing Table Stool',
    category: 'Dressing Table',
    price: '$95',
    description: 'Round cushioned dressing stool with sleek gold legs and premium velvet cover.',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 8,
    title: 'Luxury Tufted Lounger Sofa',
    category: 'Sofas',
    price: '$910',
    description: 'App-controlled smart reclining sofa with adjustable headrest and integrated USB ports.',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 9,
    title: 'Nordic Wooden Bed Frame',
    category: 'Bed',
    price: '$1,150',
    description: 'Nordic solid ash wood queen bed frame with integrated bedside panels.',
    image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 10,
    title: 'Ergonomic Mesh Office Chair',
    category: 'Chairs',
    price: '$420',
    description: 'Fully adjustable mesh chair with adaptive lumbar support, 3D armrests, and synchro-tilt mechanism.',
    image: 'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 11,
    title: 'Teakwood Outdoor Sofa Set',
    category: 'Sofas',
    price: '$1,850',
    description: 'Weather-resistant teakwood outdoor sofa set with quick-dry cushions covered in Sunbrella fabric.',
    image: 'https://images.unsplash.com/photo-1599423300746-b62533397364?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 12,
    title: 'Classic White Dressing Console',
    category: 'Dressing Table',
    price: '$850',
    description: 'Dressing table console with three drawers and matching circular vanity mirror.',
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 13,
    title: 'Comfortable Single Guest Bed',
    category: 'Bed',
    price: '$580',
    description: 'Compact guest bed frame with high-quality pine headboard and steel support structure.',
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 14,
    title: 'Premium Ergonomic Desk Chair',
    category: 'Chairs',
    price: '$320',
    description: 'Fully adjustable high-back ergonomic desk chair with lumbar support.',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80'
  }
];

export default function Home() {
  const { user, logout, cart, addToCart } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeFilter, setActiveFilter] = useState('Popular Categories');
  const [favorites, setFavorites] = useState([]);
  const [feedbackText, setFeedbackText] = useState('');
  
  // Search & Mobile menu toggle states
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auto slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
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
    alert('Thank you! Your suggestion/report has been securely transmitted.');
    setFeedbackText('');
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
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="carousel-slide-img"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
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
            <img src="/logo.png" alt="Ali Logo" className="logo-img" />
          </motion.div>
          <h1 className="logo-title">
            Ali <span>STUDIO</span>
          </h1>
        </Link>

        {/* Navigation Menu (Desktop) */}
        <nav className="nav-menu">
          {['About', 'Portfolio', 'Services', 'Pricing', 'Blog'].map((item) => (
            <Link 
              key={item} 
              to={`/${item.toLowerCase()}`}
              className="nav-link"
            >
              {item}
              <span className="nav-link-line" />
            </Link>
          ))}
        </nav>

        {/* Action Controls: Favourites, Cart, Sign In/Register or User welcome menu state */}
        <div className="header-actions">
          {/* Cart Icon Button */}
          <Link to="/cart" className="icon-btn-mode cart-icon-link" style={{ position: 'relative' }}>
            <ShoppingCart size={18} />
            {cart.length > 0 && (
              <span className="cart-badge-count">{cart.reduce((acc, item) => acc + item.quantity, 0)}</span>
            )}
          </Link>

          <button onClick={toggleTheme} className="icon-btn-mode">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user && (
            <button 
              onClick={() => {
                setActiveFilter('My Favourites');
                document.getElementById('furn-collection')?.scrollIntoView({ behavior: 'smooth' });
              }} 
              className="btn-outline nav-favorites-btn"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderColor: 'var(--accent-gold)' }}
            >
              <Heart size={14} fill="var(--accent-gold)" color="var(--accent-gold)" />
              <span className="fav-text">Favourites ({favorites.length})</span>
            </button>
          )}
          
          {user ? (
            <div className="user-menu-wrapper">
              <div className="user-welcome-badge" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <User size={12} />
                )}
                Welcome, <span>{user.username}</span>
              </div>
              
              {user.role === 'Admin' && (
                <Link to="/dashboard" className="btn-futuristic">
                  Admin Dashboard
                </Link>
              )}

              <button onClick={logout} className="btn-outline" style={{ display: 'flex', gap: '8px', padding: '10px 18px' }}>
                <LogOut size={14} />
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-outline" style={{ padding: '10px 22px', fontSize: '13px' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn-gold" style={{ padding: '10px 22px', fontSize: '13px' }}>
                Register
              </Link>
            </>
          )}

          {/* Hamburger Menu Toggle (Mobile) */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="mobile-menu-toggle-btn">
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile nav links drop-down list */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mobile-nav-dropdown glass"
          >
            {['About', 'Portfolio', 'Services', 'Pricing', 'Blog'].map((item) => (
              <Link 
                key={item} 
                to={`/${item.toLowerCase()}`}
                className="mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
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
          {/* Tagline */}
          <motion.div 
            variants={itemVariants}
            className="tagline"
          >
            <span className="tagline-dot" />
            <span className="tagline-text">
              47 Projects Completed
            </span>
          </motion.div>

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

        {/* Stats Row */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="stats-container"
        >
          {[
            { value: '47+', label: 'Projects Completed' },
            { value: '15+', label: 'Years Experience' },
            { value: '12', label: 'Design Awards' },
            { value: '100%', label: 'Client Satisfaction' }
          ].map((stat, idx) => (
            <div key={idx} className="stat-item">
              <h3 className="stat-value">
                {stat.value}
              </h3>
              <p className="stat-label">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
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
          <div className="deals-image-panel">
            <img 
              src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop&q=80" 
              alt="Mega Deals Furniture" 
              className="deals-promo-img" 
            />
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
                setActiveFilter(cat.name);
                document.getElementById('furn-collection')?.scrollIntoView({ behavior: 'smooth' });
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
        <h2 className="furniture-section-title font-serif">Discover Our Furniture Collection</h2>
        <p className="furniture-section-subtitle">Exquisite design, premium materials, and unparalleled craftsmanship.</p>

        {/* NEW: Pic 4 Search Bar & Cart Header */}
        <div className="search-bar-row">
          <div className="search-input-frame glass">
            <Search size={18} className="search-icon-left" />
            <input 
              type="text" 
              placeholder="Search by title, category, or style..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="clear-search-btn">
                <X size={14} />
              </button>
            )}
          </div>
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
        <div className="furniture-grid">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="furniture-card"
              onClick={() => navigate(`/product/${product.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="furniture-img-wrapper">
                <img src={product.image} alt={product.title} className="furniture-img" />
                
                {/* Hover overlay favorite and share buttons */}
                <div className="furniture-hover-actions">
                  <button 
                    onClick={(e) => toggleFavorite(e, product.id)}
                    className="action-btn-circle"
                    style={{ color: favorites.includes(product.id) ? 'var(--accent-gold)' : '#171717' }}
                    title="Add to Favorite"
                  >
                    <Heart size={20} fill={favorites.includes(product.id) ? 'var(--accent-gold)' : 'none'} />
                  </button>

                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart(product, 1, 'Default Color', 'Standard');
                      navigate('/cart');
                    }}
                    className="action-btn-circle"
                    title="Add to Cart"
                  >
                    <ShoppingCart size={20} />
                  </button>
                  
                  <button 
                    onClick={(e) => handleShare(e, product.title)}
                    className="action-btn-circle"
                    title="Share product"
                  >
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="furniture-info">
                <span className="furn-category">{product.category}</span>
                <h4 className="furn-title">{product.title}</h4>
                <p className="furn-desc">{product.description}</p>
                <span className="furn-price">{product.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEW: Pic 4 Footer Section */}
      <footer className="furn-footer">
        <div className="footer-inner">
          <div className="footer-cols-row">
            {/* Column 1 */}
            <div className="footer-link-col">
              <h4 className="footer-col-header">Products</h4>
              <ul className="footer-link-list">
                <li><a href="#themes">Weebly Themes</a></li>
                <li><a href="#faq">Pre-Sale FAQs</a></li>
                <li><a href="#ticket">Submit a Ticket</a></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className="footer-link-col">
              <h4 className="footer-col-header">Services</h4>
              <ul className="footer-link-list">
                <li><Link to="/services">Theme Tweak</Link></li>
                <li><Link to="/services">Custom Craft</Link></li>
                <li><Link to="/services">Full Consultation</Link></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="footer-link-col">
              <h4 className="footer-col-header">Showcase</h4>
              <ul className="footer-link-list">
                <li><Link to="/portfolio">Widgetkit</Link></li>
                <li><a href="#support">Support Forums</a></li>
                <li><a href="#knowledge">Documentation</a></li>
              </ul>
            </div>

            {/* Column 4 */}
            <div className="footer-link-col">
              <h4 className="footer-col-header">Company</h4>
              <ul className="footer-link-list">
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><a href="#affiliates">Affiliates</a></li>
                <li><a href="#resources">Resources</a></li>
              </ul>
            </div>

            {/* Brand column with logo aligned (Pic 3 logo adjustment) */}
            <div className="footer-brand-col">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div className="logo-img-wrapper" style={{ width: '32px', height: '32px', borderRadius: '8px' }}>
                  <img src="/logo.png" alt="Ali Logo" className="logo-img" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', gap: '8px' }}>
                  <h3 className="footer-logo-title" style={{ margin: 0, lineHeight: 1 }}>Ali <span>STUDIO</span></h3>
                  <span className="footer-brand-slogan" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>— Furnishing Spaces</span>
                </div>
              </div>

              {/* Pic 3 Contact report & suggestion box */}
              <div className="footer-feedback-box" style={{ marginTop: '20px', maxWidth: '240px' }}>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '500' }}>
                  Submit suggestion or report issue:
                </p>
                <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div className="form-underlined-group" style={{ flexGrow: 1, borderBottomColor: 'rgba(255,255,255,0.1)' }}>
                    <input 
                      type="text" 
                      placeholder="Type suggestion/report..." 
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      required
                      style={{ padding: '6px 0', fontSize: '12px', color: '#fff', width: '100%' }}
                    />
                  </div>
                  <button type="submit" className="btn-gold" style={{ padding: '6px 10px', borderRadius: '8px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Send size={11} />
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="footer-divider-line" />

          {/* Social connections and copyright from Pic 4 */}
          <div className="footer-bottom-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="logo-img-wrapper" style={{ width: '28px', height: '28px', borderRadius: '6px' }}>
                <img src="/logo.png" alt="Ali Logo" className="logo-img" />
              </div>
              <span className="footer-logo-title" style={{ fontSize: '15px', margin: 0 }}>Ali <span>STUDIO</span></span>
            </div>
            
            <p className="footer-copyright-text" style={{ margin: 0 }}>
              &copy; {new Date().getFullYear()} Ali Studio. All rights reserved.
            </p>

            <div className="footer-social-circles" style={{ margin: 0 }}>
              <button className="social-circle-btn" aria-label="Facebook">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </button>
              <button className="social-circle-btn" aria-label="Twitter">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </button>
              <button className="social-circle-btn" aria-label="RSS">
                <Rss size={16} />
              </button>
              <button className="social-circle-btn" aria-label="Google Plus">
                <Globe size={16} />
              </button>
              <button className="social-circle-btn" aria-label="Award">
                <Award size={16} />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
