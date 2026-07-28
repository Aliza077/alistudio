import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  PackageSearch, KeyRound, Wallet, XCircle, RotateCcw,
  CreditCard, MapPinned, UserRound, Search, HelpCircle
} from 'lucide-react';
import SiteNavbar from '../components/SiteNavbar';
import SiteFooter from '../components/SiteFooter';
import { useAuth } from '../context/AuthContext';

const TOOLS = [
  { id: 'track', label: 'Track My Order', icon: PackageSearch, desc: 'Enter your tracking ID to see order status.' },
  { id: 'reset', label: 'Reset Password', icon: KeyRound, desc: 'Reset your account password via email code.', link: '/login' },
  { id: 'wallet', label: 'Ali Studio Wallet', icon: Wallet, desc: 'View wallet-friendly payment options at checkout.' },
  { id: 'cancel', label: 'Cancel My Order', icon: XCircle, desc: 'Request cancellation for a recent order.' },
  { id: 'return', label: 'Return My Order', icon: RotateCcw, desc: 'Start a 14-day easy return request.' },
  { id: 'payment', label: 'My Payment Options', icon: CreditCard, desc: 'COD, EasyPaisa, JazzCash, NayaPay, SadaPay, Bank Card.' },
  { id: 'address', label: 'Change Delivery Address', icon: MapPinned, desc: 'Update shipping location on your cart.', link: '/cart' },
  { id: 'profile', label: 'My Profile', icon: UserRound, desc: 'Review your account details and favourites.' },
];

export default function HelpCenter() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [activeTool, setActiveTool] = useState(params.get('tool') || '');
  const [trackingId, setTrackingId] = useState('');
  const [orderResult, setOrderResult] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    const tool = params.get('tool');
    if (tool) setActiveTool(tool);
  }, [params]);

  const filteredTools = TOOLS.filter((t) =>
    t.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTrack = async (e) => {
    e.preventDefault();
    setError('');
    setOrderResult(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(trackingId.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Order not found');
      setOrderResult(data.data);
      setMessage('Order found.');
    } catch (err) {
      setError(err.message || 'Could not track order.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrReturn = async (type) => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch('/api/orders/help-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          type,
          trackingId: trackingId.trim(),
          email: user?.email || '',
          name: user?.username || '',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Request failed');
      setMessage(data.message || 'Request submitted to admin.');
    } catch (err) {
      setError(err.message || 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  const openTool = (tool) => {
    if (tool.link) {
      if (tool.id === 'reset') {
        navigate('/login', { state: { openForgot: true } });
        return;
      }
      navigate(tool.link);
      return;
    }
    setActiveTool(tool.id);
    setMessage('');
    setError('');
    setOrderResult(null);
  };

  return (
    <div className="help-center-page">
      <SiteNavbar variant="overlay" />
      <main className="help-center-main">
        <div className="help-center-hero">
          <div className="help-center-hero-inner">
            <h1><HelpCircle size={28} /> Help Center</h1>
            <p>Hi, how can we help?</p>
            <form className="help-search-row" onSubmit={(e) => e.preventDefault()}>
              <Search size={16} />
              <input
                type="text"
                placeholder="Search for topics, questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
        </div>

        <section className="help-tools-section">
          <h2>Self Service Tool</h2>
          <div className="help-tools-grid">
            {filteredTools.map((tool) => (
              <button
                key={tool.id}
                type="button"
                className={`help-tool-card ${activeTool === tool.id ? 'active' : ''}`}
                onClick={() => openTool(tool)}
              >
                <tool.icon size={28} />
                <span>{tool.label}</span>
              </button>
            ))}
          </div>
        </section>

        {activeTool && (
          <section className="help-tool-panel glass">
            <h3>{TOOLS.find((t) => t.id === activeTool)?.label}</h3>
            <p>{TOOLS.find((t) => t.id === activeTool)?.desc}</p>
            {error && <div className="form-error-msg">{error}</div>}
            {message && <div className="form-success-msg">{message}</div>}

            {(activeTool === 'track' || activeTool === 'cancel' || activeTool === 'return') && (
              <form onSubmit={activeTool === 'track' ? handleTrack : (e) => { e.preventDefault(); handleCancelOrReturn(activeTool); }} className="help-action-form">
                <input
                  type="text"
                  placeholder="Tracking ID / Order ID"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  required
                />
                <button type="submit" className="btn-gold" disabled={loading}>
                  {loading ? 'Please wait...' : activeTool === 'track' ? 'Track Order' : 'Submit Request'}
                </button>
              </form>
            )}

            {orderResult && (
              <div className="help-order-result">
                <p><strong>Status:</strong> {orderResult.status || 'Processing'}</p>
                <p><strong>Tracking:</strong> {orderResult.trackingId || trackingId}</p>
                <p><strong>Total:</strong> ${orderResult.total || orderResult.orderTotal || '—'}</p>
              </div>
            )}

            {activeTool === 'wallet' && (
              <p>Use EasyPaisa, JazzCash, NayaPay or SadaPay during checkout on the cart page.</p>
            )}
            {activeTool === 'payment' && (
              <ul className="help-payment-list">
                <li>Cash on Delivery</li>
                <li>EasyPaisa / JazzCash / NayaPay / SadaPay</li>
                <li>Bank Card (Visa / Mastercard)</li>
              </ul>
            )}
            {activeTool === 'profile' && (
              user ? (
                <div className="help-order-result">
                  <p><strong>Name:</strong> {user.username}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><Link to="/favourites">View Favourites</Link> · <Link to="/cart">Open Cart</Link></p>
                </div>
              ) : (
                <p><Link to="/login">Sign in</Link> to view your profile.</p>
              )
            )}
          </section>
        )}
      </main>
      <SiteFooter compact />
    </div>
  );
}
