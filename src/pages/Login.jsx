import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Eye, EyeOff, Mail } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const res = login(email, password);
    if (res.success) {
      if (res.user.role === 'Admin') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card-neumorphic glass">
        {/* Top Circular User Icon */}
        <div className="login-profile-circle">
          <User size={32} className="login-profile-icon" />
        </div>

        <h2 className="login-title-text font-serif">Welcome back</h2>
        <p className="login-subtitle-text">Please sign in to continue</p>

        {error && <div className="form-error-msg">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form-el">
          {/* Email input (neumorphic style) */}
          <div className="neumorphic-input-group">
            <Mail size={16} className="neumorphic-input-icon-left" />
            <input 
              type="email" 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          {/* Password input (neumorphic style) */}
          <div className="neumorphic-input-group">
            <Lock size={16} className="neumorphic-input-icon-left" />
            <input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle-btn"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Remember Me & Forgot Password Row */}
          <div className="login-options-row">
            <label className="remember-me-checkbox">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#forgot" className="forgot-password-link">Forgot password?</a>
          </div>

          {/* Sign In Button */}
          <button type="submit" className="btn-gold login-submit-btn-full">
            Sign In
          </button>
        </form>

        {/* Or Continue With */}
        <div className="or-divider-section">
          <span className="or-line" />
          <span className="or-text">OR CONTINUE WITH</span>
          <span className="or-line" />
        </div>

        {/* Social Buttons (neumorphic circles with custom SVGs) */}
        <div className="social-login-row">
          {/* Google SVG */}
          <button className="social-btn" aria-label="Google Login">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.415 0-6.19-2.775-6.19-6.19s2.775-6.19 6.19-6.19c1.7 0 3.22.685 4.33 1.8l3.1-3.1C18.422 1.636 15.498 0 12.24 0 5.48 0 0 5.48 0 12.24s5.48 12.24 12.24 12.24c6.8 0 11.23-4.787 11.23-11.44 0-.702-.06-1.378-.175-2.025H12.24z"/>
            </svg>
          </button>

          {/* GitHub SVG */}
          <button className="social-btn" aria-label="GitHub Login">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </button>

          {/* Twitter SVG */}
          <button className="social-btn" aria-label="Twitter Login">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </button>
        </div>

        {/* Sign Up Redirect Footer */}
        <p className="signup-redirect-text">
          Don't have an account? <Link to="/register" className="signup-redirect-link">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
