import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Trash2, ShoppingBag, ArrowLeft, Plus, Minus, 
  MapPin, ShieldCheck, Navigation, Search, ExternalLink
} from 'lucide-react';

const LOCATION_STORAGE_KEY = 'ali_shipping_location';

const DEFAULT_LOCATION = {
  address: 'Block 15, Gulshan-e-Iqbal, Karachi',
  lat: 24.9236,
  lng: 67.0889,
};

async function reverseGeocode(lat, lng) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
  );
  if (!res.ok) throw new Error('Could not resolve address');
  const data = await res.json();
  return data.display_name;
}

async function searchAddress(query) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
  );
  if (!res.ok) throw new Error('Search failed');
  const data = await res.json();
  if (!data[0]) return null;
  return {
    address: data[0].display_name,
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  };
}

function getGoogleMapsEmbedUrl(lat, lng) {
  return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
}

function getGoogleMapsLink(lat, lng, address) {
  const query = address ? encodeURIComponent(address) : `${lat},${lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export default function Cart() {
  const { cart, updateCartQuantity, removeFromCart, clearCart } = useAuth();

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [locationQuery, setLocationQuery] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCATION_STORAGE_KEY);
      if (saved) setLocation(JSON.parse(saved));
    } catch {
      /* ignore invalid saved location */
    }
  }, []);

  const saveLocation = (nextLocation) => {
    setLocation(nextLocation);
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(nextLocation));
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported on this device.');
      return;
    }

    setLocationLoading(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const address = await reverseGeocode(latitude, longitude);
          saveLocation({ address, lat: latitude, lng: longitude });
        } catch {
          setLocationError('Could not fetch address for your current location.');
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        setLocationError('Location permission denied. Search manually or allow location access.');
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const handleSearchLocation = async (e) => {
    e.preventDefault();
    const query = locationQuery.trim();
    if (!query) return;

    setLocationLoading(true);
    setLocationError('');

    try {
      const result = await searchAddress(query);
      if (!result) {
        setLocationError('No location found. Try a different address.');
        return;
      }
      saveLocation(result);
      setLocationQuery('');
    } catch {
      setLocationError('Could not search location. Please try again.');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'ALI66') {
      setDiscount(20); // 20% discount
      alert('Promo code applied successfully! 20% Discount has been deducted.');
    } else {
      alert('Invalid promo code. Try "ALI66" for a 20% mid-year discount!');
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((acc, item) => {
      const price = parseInt(item.price.replace(/[^0-9]/g, ''));
      return acc + (price * item.quantity);
    }, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    // Generate random tracking ID
    const randomTrack = 'ALI-' + Math.floor(100000 + Math.random() * 900000);
    setTrackingId(randomTrack);
    setCheckoutSuccess(true);
    clearCart();
  };

  const subtotal = calculateSubtotal();
  const shippingFee = subtotal > 1000 ? 0 : 60; // Free shipping over $1000
  const discountAmount = Math.floor(subtotal * (discount / 100));
  const orderTotal = subtotal + shippingFee - discountAmount;

  return (
    <div className="cart-page-root">
      {/* Top Breadcrumb Navigation */}
      <div className="breadcrumb-nav">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} />
          <span>Continue Shopping</span>
        </Link>
        <span className="breadcrumb-divider">/</span>
        <span className="breadcrumb-current">Shopping Cart</span>
      </div>

      {checkoutSuccess ? (
        /* Checkout Success Overlay Screen */
        <div className="checkout-success-panel glass" style={{ textAlign: 'center', padding: '60px 24px', margin: '40px auto', maxWidth: '600px', borderRadius: '24px' }}>
          <div className="success-icon-circle" style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(52, 211, 153, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <ShieldCheck size={40} color="#34d399" />
          </div>
          <h2 className="success-title font-serif" style={{ color: '#fff', fontSize: '28px', marginBottom: '16px' }}>Order Placed Successfully!</h2>
          <p className="success-subtitle" style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '15px' }}>
            Thank you for shopping with Ali Studio. Your simulated furniture order is processed.
          </p>
          <div className="tracking-info-box" style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'inline-block', marginBottom: '32px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Simulated Tracking ID</span>
            <strong style={{ color: 'var(--accent-gold)', fontSize: '18px', letterSpacing: '0.05em' }}>{trackingId}</strong>
          </div>
          <div>
            <Link to="/" className="btn-gold" style={{ padding: '12px 32px', display: 'inline-block', borderRadius: '10px' }}>
              Back to Catalog
            </Link>
          </div>
        </div>
      ) : cart.length === 0 ? (
        /* Empty Cart Screen */
        <div className="cart-empty-panel glass" style={{ textAlign: 'center', padding: '80px 24px', margin: '40px auto', maxWidth: '500px', borderRadius: '24px' }}>
          <ShoppingBag size={48} style={{ color: 'var(--text-muted)', marginBottom: '20px' }} />
          <h2 className="font-serif" style={{ color: '#fff', marginBottom: '12px' }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
            Add some furniture pieces from our award-winning collection to start designing your home.
          </p>
          <Link to="/" className="btn-gold" style={{ padding: '12px 28px', display: 'inline-block', borderRadius: '10px' }}>
            Explore Furniture
          </Link>
        </div>
      ) : (
        /* Cart List & Checkout Grid */
        <div className="cart-container-grid">
          {/* LEFT COLUMN: Cart Items List */}
          <div className="cart-items-col glass">
            <div className="cart-header-line">
              <h1 className="cart-title font-serif">Shopping Cart ({cart.length} items)</h1>
            </div>

            <div className="cart-items-list">
              {cart.map((item) => {
                const itemPriceNum = parseInt(item.price.replace(/[^0-9]/g, ''));
                const itemSubtotal = itemPriceNum * item.quantity;
                
                return (
                  <div key={item.cartItemId} className="cart-item-row">
                    <div className="cart-item-img-frame">
                      <img src={item.image} alt={item.title} className="cart-item-img" />
                    </div>

                    <div className="cart-item-info-block">
                      <h4 className="cart-item-title">{item.title}</h4>
                      <div className="cart-item-variants-line">
                        {item.selectedColor && (
                          <span className="variant-tag">Color: {item.selectedColor}</span>
                        )}
                        {item.selectedSize && (
                          <span className="variant-tag">Size: {item.selectedSize}</span>
                        )}
                      </div>
                      <span className="cart-item-price-unit">Price: {item.price}</span>
                    </div>

                    {/* Quantity selectors */}
                    <div className="cart-qty-selectors">
                      <button 
                        onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                        className="qty-btn-circle"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="qty-label-value">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                        className="qty-btn-circle"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Subtotal & Delete */}
                    <div className="cart-item-subtotal-block">
                      <span className="cart-item-subtotal-val">${itemSubtotal.toLocaleString()}</span>
                      <button 
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="cart-item-delete-btn"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Order Summary Card */}
          <div className="cart-summary-col glass">
            {/* Delivery address location */}
            <div className="summary-section cart-location-section">
              <h4 className="summary-section-title">Shipping Location</h4>

              <form onSubmit={handleSearchLocation} className="cart-location-search-row">
                <input
                  type="text"
                  className="cart-location-input"
                  placeholder="Search address on map..."
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                />
                <button type="submit" className="cart-location-btn primary" disabled={locationLoading}>
                  <Search size={14} />
                </button>
              </form>

              <button
                type="button"
                className="cart-location-btn"
                onClick={handleUseCurrentLocation}
                disabled={locationLoading}
              >
                <Navigation size={14} />
                {locationLoading ? 'Locating...' : 'Use My Current Location'}
              </button>

              {locationError && (
                <p className="cart-location-status error">{locationError}</p>
              )}

              <div className="summary-address-row">
                <MapPin size={18} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
                <div style={{ flexGrow: 1, minWidth: 0 }}>
                  <p className="summary-address-text">{location.address}</p>
                </div>
              </div>

              <div className="cart-location-map-wrap">
                <iframe
                  title="Shipping location map"
                  src={getGoogleMapsEmbedUrl(location.lat, location.lng)}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>

              <a
                href={getGoogleMapsLink(location.lat, location.lng, location.address)}
                target="_blank"
                rel="noopener noreferrer"
                className="cart-location-open-link"
              >
                <ExternalLink size={14} />
                Open in Google Maps
              </a>
            </div>

            <div className="divider-line-sub" />

            {/* Promo code form */}
            <div className="summary-section">
              <h4 className="summary-section-title">Apply Promo Code</h4>
              <form onSubmit={handleApplyPromo} className="summary-promo-form">
                <div className="form-underlined-group" style={{ flexGrow: 1, borderBottomColor: 'rgba(255,255,255,0.1)' }}>
                  <input 
                    type="text" 
                    placeholder="Enter code (ALI66)" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    style={{ padding: '6px 0', fontSize: '13px', color: '#fff', width: '100%', textTransform: 'uppercase' }}
                  />
                </div>
                <button type="submit" className="btn-gold" style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '12px' }}>
                  Apply
                </button>
              </form>
            </div>

            <div className="divider-line-sub" />

            {/* Price Calculations */}
            <div className="summary-section">
              <h4 className="summary-section-title">Order Summary</h4>
              
              <div className="summary-price-row">
                <span className="summary-price-label">Subtotal ({cart.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                <span className="summary-price-value">${subtotal.toLocaleString()}</span>
              </div>

              <div className="summary-price-row">
                <span className="summary-price-label">Shipping Fee</span>
                <span className="summary-price-value">
                  {shippingFee === 0 ? <strong style={{ color: '#34d399' }}>FREE</strong> : `$${shippingFee}`}
                </span>
              </div>

              {discount > 0 && (
                <div className="summary-price-row">
                  <span className="summary-price-label">Promo Discount ({discount}%)</span>
                  <span className="summary-price-value" style={{ color: '#f87171' }}>-${discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="divider-line-sub" style={{ margin: '12px 0' }} />

              <div className="summary-price-row total">
                <span className="summary-price-label-total">Total Amount</span>
                <span className="summary-price-value-total">${orderTotal.toLocaleString()}</span>
              </div>
            </div>

            <button onClick={handleCheckout} className="btn-gold checkout-submit-btn">
              Proceed to Checkout (${orderTotal.toLocaleString()})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
