import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, ShoppingCart } from 'lucide-react';
import { furnitureProducts, productCategories } from '../data/furnitureData';
import { useAuth } from '../context/AuthContext';

export default function Products() {
  const { addToCart } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get('cat') || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  const handleCategoryClick = (catId) => {
    setActiveCategory(catId);
    if (catId === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ cat: catId });
    }
  };

  const filtered = furnitureProducts.filter((p) => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch = !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const activeLabel = productCategories.find((c) => c.id === activeCategory)?.name || 'All Products';

  return (
    <div className="products-page">
      <header className="products-page-header">
        <Link to="/" className="products-back-link">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
        <div className="products-header-center">
          <img src="/logo.svg" alt="Ali Logo" className="products-logo" />
          <h1 className="products-page-title font-serif">Product Catalog</h1>
          <p className="products-page-subtitle">Browse our full furniture collection by category</p>
        </div>
      </header>

      <div className="products-page-body">
        <aside className="products-sidebar glass">
          <h3 className="products-sidebar-title">Categories</h3>
          <div className="products-cat-list">
            {productCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`products-cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => handleCategoryClick(cat.id)}
              >
                <span className="products-cat-icon">{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </aside>

        <main className="products-main">
          <div className="products-toolbar">
            <h2 className="products-active-cat">{activeLabel}</h2>
            <span className="products-count">{filtered.length} items</span>
            <div className="products-search glass">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="products-grid">
            {filtered.map((product, idx) => (
              <motion.div
                key={product.id}
                className="product-card-compact"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="product-card-img-wrap">
                  <img src={product.image} alt={product.title} />
                  <button
                    type="button"
                    className="product-card-cart-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product, 1, 'Default', 'Standard');
                      navigate('/cart');
                    }}
                    aria-label="Add to cart"
                  >
                    <ShoppingCart size={14} />
                  </button>
                </div>
                <div className="product-card-body">
                  <span className="product-card-cat">{product.category}</span>
                  <h4 className="product-card-title">{product.title}</h4>
                  <span className="product-card-price">{product.price}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="products-empty">
              <p>No products found in this category.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
