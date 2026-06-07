import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Star, Heart, Share2, MapPin, Truck, ShieldCheck, 
  RotateCcw, ShieldAlert, ArrowLeft, ShoppingCart, Minus, Plus 
} from 'lucide-react';
import { furnitureProducts } from './Home';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, addToCart, cart } = useAuth();
  const { theme } = useTheme();

  // Find the product
  const product = furnitureProducts.find((p) => p.id === parseInt(id)) || furnitureProducts[0];

  // Colors list (mock thumbnails based on category/style)
  const colors = [
    { name: 'Warm Oak', image: product.image },
    { name: 'Charcoal Black', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80' },
    { name: 'Velvet Emerald', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80' },
    { name: 'Classic Grey', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&auto=format&fit=crop&q=80' }
  ];

  const sizes = ['Standard', 'Compact', 'Double', 'King Size'];

  // State hooks
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.image);

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      // Reset color thumb selection based on new product image
      setSelectedColor({ name: 'Default Variant', image: product.image });
    }
  }, [product]);

  const handleQtyMinus = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleQtyPlus = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor.name, selectedSize);
    navigate('/cart');
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor.name, selectedSize);
    navigate('/cart');
  };

  // Extract numeric price for calculations
  const priceNum = parseInt(product.price.replace(/[^0-9]/g, ''));
  const originalPrice = `$` + Math.floor(priceNum * 4.5); // 78% mock discount
  const discountPercent = '-78%';

  return (
    <div className="product-details-root">
      {/* Top Breadcrumb Navigation */}
      <div className="breadcrumb-nav">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Collection</span>
        </Link>
        <span className="breadcrumb-divider">/</span>
        <span className="breadcrumb-current">{product.title}</span>
      </div>

      <div className="details-container-grid">
        {/* LEFT COLUMN: Gallery & Thumbnails */}
        <div className="details-gallery-col">
          <div className="main-image-frame glass">
            <img src={activeImage} alt={product.title} className="details-main-img" />
            <div className="deals-badge-tag">MEGA DEAL</div>
          </div>
          
          <div className="thumbnail-gallery-row">
            {colors.map((c, idx) => (
              <button 
                key={idx}
                onClick={() => {
                  setActiveImage(c.image);
                  setSelectedColor(c);
                }}
                className={`thumb-btn-frame glass ${activeImage === c.image ? 'active' : ''}`}
              >
                <img src={c.image} alt={c.name} className="thumb-img" />
              </button>
            ))}
          </div>
        </div>

        {/* CENTER COLUMN: Info & Selections */}
        <div className="details-info-col glass">
          <span className="info-category-label">{product.category}</span>
          <h1 className="info-product-title font-serif">{product.title}</h1>
          
          {/* Ratings & Share */}
          <div className="info-rating-row">
            <div className="stars-wrapper">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="#ffb700" color="#ffb700" />
              ))}
            </div>
            <span className="rating-count-text">Ratings 468</span>
            <span className="rating-divider">|</span>
            <button className="share-btn-inline" aria-label="Share">
              <Share2 size={16} />
            </button>
            <button className="share-btn-inline" aria-label="Favourite">
              <Heart size={16} />
            </button>
          </div>

          <div className="brand-info-line">
            Brand: <span className="brand-highlight">Ali Premium Studio</span> | <span className="shipping-highlight">Free Shipping</span>
          </div>

          <div className="promo-banner-orange">
            <span>SHOP NOW! 6.6 MID YEAR FESTIVAL SPECIAL OFFER</span>
          </div>

          {/* Pricing Box */}
          <div className="info-price-box">
            <div className="current-price-row">
              <span className="price-tag">{product.price}</span>
              <span className="discount-tag">{discountPercent}</span>
            </div>
            <div className="original-price-row">
              <span className="original-price-tag">{originalPrice}</span>
            </div>
          </div>

          <div className="divider-line-sub" />

          {/* Color Selector */}
          <div className="selector-group">
            <span className="selector-label">Color Family: <strong style={{ color: '#fff' }}>{selectedColor.name}</strong></span>
            <div className="color-options-grid">
              {colors.map((c, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedColor(c);
                    setActiveImage(c.image);
                  }}
                  className={`color-pill-btn glass ${selectedColor.name === c.name ? 'active' : ''}`}
                >
                  <img src={c.image} alt={c.name} className="color-pill-img" />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="selector-group">
            <span className="selector-label">Size: <strong style={{ color: '#fff' }}>{selectedSize}</strong></span>
            <div className="size-options-row">
              {sizes.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSize(s)}
                  className={`size-btn glass ${selectedSize === s ? 'active' : ''}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="selector-group">
            <span className="selector-label">Quantity</span>
            <div className="qty-picker-row">
              <button onClick={handleQtyMinus} className="qty-change-btn">
                <Minus size={14} />
              </button>
              <span className="qty-value-label">{quantity}</span>
              <button onClick={handleQtyPlus} className="qty-change-btn">
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Action Row */}
          <div className="purchase-buttons-row">
            <button onClick={handleBuyNow} className="btn-futuristic purchase-btn">
              Buy Now
            </button>
            <button onClick={handleAddToCart} className="btn-gold purchase-btn">
              <ShoppingCart size={16} />
              Add to Cart
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Delivery & Seller Info */}
        <div className="details-delivery-col glass">
          {/* Delivery section */}
          <div className="delivery-card-section">
            <h4 className="delivery-section-title">Delivery Options</h4>
            
            <div className="delivery-info-item">
              <MapPin size={18} className="delivery-icon" />
              <div className="delivery-text-group">
                <span className="delivery-header-lbl">Sindh, Karachi - Gulshan-e-Iqbal, Block 15</span>
                <span className="delivery-action-lbl">CHANGE</span>
              </div>
            </div>

            <div className="delivery-info-item">
              <Truck size={18} className="delivery-icon" />
              <div className="delivery-text-group">
                <span className="delivery-header-lbl">Standard Delivery</span>
                <span className="delivery-sub-lbl">Guaranteed by 11-13 Jun</span>
              </div>
              <span className="delivery-cost-badge free">FREE</span>
            </div>

            <div className="delivery-info-item">
              <Truck size={18} className="delivery-icon" />
              <div className="delivery-text-group">
                <span className="delivery-header-lbl">Standard Collection Point</span>
                <span className="delivery-sub-lbl">Guaranteed by 11-13 Jun</span>
              </div>
              <span className="delivery-cost-badge">Rs. 60</span>
            </div>

            <div className="delivery-info-item">
              <ShieldCheck size={18} className="delivery-icon" />
              <div className="delivery-text-group">
                <span className="delivery-header-lbl">Cash on Delivery Available</span>
              </div>
            </div>
          </div>

          <div className="divider-line-sub" />

          {/* Return & Warranty */}
          <div className="delivery-card-section">
            <h4 className="delivery-section-title">Return & Warranty</h4>
            
            <div className="delivery-info-item">
              <RotateCcw size={16} className="delivery-icon" />
              <div className="delivery-text-group">
                <span className="delivery-header-lbl">14 Days Easy Return</span>
                <span className="delivery-sub-lbl">Change of Mind Applicable</span>
              </div>
            </div>

            <div className="delivery-info-item">
              <ShieldAlert size={16} className="delivery-icon" />
              <div className="delivery-text-group">
                <span className="delivery-header-lbl">Warranty Not Available</span>
              </div>
            </div>
          </div>

          <div className="divider-line-sub" />

          {/* Seller Profile block */}
          <div className="seller-profile-section">
            <span className="seller-label-muted">Sold by</span>
            <h4 className="seller-brand-name">Ali Premium Furniture Store</h4>
            
            <div className="seller-metrics-row">
              <div className="metric-box">
                <span className="metric-value">81%</span>
                <span className="metric-label">Positive Seller Ratings</span>
              </div>
              <div className="metric-box">
                <span className="metric-value">97%</span>
                <span className="metric-label">Ship on Time</span>
              </div>
              <div className="metric-box">
                <span className="metric-value">99%</span>
                <span className="metric-label">Chat Response Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
