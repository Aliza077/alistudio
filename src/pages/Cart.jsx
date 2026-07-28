import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SiteNavbar from '../components/SiteNavbar';
import SiteFooter from '../components/SiteFooter';
import {
  Trash2, ShoppingBag, Plus, Minus,
  MapPin, ShieldCheck, Navigation, Search, ExternalLink, X,
  Truck, RotateCcw, ShieldAlert
} from 'lucide-react';

const LOCATION_STORAGE_KEY = 'ali_shipping_location';

const DEFAULT_LOCATION = {
  address: 'Block 15, Gulshan-e-Iqbal, Karachi',
  lat: 24.9236,
  lng: 67.0889,
};

async function reverseGeocode(lat, lng) {
  const res = await fetch(`/api/geocode/reverse?lat=${lat}&lon=${lng}`);
  if (!res.ok) throw new Error('Could not resolve address');
  const data = await res.json();
  if (!data.success || !data.address) throw new Error('Could not resolve address');
  return data.address;
}

async function searchAddress(query) {
  const res = await fetch(`/api/geocode/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Search failed');
  const data = await res.json();
  return data.data || null;
}

function getGoogleMapsEmbedUrl(lat, lng) {
  return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
}

function getGoogleMapsLink(lat, lng, address) {
  const query = address ? encodeURIComponent(address) : `${lat},${lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function itemPrice(item) {
  return typeof item.price === 'number'
    ? item.price
    : parseInt(String(item.price).replace(/[^0-9]/g, ''), 10) || 0;
}

export default function Cart() {
  const { user, token, cart, updateCartQuantity, removeFromCart, clearCart } = useAuth();

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [locationQuery, setLocationQuery] = useState('');
  const [manualAddress, setManualAddress] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [walletNumber, setWalletNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  const PAYMENT_METHODS = [
    { id: 'cod', label: 'Cash on Delivery' },
    { id: 'easypaisa', label: 'EasyPaisa' },
    { id: 'jazzcash', label: 'JazzCash' },
    { id: 'nayapay', label: 'NayaPay' },
    { id: 'sadapay', label: 'SadaPay' },
    { id: 'card', label: 'Card' },
  ];
  const isWallet = ['easypaisa', 'jazzcash', 'nayapay', 'sadapay'].includes(paymentMethod);
  const isCard = paymentMethod === 'card';
  const isCod = paymentMethod === 'cod';

  useEffect(() => {
    window.scrollTo(0, 0);
    try {
      const saved = localStorage.getItem(LOCATION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setLocation(parsed);
        setManualAddress(parsed.address || '');
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const ids = cart.map((i) => i.cartItemId);
    setSelectedIds((prev) => {
      const stillHere = prev.filter((id) => ids.includes(id));
      if (stillHere.length) return stillHere;
      return ids;
    });
  }, [cart]);

  const saveLocation = (nextLocation) => {
    setLocation(nextLocation);
    setManualAddress(nextLocation.address || '');
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(nextLocation));
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported. Enter your address manually below.');
      return;
    }

    setLocationLoading(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          let address;
          try {
            address = await reverseGeocode(latitude, longitude);
          } catch {
            address = `Near ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          }
          saveLocation({ address, lat: latitude, lng: longitude });
          setLocationError('');
        } catch {
          setLocationError('Could not fetch address. Type your location manually.');
        } finally {
          setLocationLoading(false);
        }
      },
      (err) => {
        const msg =
          err.code === 1
            ? 'Location permission denied. Type your address manually below.'
            : 'Could not get GPS location. Type your address manually.';
        setLocationError(msg);
        setLocationLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
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
        setLocationError('No location found. Try a different address or save manually.');
        return;
      }
      saveLocation(result);
      setLocationQuery('');
    } catch {
      setLocationError('Search failed. You can still save a manual address below.');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSaveManualAddress = (e) => {
    e.preventDefault();
    const address = manualAddress.trim();
    if (!address) {
      setLocationError('Please type an address first.');
      return;
    }
    saveLocation({
      address,
      lat: location.lat || DEFAULT_LOCATION.lat,
      lng: location.lng || DEFAULT_LOCATION.lng,
    });
    setLocationError('');
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'ALI66') {
      setDiscount(20);
      alert('Promo code applied! 20% discount.');
    } else {
      alert('Invalid promo code. Try "ALI66".');
    }
  };

  const selectedItems = useMemo(
    () => cart.filter((item) => selectedIds.includes(item.cartItemId)),
    [cart, selectedIds]
  );

  const allSelected = cart.length > 0 && selectedIds.length === cart.length;

  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds([]);
    else setSelectedIds(cart.map((i) => i.cartItemId));
  };

  const toggleItem = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const subtotal = selectedItems.reduce((acc, item) => acc + itemPrice(item) * item.quantity, 0);
  const shippingFee = subtotal > 1000 || subtotal === 0 ? 0 : 60;
  const discountAmount = Math.floor(subtotal * (discount / 100));
  const orderTotal = Math.max(0, subtotal + shippingFee - discountAmount);
  const selectedQty = selectedItems.reduce((acc, item) => acc + item.quantity, 0);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to complete checkout.');
      return;
    }
    if (!selectedItems.length) {
      setCheckoutError('Select at least one product to order.');
      return;
    }
    setCheckoutLoading(true);
    setCheckoutError('');

    const formattedItems = selectedItems.map((item) => ({
      productId: item.productId,
      title: item.title,
      price: itemPrice(item),
      quantity: item.quantity,
      image: item.image,
    }));

    try {
      const res = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || localStorage.getItem('ali_token')}`,
        },
        body: JSON.stringify({
          items: formattedItems,
          totalAmount: orderTotal,
          shippingAddress: location.address,
          email: user.email,
          paymentMethod, // cod | card | easypaisa | jazzcash | nayapay | sadapay
          walletNumber: isWallet ? walletNumber : '',
          cardHolder: isCard ? (cardName || user.username || '') : '',
          cardNumberLast4: isCard
            ? cardNumber.replace(/\s/g, '').slice(-4)
            : isWallet
              ? walletNumber.slice(-4)
              : '',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setTrackingId(data.data.trackingId);
        setCheckoutSuccess(true);
        selectedItems.forEach((item) => removeFromCart(item.cartItemId));
        if (selectedItems.length === cart.length) clearCart();
        setShowPaymentModal(false);
      } else {
        setCheckoutError(data.message || 'Payment failed.');
      }
    } catch {
      setCheckoutError('Network error while processing checkout payment.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="cart-page-root">
      <SiteNavbar variant="overlay" />

      {checkoutSuccess ? (
        <div className="checkout-success-panel glass" style={{ textAlign: 'center', padding: '60px 24px', margin: '40px auto', maxWidth: '600px', borderRadius: '24px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(52, 211, 153, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <ShieldCheck size={40} color="#34d399" />
          </div>
          <h2 className="font-serif" style={{ color: '#fff', fontSize: '28px', marginBottom: '16px' }}>Order Placed Successfully!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Thank you for shopping with Ali Studio.</p>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', display: 'inline-block', marginBottom: '32px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'block' }}>Tracking ID</span>
            <strong style={{ color: 'var(--accent-gold)', fontSize: '18px' }}>{trackingId}</strong>
          </div>
          <div>
            <Link to="/" className="btn-gold" style={{ padding: '12px 32px', display: 'inline-block', borderRadius: '10px' }}>Back to Catalog</Link>
          </div>
        </div>
      ) : cart.length === 0 ? (
        <div className="cart-empty-panel glass" style={{ textAlign: 'center', padding: '80px 24px', margin: '40px auto', maxWidth: '500px', borderRadius: '24px' }}>
          <ShoppingBag size={48} style={{ color: 'var(--text-muted)', marginBottom: '20px' }} />
          <h2 className="font-serif" style={{ color: '#fff', marginBottom: '12px' }}>Your Cart is Empty</h2>
          <Link to="/" className="btn-gold" style={{ padding: '12px 28px', display: 'inline-block', borderRadius: '10px' }}>Explore Furniture</Link>
        </div>
      ) : (
        <div className="cart-container-grid">
          <div className="cart-items-col glass">
            <div className="cart-header-line" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <label className="cart-select-all" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} />
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Select All</span>
              </label>
              <h1 className="cart-title font-serif" style={{ margin: 0 }}>
                Shopping Cart ({cart.length} items)
              </h1>
            </div>

            <div className="cart-items-list">
              {cart.map((item) => {
                const itemSubtotal = itemPrice(item) * item.quantity;
                const checked = selectedIds.includes(item.cartItemId);
                return (
                  <div key={item.cartItemId} className="cart-item-row">
                    <div className="cart-item-img-frame">
                      <img src={item.image} alt={item.title} className="cart-item-img" loading="lazy" />
                    </div>
                    <div className="cart-item-info-block">
                      <h4 className="cart-item-title">{item.title}</h4>
                      <div className="cart-item-variants-line">
                        {item.selectedColor && <span className="variant-tag">Color: {item.selectedColor}</span>}
                        {item.selectedSize && <span className="variant-tag">Size: {item.selectedSize}</span>}
                      </div>
                      <span className="cart-item-price-unit">Price: ${itemPrice(item)}</span>
                    </div>
                    <div className="cart-qty-selectors">
                      <button type="button" onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)} className="qty-btn-circle"><Minus size={12} /></button>
                      <span className="qty-label-value">{item.quantity}</span>
                      <button type="button" onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)} className="qty-btn-circle"><Plus size={12} /></button>
                    </div>
                    <div className="cart-item-subtotal-block" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="cart-item-subtotal-val">${itemSubtotal.toLocaleString()}</span>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleItem(item.cartItemId)}
                        title="Select to buy"
                        aria-label={`Select ${item.title}`}
                      />
                      <button type="button" onClick={() => removeFromCart(item.cartItemId)} className="cart-item-delete-btn" aria-label="Remove item">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="cart-summary-col glass">
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

              <button type="button" className="cart-location-btn" onClick={handleUseCurrentLocation} disabled={locationLoading}>
                <Navigation size={14} />
                {locationLoading ? 'Locating...' : 'Use My Current Location'}
              </button>

              <form onSubmit={handleSaveManualAddress} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Or type address manually</label>
                <textarea
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  placeholder="House / street / city / area..."
                  rows={2}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: '#fff',
                    padding: '10px',
                    fontSize: '13px',
                    resize: 'vertical',
                  }}
                />
                <button type="submit" className="btn-gold" style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '12px' }}>
                  Save Address
                </button>
              </form>

              {locationError && <p className="cart-location-status error">{locationError}</p>}

              <div className="summary-address-row">
                <MapPin size={18} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
                <p className="summary-address-text">{location.address}</p>
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
              <a href={getGoogleMapsLink(location.lat, location.lng, location.address)} target="_blank" rel="noopener noreferrer" className="cart-location-open-link">
                <ExternalLink size={14} /> Open in Google Maps
              </a>
            </div>

            <div className="divider-line-sub" />

            <div className="summary-section delivery-card-section">
              <h4 className="summary-section-title">Delivery Options</h4>
              <div className="delivery-info-item">
                <Truck size={16} className="delivery-icon" />
                <div className="delivery-text-group">
                  <span className="delivery-header-lbl">Standard Delivery</span>
                  <span className="delivery-sub-lbl">3–5 business days</span>
                </div>
                <span className="delivery-cost-badge free">FREE</span>
              </div>
              <div className="delivery-info-item">
                <Truck size={16} className="delivery-icon" />
                <div className="delivery-text-group">
                  <span className="delivery-header-lbl">Collection Point</span>
                  <span className="delivery-sub-lbl">Pick up from studio</span>
                </div>
                <span className="delivery-cost-badge">Rs. 60</span>
              </div>
              <div className="delivery-info-item">
                <ShieldCheck size={16} className="delivery-icon" />
                <div className="delivery-text-group">
                  <span className="delivery-header-lbl">Cash on Delivery Available</span>
                </div>
              </div>
              <div className="delivery-info-item">
                <RotateCcw size={16} className="delivery-icon" />
                <div className="delivery-text-group">
                  <span className="delivery-header-lbl">14 Days Easy Return</span>
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
                <button type="submit" className="btn-gold" style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '12px' }}>Apply</button>
              </form>
            </div>

            <div className="divider-line-sub" />

            <div className="summary-section">
              <h4 className="summary-section-title">Order Summary</h4>
              <div className="summary-price-row">
                <span className="summary-price-label">Subtotal ({selectedQty} selected)</span>
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
                  <span className="summary-price-label">Promo ({discount}%)</span>
                  <span className="summary-price-value" style={{ color: '#f87171' }}>-${discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="divider-line-sub" style={{ margin: '12px 0' }} />
              <div className="summary-price-row total">
                <span className="summary-price-label-total">Total Amount</span>
                <span className="summary-price-value-total">${orderTotal.toLocaleString()}</span>
              </div>
            </div>

            {user ? (
              <button
                type="button"
                onClick={() => {
                  if (!selectedItems.length) {
                    alert('Select at least one product to buy.');
                    return;
                  }
                  setShowPaymentModal(true);
                }}
                className="btn-gold checkout-submit-btn"
              >
                Proceed to Checkout (${orderTotal.toLocaleString()})
              </button>
            ) : (
              <Link to="/login" className="btn-gold checkout-submit-btn" style={{ display: 'block', textAlign: 'center' }}>
                Login to Checkout
              </Link>
            )}
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="widget-modal-overlay" onClick={() => setShowPaymentModal(false)} role="presentation">
          <div className="widget-modal glass" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="widget-modal-header">
              <h3>Choose Payment Method</h3>
              <button onClick={() => setShowPaymentModal(false)} type="button" className="widget-modal-close"><X size={18} /></button>
            </div>
            <div className="widget-modal-body">
              {checkoutError && <div className="form-error-msg" style={{ marginBottom: '16px' }}>{checkoutError}</div>}
              <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`size-btn glass ${paymentMethod === method.id ? 'active' : ''}`}
                      style={{ fontSize: '12px', padding: '10px 8px' }}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
                {isWallet && (
                  <input
                    type="text"
                    placeholder={`${PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label || 'Wallet'} mobile number`}
                    value={walletNumber}
                    onChange={(e) => setWalletNumber(e.target.value)}
                    required
                    style={{ color: '#fff', fontSize: '13px', width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  />
                )}
                {isCard && (
                  <>
                    <input type="text" placeholder="Cardholder Name" value={cardName} onChange={(e) => setCardName(e.target.value)} required style={{ color: '#fff', fontSize: '13px', width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                    <input type="text" placeholder="Card Number" maxLength="19" value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim())} required style={{ color: '#fff', fontSize: '13px', width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <input type="text" placeholder="MM/YY" maxLength="5" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value.replace(/\D/g, '').replace(/(\d{2})/g, '$1/').replace(/\/$/, '').slice(0, 5))} required style={{ flex: 1, color: '#fff', fontSize: '13px', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                      <input type="password" placeholder="CVV" maxLength="3" value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))} required style={{ flex: 1, color: '#fff', fontSize: '13px', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                    </div>
                  </>
                )}
                {isCod && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: 0 }}>
                    Cash on Delivery — status will be Pending until payment is collected.
                  </p>
                )}
                <button type="submit" className="btn-gold" style={{ width: '100%', padding: '12px 0', borderRadius: '10px' }} disabled={checkoutLoading}>
                  {checkoutLoading ? 'Processing...' : `Place Order $${orderTotal.toLocaleString()}`}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <SiteFooter compact />
    </div>
  );
}
