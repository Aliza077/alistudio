import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StudioPageLayout from '../components/StudioPageLayout';
import {
  User, Shield, ShoppingBag, Settings, Lock, MapPin, CreditCard,
  Mail, Users, HelpCircle, ChevronRight, Check, Trash2, Calendar,
  AlertTriangle, Upload, Eye, EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MyAccount() {
  const { user, token, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Overview edit states
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Male');
  const [avatar, setAvatar] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [overviewMsg, setOverviewMsg] = useState({ type: '', text: '' });
  const [overviewLoading, setOverviewLoading] = useState(false);

  // Change password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passMsg, setPassMsg] = useState({ type: '', text: '' });
  const [passLoading, setPassLoading] = useState(false);

  // Orders states
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Payment methods states (Mock matching Pic 1)
  const [paymentCards, setPaymentCards] = useState([
    {
      id: '1',
      type: 'VISA Debit',
      last4: '9332',
      exp: '08/29',
      name: user?.name || 'John Newman',
      isDefault: true,
      expired: false
    },
    {
      id: '2',
      type: 'VISA Debit',
      last4: '3207',
      exp: '06/24',
      name: user?.name || 'John Newman',
      isDefault: false,
      expired: true
    }
  ]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardData, setNewCardData] = useState({ number: '', exp: '', name: '' });

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setName(user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username || '');
      setUsername(user.username || '');
      setPhone(user.phone || '');
      setGender(user.gender || 'Male');
      setAvatar(user.avatar || '');
      setAvatarPreview(user.avatar || '');
    }
  }, [user]);

  // Fetch orders from API
  useEffect(() => {
    if (activeTab === 'orders' && token) {
      setOrdersLoading(true);
      fetch('/api/orders/my', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success' || data.success) {
            setOrders(data.data || []);
          }
        })
        .catch(err => console.error('Fetch orders error:', err))
        .finally(() => setOrdersLoading(false));
    }
  }, [activeTab, token]);

  if (!user) {
    return <Navigate to="/login" replace state={{ from: '/account' }} />;
  }

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit profile changes
  const handleOverviewSubmit = async (e) => {
    e.preventDefault();
    setOverviewMsg({ type: '', text: '' });
    setOverviewLoading(true);

    const result = await updateProfile({
      name,
      username,
      phone,
      gender,
      image: avatar
    });

    setOverviewLoading(false);
    if (result.success) {
      setOverviewMsg({ type: 'success', text: 'Account details updated successfully.' });
    } else {
      setOverviewMsg({ type: 'error', text: result.message || 'Failed to update details.' });
    }
  };

  // Submit password change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassMsg({ type: '', text: '' });

    if (newPassword !== confirmPassword) {
      setPassMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setPassMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    setPassLoading(true);
    try {
      const res = await fetch('/api/user/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      setPassLoading(false);

      if (res.ok) {
        setPassMsg({ type: 'success', text: 'Password updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPassMsg({ type: 'error', text: data.message || 'Failed to update password.' });
      }
    } catch (err) {
      setPassLoading(false);
      setPassMsg({ type: 'error', text: 'Network error. Please try again.' });
    }
  };

  // Add mock payment card
  const handleAddCardSubmit = (e) => {
    e.preventDefault();
    if (!newCardData.number || !newCardData.exp || !newCardData.name) return;

    const last4 = newCardData.number.slice(-4) || '9999';
    const newCard = {
      id: Date.now().toString(),
      type: 'VISA Debit',
      last4,
      exp: newCardData.exp,
      name: newCardData.name,
      isDefault: paymentCards.length === 0,
      expired: false
    };

    setPaymentCards([...paymentCards, newCard]);
    setNewCardData({ number: '', exp: '', name: '' });
    setShowAddCard(false);
  };

  // Delete payment card
  const handleDeleteCard = (cardId) => {
    setPaymentCards(paymentCards.filter(c => c.id !== cardId));
  };

  // Sidebar item list
  const sidebarItems = [
    { id: 'overview', label: 'Account overview', icon: User },
    { id: 'orders', label: 'My orders', icon: ShoppingBag },
    { id: 'premier', label: 'Premier Delivery', icon: Shield },
    { id: 'details', label: 'My details', icon: Settings },
    { id: 'password', label: 'Change password', icon: Lock },
    { id: 'address', label: 'Address book', icon: MapPin },
    { id: 'payment', label: 'Payment methods', icon: CreditCard },
    { id: 'preferences', label: 'Contact preferences', icon: Mail },
    { id: 'socials', label: 'Social accounts', icon: Users },
    { id: 'giftcards', label: 'Gift cards & vouchers', icon: CreditCard },
  ];

  const infoLinks = [
    { label: 'Need help?', to: '/help-center', icon: HelpCircle },
    { label: "Where's my order?", to: '/help-center', icon: HelpCircle },
    { label: 'How do I make a return?', to: '/help-center', icon: HelpCircle },
    { label: 'I need a new returns note', to: '/help-center', icon: HelpCircle }
  ];

  return (
    <StudioPageLayout maxWidth="1100px">
      <div className="myaccount-layout-container" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '32px', margin: '40px auto 80px' }}>
        
        {/* Left Sidebar */}
        <aside className="myaccount-sidebar-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* User Badge */}
          <div className="myaccount-user-card glass" style={{ padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="myaccount-avatar-circle" style={{ width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)', flexShrink: 0 }}>
              {user.avatar ? (
                <img src={user.avatar} alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--accent-gold)' }}>
                  {user.username?.slice(0, 2).toUpperCase() || 'US'}
                </span>
              )}
            </div>
            <div style={{ minWidth: 0 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>Hi,</span>
              <strong style={{ color: '#fff', fontSize: '16px', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username}
              </strong>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="myaccount-nav-list glass" style={{ borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {sidebarItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 20px',
                    width: '100%',
                    background: isActive ? 'rgba(175, 133, 80, 0.08)' : 'none',
                    border: 'none',
                    borderLeft: isActive ? '3px solid var(--accent-gold)' : '3px solid transparent',
                    color: isActive ? 'var(--accent-gold)' : 'var(--text-primary)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: isActive ? '600' : '400',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Icon size={16} style={{ color: isActive ? 'var(--accent-gold)' : 'var(--text-muted)' }} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  <ChevronRight size={14} style={{ opacity: isActive ? 1 : 0.3 }} />
                </button>
              );
            })}
          </nav>

          {/* Info Links */}
          <div className="myaccount-nav-list glass" style={{ borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {infoLinks.map((link, idx) => (
              <Link
                key={idx}
                to={link.to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 20px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  borderBottom: idx < infoLinks.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <link.icon size={15} style={{ color: 'var(--text-muted)' }} />
                <span style={{ flex: 1 }}>{link.label}</span>
                <ChevronRight size={14} style={{ opacity: 0.3 }} />
              </Link>
            ))}
          </div>

          {/* Sign Out Button */}
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="btn-outline"
            style={{
              padding: '14px',
              borderRadius: '12px',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px'
            }}
          >
            Sign out
          </button>
        </aside>

        {/* Right Content Panel */}
        <main className="myaccount-content-panel glass" style={{ padding: '32px', borderRadius: '16px', minHeight: '500px' }}>
          
          {/* Tab: Overview / Profile Edit */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="font-serif" style={{ color: '#fff', fontSize: '24px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                Account Overview
              </h2>

              {overviewMsg.text && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  fontSize: '13px',
                  backgroundColor: overviewMsg.type === 'success' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: overviewMsg.type === 'success' ? '#34d399' : '#ef4444',
                  border: `1px solid ${overviewMsg.type === 'success' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                }}>
                  {overviewMsg.text}
                </div>
              )}

              <form onSubmit={handleOverviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Profile Pic Upload */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '10px' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)', position: 'relative' }}>
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <User size={32} style={{ color: 'rgba(255,255,255,0.2)' }} />
                    )}
                  </div>
                  <div>
                    <label className="btn-outline" style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Upload size={14} /> Upload Picture
                      <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
                    </label>
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                      Recommended: Square JPG or PNG, max 1MB.
                    </span>
                  </div>
                </div>

                {/* Input Fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-underlined-group" style={{ margin: 0 }}>
                    <label style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Full Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '8px 0', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                  </div>
                  <div className="form-underlined-group" style={{ margin: 0 }}>
                    <label style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Username</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: '8px 0', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-underlined-group" style={{ margin: 0 }}>
                    <label style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Email Address (read-only)</label>
                    <input type="email" value={user.email} disabled style={{ width: '100%', padding: '8px 0', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-muted)', cursor: 'not-allowed' }} />
                  </div>
                  <div className="form-underlined-group" style={{ margin: 0 }}>
                    <label style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Phone Number</label>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', padding: '8px 0', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                  </div>
                </div>

                <div className="form-underlined-group" style={{ width: '50%', margin: 0 }}>
                  <label style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Gender</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value)} style={{ width: '100%', padding: '8px 0', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none', cursor: 'pointer' }}>
                    <option value="Male" style={{ background: '#1c1c1e' }}>Male</option>
                    <option value="Female" style={{ background: '#1c1c1e' }}>Female</option>
                    <option value="Other" style={{ background: '#1c1c1e' }}>Other</option>
                  </select>
                </div>

                <button type="submit" className="btn-gold" style={{ padding: '12px 32px', borderRadius: '10px', marginTop: '12px', alignSelf: 'flex-start' }} disabled={overviewLoading}>
                  {overviewLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </motion.div>
          )}

          {/* Tab: Orders */}
          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="font-serif" style={{ color: '#fff', fontSize: '24px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                My Orders
              </h2>

              {ordersLoading ? (
                <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>Loading your orders...</div>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-muted)' }}>
                  <ShoppingBag size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                  <p>You haven't placed any orders yet.</p>
                  <Link to="/" className="btn-gold" style={{ display: 'inline-block', padding: '10px 24px', borderRadius: '10px', marginTop: '16px' }}>Shop Now</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {orders.map(order => (
                    <div key={order._id} className="glass" style={{ padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Order Tracking ID</span>
                          <strong style={{ color: 'var(--accent-gold)', fontSize: '14px' }}>{order.trackingId}</strong>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Date</span>
                          <span style={{ color: '#fff', fontSize: '13px' }}>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px', paddingBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        {order.items?.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                            <span style={{ color: '#fff' }}>
                              {item.product?.title || 'Premium Furniture'} <span style={{ color: 'var(--text-muted)' }}>x {item.quantity}</span>
                            </span>
                            <span style={{ color: 'var(--text-secondary)' }}>${(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <div>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Payment Method</span>
                            <span style={{ color: '#fff', fontSize: '12px' }}>{order.paymentMethod}</span>
                          </div>
                          <div>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Status</span>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: '600',
                              color: order.paymentStatus === 'Paid' ? '#34d399' : '#af8550'
                            }}>{order.paymentStatus}</span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Total</span>
                          <strong style={{ color: 'var(--accent-gold)', fontSize: '16px' }}>${order.totalPrice?.toLocaleString()}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Tab: Change Password */}
          {activeTab === 'password' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="font-serif" style={{ color: '#fff', fontSize: '24px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                Change Password
              </h2>

              {passMsg.text && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  fontSize: '13px',
                  backgroundColor: passMsg.type === 'success' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: passMsg.type === 'success' ? '#34d399' : '#ef4444',
                  border: `1px solid ${passMsg.type === 'success' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                }}>
                  {passMsg.text}
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '450px' }}>
                
                <div className="form-underlined-group" style={{ margin: 0, position: 'relative' }}>
                  <label style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Current Password</label>
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px 0', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#fff', paddingRight: '30px' }}
                  />
                  <button type="button" onClick={() => setShowCurrentPass(!showCurrentPass)} style={{ position: 'absolute', right: 0, bottom: '8px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div className="form-underlined-group" style={{ margin: 0, position: 'relative' }}>
                  <label style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'block', marginBottom: '4px' }}>New Password</label>
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px 0', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#fff', paddingRight: '30px' }}
                  />
                  <button type="button" onClick={() => setShowNewPass(!showNewPass)} style={{ position: 'absolute', right: 0, bottom: '8px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div className="form-underlined-group" style={{ margin: 0, position: 'relative' }}>
                  <label style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Confirm New Password</label>
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px 0', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#fff', paddingRight: '30px' }}
                  />
                  <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} style={{ position: 'absolute', right: 0, bottom: '8px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <button type="submit" className="btn-gold" style={{ padding: '12px 32px', borderRadius: '10px', marginTop: '12px', alignSelf: 'flex-start' }} disabled={passLoading}>
                  {passLoading ? 'Saving...' : 'Update Password'}
                </button>
              </form>
            </motion.div>
          )}

          {/* Tab: Payment methods (Pic 1 design) */}
          {activeTab === 'payment' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
                <h2 className="font-serif" style={{ color: '#fff', fontSize: '24px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={22} style={{ color: 'var(--accent-gold)' }} /> PAYMENT METHODS
                </h2>
                <button
                  onClick={() => setShowAddCard(!showAddCard)}
                  className="btn-outline"
                  style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}
                >
                  {showAddCard ? 'Cancel' : 'ADD NEW PAYMENT METHOD'}
                </button>
              </div>

              {/* Add Mock Card Form */}
              {showAddCard && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  onSubmit={handleAddCardSubmit}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    marginBottom: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}
                >
                  <div className="form-underlined-group" style={{ margin: 0 }}>
                    <label style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 1234 5678"
                      value={newCardData.number}
                      onChange={(e) => setNewCardData({ ...newCardData, number: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                      required
                      style={{ width: '100%', padding: '6px 0', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-underlined-group" style={{ margin: 0 }}>
                      <label style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={newCardData.exp}
                        onChange={(e) => setNewCardData({ ...newCardData, exp: e.target.value.slice(0, 5) })}
                        required
                        style={{ width: '100%', padding: '6px 0', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                      />
                    </div>
                    <div className="form-underlined-group" style={{ margin: 0 }}>
                      <label style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Name on Card</label>
                      <input
                        type="text"
                        placeholder="John Newman"
                        value={newCardData.name}
                        onChange={(e) => setNewCardData({ ...newCardData, name: e.target.value })}
                        required
                        style={{ width: '100%', padding: '6px 0', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn-gold" style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '12px', alignSelf: 'flex-start' }}>
                    Save Method
                  </button>
                </motion.form>
              )}

              {/* Cards List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {paymentCards.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                    No payment methods saved.
                  </div>
                ) : (
                  paymentCards.map(card => (
                    <div
                      key={card.id}
                      style={{
                        background: 'rgba(255,255,255,0.015)',
                        border: '1px solid rgba(255,255,255,0.04)',
                        borderRadius: '12px',
                        overflow: 'hidden'
                      }}
                    >
                      <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                          {/* VISA Chip */}
                          <div style={{ background: 'rgba(255,255,255,0.04)', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', color: 'var(--accent-gold)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            {card.type.split(' ')[0]}
                          </div>
                          <div>
                            <strong style={{ color: '#fff', fontSize: '15px', display: 'block' }}>
                              {card.type} (•••• {card.last4})
                            </strong>
                            <span style={{ color: card.expired ? '#ef4444' : 'var(--text-muted)', fontSize: '13px', display: 'block', margin: '4px 0' }}>
                              Exp: {card.exp}
                            </span>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '13px', display: 'block' }}>
                              {card.name}
                            </span>
                            {card.isDefault && (
                              <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '12px', marginTop: '12px', fontStyle: 'italic' }}>
                                This is your default payment method
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteCard(card.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'rgba(255,255,255,0.3)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            transition: 'color 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
                        >
                          <Trash2 size={14} /> DELETE
                        </button>
                      </div>

                      {/* Expiry Banner warning matching Pic 1 */}
                      {card.expired && (
                        <div style={{
                          backgroundColor: 'rgba(175, 133, 80, 0.1)',
                          borderTop: '1px solid rgba(175, 133, 80, 0.15)',
                          padding: '12px 24px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: 'var(--accent-gold)',
                          fontSize: '12px'
                        }}>
                          <AlertTriangle size={14} />
                          <span>This card has expired.</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* Tab: Mock Layouts (Premier, Details, Address, Preferences, Socials, Giftcards) */}
          {['premier', 'details', 'address', 'preferences', 'socials', 'giftcards'].includes(activeTab) && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="font-serif" style={{ color: '#fff', fontSize: '24px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', textTransform: 'capitalize' }}>
                {activeTab.replace('premier', 'Premier Delivery').replace('giftcards', 'Gift Cards & Vouchers').replace('socials', 'Social Accounts').replace('preferences', 'Contact Preferences')}
              </h2>

              <div style={{ padding: '40px 20px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '12px', background: 'rgba(255,255,255,0.01)' }}>
                <Settings size={40} style={{ color: 'var(--accent-gold)', opacity: 0.5, marginBottom: '16px' }} />
                <h4 style={{ color: '#fff', marginBottom: '8px', fontSize: '15px' }}>Premium Service Mock Feature</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', maxWidth: '400px', margin: '0 auto' }}>
                  This panel matches the ASOS-inspired layout. All actions here are simulated. Feel free to explore other account parameters!
                </p>
              </div>
            </motion.div>
          )}

        </main>
      </div>
    </StudioPageLayout>
  );
}
