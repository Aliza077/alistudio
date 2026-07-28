import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchProductById } from '../utils/productApi';
import SiteNavbar from '../components/SiteNavbar';
import SiteFooter from '../components/SiteFooter';
import { Star, Heart, Share2, ShoppingCart, Minus, Plus } from 'lucide-react';

const COLOR_OPTIONS = [
  { name: 'Warm Oak', swatch: '#c4a574' },
  { name: 'Charcoal Black', swatch: '#2a2a2a' },
  { name: 'Velvet Emerald', swatch: '#1a5c45' },
  { name: 'Classic Grey', swatch: '#8a8a8a' },
];

const SIZES = ['Standard', 'Compact', 'Double', 'King Size'];

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, addToCart, addToFavourites, removeFromFavourites, isFavourite } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewMsg, setReviewMsg] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [selectedSize, setSelectedSize] = useState(SIZES[0]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    const loadProduct = async () => {
      setLoading(true);
      try {
        const data = await fetchProductById(id);
        if (!cancelled) setProduct(data);
      } catch (err) {
        console.error('Error loading product details:', err);
        if (!cancelled) setProduct(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadProduct();
    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    if (!product?._id || String(product._id).startsWith('seed-')) return undefined;
    let cancelled = false;
    fetch(`/api/reviews/product/${product._id}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data.data)) setReviews(data.data);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [product?._id]);

  if (loading) {
    return (
      <div className="product-details-root">
        <SiteNavbar variant="overlay" />
        <div style={{ textAlign: 'center', padding: '100px 0', color: '#fff' }}>
          <h2>Loading product...</h2>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-root">
        <SiteNavbar variant="overlay" />
        <div style={{ textAlign: 'center', padding: '100px 0', color: '#fff' }}>
          <h2>Product Not Found</h2>
          <Link to="/products" className="btn-gold" style={{ display: 'inline-block', marginTop: '20px', padding: '10px 24px', borderRadius: '10px' }}>
            Back to Catalogue
          </Link>
        </div>
        <SiteFooter compact />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor?.name || 'Default Variant', selectedSize);
    navigate('/cart');
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor?.name || 'Default Variant', selectedSize);
    navigate('/cart');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewMsg('');
    setReviewError('');
    if (!user) {
      setReviewError('Please log in to leave a review.');
      return;
    }
    const productId = product._id || product.id;
    if (String(productId).startsWith('seed-')) {
      setReviewError('Reviews require a database product. Try again after products sync.');
      return;
    }
    try {
      const res = await fetch(`/api/reviews/product/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || localStorage.getItem('ali_token')}`,
        },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment,
          name: user.username || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setReviewError(data.message || 'Failed to submit review.');
        return;
      }
      setReviews((prev) => [data.data, ...prev]);
      setReviewComment('');
      setReviewRating(5);
      setReviewMsg('Review submitted. Thank you!');
    } catch {
      setReviewError('Network error while submitting review.');
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;
  const priceNum = Number(product.price) || 0;
  const originalPrice = `$${Math.floor(priceNum * 4.5)}`;
  const pId = product._id || product.id;
  const favourited = isFavourite(pId);

  return (
    <div className="product-details-root">
      <SiteNavbar variant="overlay" />

      <div className="details-container-grid details-container-two-col" id="product-specs">
        <div className="details-gallery-col">
          <div className="main-image-frame glass">
            <img
              src={product.image}
              alt={product.title}
              className="details-main-img"
              loading="eager"
              decoding="async"
            />
            <div className="deals-badge-tag">MEGA DEAL</div>
          </div>
        </div>

        <div className="details-info-col glass">
          <span className="info-category-label">{product.category}</span>
          <h1 className="info-product-title font-serif">{product.title}</h1>

          <div className="info-rating-row">
            <div className="stars-wrapper">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < Math.round(Number(avgRating || 5)) ? '#ffb700' : 'none'}
                  color="#ffb700"
                />
              ))}
            </div>
            <span className="rating-count-text">
              {avgRating ? `${avgRating} · ${reviews.length} review${reviews.length === 1 ? '' : 's'}` : 'No reviews yet'}
            </span>
            <span className="rating-divider">|</span>
            <button className="share-btn-inline" aria-label="Share" type="button">
              <Share2 size={16} />
            </button>
            <button
              className="share-btn-inline"
              aria-label="Favourite"
              type="button"
              onClick={() => {
                if (!user) {
                  navigate('/login');
                  return;
                }
                favourited ? removeFromFavourites(pId) : addToFavourites(product);
              }}
              style={{ color: favourited ? 'var(--accent-gold)' : undefined }}
            >
              <Heart size={16} fill={favourited ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="brand-info-line">
            Brand: <span className="brand-highlight">Ali Premium Studio</span> | <span className="shipping-highlight">Free Shipping</span>
          </div>

          <div className="promo-banner-orange">
            <span>SHOP NOW! 6.6 MID YEAR FESTIVAL SPECIAL OFFER</span>
          </div>

          <div className="info-price-box">
            <div className="current-price-row">
              <span className="price-tag">${product.price}</span>
              <span className="discount-tag">-78%</span>
            </div>
            <div className="original-price-row">
              <span className="original-price-tag">{originalPrice}</span>
            </div>
          </div>

          <div className="divider-line-sub" />

          <div className="selector-group">
            <span className="selector-label">Description</span>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6, margin: '8px 0 0' }}>
              {product.description || 'Premium furniture piece crafted for modern living.'}
            </p>
            {product.quantity !== undefined && (
              <p style={{ color: product.quantity > 0 ? '#34d399' : '#f87171', fontSize: '12px', marginTop: '8px' }}>
                {product.quantity > 0 ? `${product.quantity} units in stock` : 'Out of stock'}
              </p>
            )}
          </div>

          <div className="selector-group">
            <span className="selector-label">Color Family: <strong style={{ color: '#fff' }}>{selectedColor?.name}</strong></span>
            <div className="color-options-grid">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`color-pill-btn glass ${selectedColor?.name === c.name ? 'active' : ''}`}
                >
                  <span className="color-swatch-dot" style={{ background: c.swatch }} />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="selector-group">
            <span className="selector-label">Size: <strong style={{ color: '#fff' }}>{selectedSize}</strong></span>
            <div className="size-options-row">
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  className={`size-btn glass ${selectedSize === s ? 'active' : ''}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="selector-group">
            <span className="selector-label">Quantity</span>
            <div className="qty-picker-row">
              <button type="button" onClick={() => quantity > 1 && setQuantity(quantity - 1)} className="qty-change-btn">
                <Minus size={14} />
              </button>
              <span className="qty-value-label">{quantity}</span>
              <button type="button" onClick={() => setQuantity(quantity + 1)} className="qty-change-btn">
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className="purchase-buttons-row">
            <button type="button" onClick={handleBuyNow} className="btn-futuristic purchase-btn">Buy Now</button>
            <button type="button" onClick={handleAddToCart} className="btn-gold purchase-btn">
              <ShoppingCart size={16} /> Add to Cart
            </button>
          </div>
        </div>
      </div>

      <section id="customer-reviews" className="glass" style={{ margin: '32px auto 48px', maxWidth: '1100px', padding: '28px', borderRadius: '20px' }}>
        <h3 className="font-serif" style={{ color: '#fff', fontSize: '22px', marginBottom: '8px' }}>Customer Reviews</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px' }}>
          See what buyers say about {product.title}.
        </p>

        {reviewMsg && <div className="form-success-msg" style={{ marginBottom: '12px' }}>{reviewMsg}</div>}
        {reviewError && <div className="form-error-msg" style={{ marginBottom: '12px' }}>{reviewError}</div>}

        <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Your rating:</span>
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" onClick={() => setReviewRating(n)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                <Star size={18} fill={n <= reviewRating ? '#ffb700' : 'none'} color="#ffb700" />
              </button>
            ))}
          </div>
          <textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Write your review about quality, size, color..."
            required
            rows={3}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: '#fff',
              padding: '12px',
              fontSize: '13px',
              resize: 'vertical',
            }}
          />
          <button type="submit" className="btn-gold" style={{ alignSelf: 'flex-start', padding: '10px 20px', borderRadius: '10px' }}>
            Submit Review
          </button>
        </form>

        {reviews.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No reviews yet. Be the first to review this product.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {reviews.map((rev) => (
              <div key={rev._id} style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '6px' }}>
                  <strong style={{ color: '#fff', fontSize: '13px' }}>{rev.name}</strong>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill={i < rev.rating ? '#ffb700' : 'none'} color="#ffb700" />
                    ))}
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <SiteFooter compact />
    </div>
  );
}
