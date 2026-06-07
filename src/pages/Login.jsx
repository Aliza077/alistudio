import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Eye, EyeOff, Mail, Key } from 'lucide-react';

export default function Login() {
  const { login, resetPassword, registeredUsers } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Forgot password steps: 0=Login, 1=Enter Email, 2=Verify Code, 3=New Password, 4=Success
  const [forgotStep, setForgotStep] = useState(0);
  const [forgotEmail, setForgotEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  // Timer effect for resending email code
  React.useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

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

  const handleForgotEmailSubmit = (e) => {
    e.preventDefault();
    setError('');

    const userExists = registeredUsers.some((u) => u.email.toLowerCase() === forgotEmail.toLowerCase());
    if (!userExists) {
      setError('No account found with this email address.');
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(code);
    setResendTimer(60);
    alert(`[GMAIL SIMULATION] Verification code sent to ${forgotEmail}: ${code}`);
    setForgotStep(2);
  };

  const handleResendCode = () => {
    setError('');
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(code);
    setResendTimer(60);
    alert(`[GMAIL SIMULATION] Verification code resent to ${forgotEmail}: ${code}`);
  };

  const handleVerifyCodeSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (enteredCode === verificationCode) {
      setForgotStep(3);
    } else {
      setError('Invalid verification code. Please check your simulated Gmail.');
    }
  };

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }

    const success = resetPassword(forgotEmail, newPassword);
    if (success) {
      setForgotStep(4);
    } else {
      setError('Failed to reset password. Please try again.');
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card-neumorphic glass">
        {/* Profile Circle Header */}
        <div className="login-profile-circle">
          {forgotStep === 0 ? <User size={32} className="login-profile-icon" /> : <Key size={32} className="login-profile-icon" />}
        </div>

        {/* STEP 0: Login Form */}
        {forgotStep === 0 && (
          <>
            <h2 className="login-title-text font-serif">Welcome back</h2>
            <p className="login-subtitle-text">Please sign in to continue</p>

            {error && <div className="form-error-msg">{error}</div>}

            <form onSubmit={handleSubmit} className="login-form-el">
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

              <div className="login-options-row">
                <label className="remember-me-checkbox">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <button 
                  type="button" 
                  onClick={() => {
                    setError('');
                    setForgotEmail(email);
                    setForgotStep(1);
                  }} 
                  className="forgot-password-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  Forgot password?
                </button>
              </div>

              <button type="submit" className="btn-gold login-submit-btn-full">
                Sign In
              </button>
            </form>

            <div className="or-divider-section">
              <span className="or-line" />
              <span className="or-text">OR CONTINUE WITH</span>
              <span className="or-line" />
            </div>

            <div className="social-login-row">
              <button className="social-btn" aria-label="Google Login">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.415 0-6.19-2.775-6.19-6.19s2.775-6.19 6.19-6.19c1.7 0 3.22.685 4.33 1.8l3.1-3.1C18.422 1.636 15.498 0 12.24 0 5.48 0 0 5.48 0 12.24s5.48 12.24 12.24 12.24c6.8 0 11.23-4.787 11.23-11.44 0-.702-.06-1.378-.175-2.025H12.24z"/>
                </svg>
              </button>

              <button className="social-btn" aria-label="GitHub Login">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </button>

              <button className="social-btn" aria-label="Twitter Login">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </button>
            </div>

            <p className="signup-redirect-text">
              Don't have an account? <Link to="/register" className="signup-redirect-link">Sign up</Link>
            </p>
          </>
        )}

        {/* STEP 1: Enter Email for Reset */}
        {forgotStep === 1 && (
          <>
            <h2 className="login-title-text font-serif">Forgot Password</h2>
            <p className="login-subtitle-text">Enter your email to receive a simulated code</p>

            {error && <div className="form-error-msg">{error}</div>}

            <form onSubmit={handleForgotEmailSubmit} className="login-form-el">
              <div className="neumorphic-input-group">
                <Mail size={16} className="neumorphic-input-icon-left" />
                <input 
                  type="email" 
                  placeholder="Registered email address" 
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required 
                />
              </div>

              <button type="submit" className="btn-gold login-submit-btn-full" style={{ marginTop: '16px' }}>
                Send Reset Code
              </button>
              
              <button 
                type="button" 
                onClick={() => setForgotStep(0)} 
                className="btn-outline" 
                style={{ width: '100%', marginTop: '12px', padding: '10px 0', fontSize: '13px' }}
              >
                Cancel
              </button>
            </form>
          </>
        )}

        {/* STEP 2: Verify Code */}
        {forgotStep === 2 && (
          <>
            <h2 className="login-title-text font-serif">Verify Code</h2>
            <p className="login-subtitle-text">Enter the 6-digit code alert-simulated to your Gmail inbox</p>

            {/* Simulated verification code display box to prevent alert block issues */}
            <div className="simulated-code-box" style={{ background: 'rgba(197, 168, 128, 0.1)', border: '1px solid var(--accent-gold)', borderRadius: '12px', padding: '12px', textAlign: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Simulated Gmail Dispatch</span>
              <strong style={{ fontSize: '20px', color: 'var(--text-primary)', letterSpacing: '0.1em' }}>{verificationCode}</strong>
            </div>

            {error && <div className="form-error-msg">{error}</div>}

            <form onSubmit={handleVerifyCodeSubmit} className="login-form-el">
              <div className="neumorphic-input-group">
                <Lock size={16} className="neumorphic-input-icon-left" />
                <input 
                  type="text" 
                  placeholder="6-Digit Code" 
                  maxLength="6"
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value)}
                  required 
                />
              </div>

              <button type="submit" className="btn-gold login-submit-btn-full" style={{ marginTop: '16px' }}>
                Verify Code
              </button>
              
              <button 
                type="button" 
                onClick={handleResendCode} 
                disabled={resendTimer > 0} 
                className="btn-outline" 
                style={{ width: '100%', marginTop: '12px', padding: '10px 0', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                {resendTimer > 0 ? `Resend Code (${resendTimer}s)` : 'Resend Code'}
              </button>
              
              <button 
                type="button" 
                onClick={() => setForgotStep(1)} 
                className="btn-outline" 
                style={{ width: '100%', marginTop: '12px', padding: '10px 0', fontSize: '13px' }}
              >
                Back
              </button>
            </form>
          </>
        )}

        {/* STEP 3: Enter New Password */}
        {forgotStep === 3 && (
          <>
            <h2 className="login-title-text font-serif">New Password</h2>
            <p className="login-subtitle-text">Set a new secure password for your account</p>

            {error && <div className="form-error-msg">{error}</div>}

            <form onSubmit={handleResetPasswordSubmit} className="login-form-el">
              <div className="neumorphic-input-group">
                <Lock size={16} className="neumorphic-input-icon-left" />
                <input 
                  type="password" 
                  placeholder="New password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required 
                />
              </div>

              <div className="neumorphic-input-group">
                <Lock size={16} className="neumorphic-input-icon-left" />
                <input 
                  type="password" 
                  placeholder="Confirm new password" 
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required 
                />
              </div>

              <button type="submit" className="btn-gold login-submit-btn-full" style={{ marginTop: '16px' }}>
                Reset Password
              </button>
            </form>
          </>
        )}

        {/* STEP 4: Success message */}
        {forgotStep === 4 && (
          <>
            <h2 className="login-title-text font-serif">Success!</h2>
            <p className="login-subtitle-text">Your password has been reset successfully.</p>

            <button 
              type="button" 
              onClick={() => {
                setEmail(forgotEmail);
                setPassword('');
                setForgotStep(0);
              }} 
              className="btn-gold login-submit-btn-full"
              style={{ marginTop: '24px' }}
            >
              Sign In Now
            </button>
          </>
        )}
      </div>
    </div>
  );
}
