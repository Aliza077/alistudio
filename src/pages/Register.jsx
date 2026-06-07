import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ChevronDown, Check } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    gender: 'Male',
    role: 'User', // User or Admin
    password: '',
    confirmPassword: '',
    avatar: null
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [error, setError] = useState('');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Attempt mock registration
    register(formData);

    // Redirect logic: User goes to Home (/), Admin goes to Dashboard (or can see Dashboard)
    if (formData.role === 'Admin') {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="register-page-container">
      <div className="register-card-box glass">
        {/* Left Side: Catalog Image */}
        <div className="register-left-img-panel">
          <img src="/register_side.png" alt="Furniture Catalog" className="register-catalog-img" />
          <div className="register-img-overlay">
            <h3 className="catalog-collection-tag font-serif">#Collection {new Date().getFullYear()}</h3>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="register-right-form-panel">
          <h2 className="register-form-title font-serif">Registration Form</h2>

          {/* Profile Picture Upload Field */}
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
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleAvatarChange} 
                style={{ display: 'none' }} 
              />
            </label>
          </div>
          
          {error && <div className="form-error-msg">{error}</div>}

          <form onSubmit={handleSubmit} className="register-form-el">
            {/* First & Last Name row */}
            <div className="form-input-row">
              <div className="form-underlined-group half-width">
                <input 
                  type="text" 
                  name="firstName" 
                  placeholder="First Name" 
                  value={formData.firstName}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="form-underlined-group half-width">
                <input 
                  type="text" 
                  name="lastName" 
                  placeholder="Last Name" 
                  value={formData.lastName}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            {/* Username field */}
            <div className="form-underlined-group">
              <input 
                type="text" 
                name="username" 
                placeholder="Username" 
                value={formData.username}
                onChange={handleChange}
                required 
              />
              <User size={14} className="input-icon-right" />
            </div>

            {/* Email Address field */}
            <div className="form-underlined-group">
              <input 
                type="email" 
                name="email" 
                placeholder="Email Address" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
              <Mail size={14} className="input-icon-right" />
            </div>

            {/* Selector Row: Gender & Role */}
            <div className="form-input-row">
              {/* Gender selector */}
              <div className="form-underlined-group half-width select-wrapper">
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown size={14} className="input-icon-right pointer-events-none" />
              </div>

              {/* Role selector (User/Admin) */}
              <div className="form-underlined-group half-width select-wrapper">
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="User">User Role</option>
                  <option value="Admin">Admin Role</option>
                </select>
                <ChevronDown size={14} className="input-icon-right pointer-events-none" />
              </div>
            </div>

            {/* Password field */}
            <div className="form-underlined-group">
              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                value={formData.password}
                onChange={handleChange}
                required 
              />
              <Lock size={14} className="input-icon-right" />
            </div>

            {/* Confirm Password field */}
            <div className="form-underlined-group">
              <input 
                type="password" 
                name="confirmPassword" 
                placeholder="Confirm Password" 
                value={formData.confirmPassword}
                onChange={handleChange}
                required 
              />
              <Lock size={14} className="input-icon-right" />
            </div>

            {/* Submit & Redirect Footer */}
            <div className="register-form-footer">
              <button type="submit" className="btn-gold register-submit-btn">
                Register
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
  );
}
