import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SiteNavbar from '../components/SiteNavbar';
import { Trash2, ShoppingCart, ArrowRight, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Favourites() {
  const { user, favourites, removeFromFavourites, addToCart } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: '/favourites' }} />;
  }

  return (
    <div className="products-page">
      <SiteNavbar variant="overlay" />

      <header className="products-page-header">
        <Link to="/" className="products-back-link">
          <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} />
          Back to Home
        </Link>
        <div className="products-header-center">
          <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '50%', backgroundColor: 'rgba(175, 133, 80, 0.08)', color: 'var(--accent-blue)', marginBottom: '12px' }}>
            <Heart size={28} fill="currentColor" />
          </div>
          <h1 className="products-page-title font-serif">My Favourites</h1>
          <p className="products-page-subtitle">Your curated list of premium furniture designs</p>
        </div>
      </header>

      <div className="products-page-body" style={{ minHeight: '50vh', padding: '0 24px 60px' }}>
        {favourites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', textAlign: 'center' }}
            className="glass"
          >
            <Heart size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px', fontSize: '18px', fontWeight: '600' }}>No Favourites Yet</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', maxWidth: '320px', fontSize: '13px' }}>
              Tap the heart on any furniture piece to save it here.
            </p>
            <Link to="/" className="btn-gold" style={{ padding: '10px 24px', borderRadius: '10px' }}>Browse Collection</Link>
          </motion.div>
        ) : (
          <div className="furniture-grid furniture-grid-compact" style={{ marginTop: '12px' }}>
            {favourites.map((product) => {
              const pId = product._id || product.id;
              return (
                <div key={pId} className="furn-card glass">
                  <Link to={`/product/${pId}`} className="furn-card-img-link">
                    <img src={product.image} alt={product.title} className="furn-card-img" loading="lazy" />
                  </Link>
                  <div className="furn-card-body">
                    <span className="furn-category">{product.category}</span>
                    <h4 className="furn-title furn-title-compact">{product.title}</h4>
                    <span className="furn-price furn-price-compact">${product.price}</span>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                      <button
                        type="button"
                        className="btn-gold"
                        style={{ flex: 1, padding: '8px', borderRadius: '8px', fontSize: '12px' }}
                        onClick={() => addToCart(product)}
                      >
                        <ShoppingCart size={12} /> Add
                      </button>
                      <button
                        type="button"
                        className="btn-outline"
                        style={{ padding: '8px 10px', borderRadius: '8px' }}
                        onClick={() => removeFromFavourites(pId)}
                        aria-label="Remove favourite"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
