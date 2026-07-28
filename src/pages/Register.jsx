import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sendWelcomeEmail } from '../utils/emailService';
import SiteNavbar from '../components/SiteNavbar';
import { User, Mail, Lock, ChevronDown, Check, Phone } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    gender: 'Male',
    password: '',
    confirmPassword: '',
    avatar: null,
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    const result = await register(formData);
    setSubmitting(false);

    if (result.success) {
      sendWelcomeEmail({
        firstName: formData.firstName,
        email: formData.email,
      }).catch(() => {
        /* welcome email is optional */
      });
      navigate('/login', { state: { email: formData.email, registered: true } });
    } else {
      setError(result.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-page-shell">
      <SiteNavbar variant="overlay" />
      <div className="register-page-container">
      <div className="register-card-box glass">
        <div className="register-left-img-panel">
          <img src="/register_side.png" alt="Furniture Catalog" className="register-catalog-img" />
          <div className="register-img-overlay">
            <h3 className="catalog-collection-tag font-serif">
              #Collection {new Date().getFullYear()}
            </h3>
          </div>
        </div>

        <div className="register-right-form-panel">
          <h2 className="register-form-title font-serif">Registration Form</h2>

          <div className="avatar-upload-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div className="avatar-preview-circle" style={{ width: '70px', height: '70px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.3)', position: 'relative' }}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <User size={28} style={{ color: 'rgba(255,255,255,0.3)' }} />
              )}
            </div>
            <label className="btn-outline" style={{ padding: '6px 12px', fontSize: '11px', cursor: 'pointer', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', display: 'inline-block' }}>
              Upload Picture
              <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
            </label>
          </div>

          {error && <div className="form-error-msg">{error}</div>}

          <form onSubmit={handleSubmit} className="register-form-el">
            <div className="form-input-row">
              <div className="form-underlined-group half-width">
                <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div className="form-underlined-group half-width">
                <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-underlined-group">
              <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
              <User size={14} className="input-icon-right" />
            </div>

            <div className="form-underlined-group">
              <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
              <Mail size={14} className="input-icon-right" />
            </div>

            <div className="form-underlined-group">
              <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
              <Phone size={14} className="input-icon-right" />
            </div>

            <div className="form-input-row">
              <div className="form-underlined-group half-width select-wrapper">
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown size={14} className="input-icon-right pointer-events-none" />
              </div>
            </div>

            <div className="form-underlined-group">
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
              <Lock size={14} className="input-icon-right" />
            </div>

            <div className="form-underlined-group">
              <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
              <Lock size={14} className="input-icon-right" />
            </div>

            <div className="register-form-footer">
              <button type="submit" className="btn-gold register-submit-btn" disabled={submitting}>
                {submitting ? 'Saving to database...' : 'Register'}
                <Check size={14} />
              </button>
              <p className="login-redirect-text">
                Already registered? <Link to="/login" className="login-redirect-link">Sign In</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
}
