import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sendVerificationCode, verifyCode } from '../utils/emailService';
import { User, Lock, Eye, EyeOff, Mail, Key } from 'lucide-react';

export default function Login() {
  const { login, resetPassword, registeredUsers } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState(
    location.state?.registered ? 'Registration successful! Please sign in with your email and password.' : ''
  );

  const [forgotStep, setForgotStep] = useState(0);
  const [forgotEmail, setForgotEmail] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

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

  const sendResetCode = async (targetEmail) => {
    setSending(true);
    setError('');
    try {
      await sendVerificationCode(targetEmail, 'reset');
      setResendTimer(60);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to send code. Make sure the email server is running.');
      return false;
    } finally {
      setSending(false);
    }
  };

  const handleForgotEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const userExists = registeredUsers.some(
      (u) => u.email.toLowerCase() === forgotEmail.toLowerCase()
    );
    if (!userExists) {
      setError('No account found with this email address.');
      return;
    }

    const sent = await sendResetCode(forgotEmail);
    if (sent) {
      setForgotStep(2);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    await sendResetCode(forgotEmail);
  };

  const handleVerifyCodeSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await verifyCode(forgotEmail, enteredCode, 'reset');
      setForgotStep(3);
    } catch (err) {
      setError(err.message || 'Invalid verification code. Check your Gmail inbox.');
    }
  };

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

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
        <div className="login-profile-circle">
          {forgotStep === 0 ? <User size={32} className="login-profile-icon" /> : <Key size={32} className="login-profile-icon" />}
        </div>

        {forgotStep === 0 && (
          <>
            <h2 className="login-title-text font-serif">Welcome back</h2>
            <p className="login-subtitle-text">Please sign in to continue</p>

            {successMsg && <div className="form-success-msg">{successMsg}</div>}
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
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle-btn">
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
                  onClick={() => { setError(''); setForgotEmail(email); setForgotStep(1); }}
                  className="forgot-password-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  Forgot password?
                </button>
              </div>

              <button type="submit" className="btn-gold login-submit-btn-full">Sign In</button>
            </form>

            <p className="signup-redirect-text">
              Don't have an account? <Link to="/register" className="signup-redirect-link">Sign up</Link>
            </p>
          </>
        )}

        {forgotStep === 1 && (
          <>
            <h2 className="login-title-text font-serif">Forgot Password</h2>
            <p className="login-subtitle-text">Enter your email — a 6-digit code will be sent to your Gmail inbox</p>

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

              <button type="submit" className="btn-gold login-submit-btn-full" style={{ marginTop: '16px' }} disabled={sending}>
                {sending ? 'Sending...' : 'Send Reset Code'}
              </button>

              <button type="button" onClick={() => setForgotStep(0)} className="btn-outline" style={{ width: '100%', marginTop: '12px', padding: '10px 0', fontSize: '13px' }}>
                Cancel
              </button>
            </form>
          </>
        )}

        {forgotStep === 2 && (
          <>
            <h2 className="login-title-text font-serif">Verify Code</h2>
            <p className="login-subtitle-text">
              Enter the 6-digit code sent to <strong>{forgotEmail}</strong>. Check your Gmail inbox.
            </p>

            {error && <div className="form-error-msg">{error}</div>}

            <form onSubmit={handleVerifyCodeSubmit} className="login-form-el">
              <div className="neumorphic-input-group">
                <Lock size={16} className="neumorphic-input-icon-left" />
                <input
                  type="text"
                  placeholder="6-Digit Code"
                  maxLength="6"
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>

              <button type="submit" className="btn-gold login-submit-btn-full" style={{ marginTop: '16px' }}>
                Verify Code
              </button>

              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendTimer > 0 || sending}
                className="btn-outline"
                style={{ width: '100%', marginTop: '12px', padding: '10px 0', fontSize: '13px' }}
              >
                {resendTimer > 0 ? `Resend Code (${resendTimer}s)` : 'Resend Code'}
              </button>

              <button type="button" onClick={() => setForgotStep(1)} className="btn-outline" style={{ width: '100%', marginTop: '12px', padding: '10px 0', fontSize: '13px' }}>
                Back
              </button>
            </form>
          </>
        )}

        {forgotStep === 3 && (
          <>
            <h2 className="login-title-text font-serif">New Password</h2>
            <p className="login-subtitle-text">Set a new secure password for your account</p>

            {error && <div className="form-error-msg">{error}</div>}

            <form onSubmit={handleResetPasswordSubmit} className="login-form-el">
              <div className="neumorphic-input-group">
                <Lock size={16} className="neumorphic-input-icon-left" />
                <input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              </div>

              <div className="neumorphic-input-group">
                <Lock size={16} className="neumorphic-input-icon-left" />
                <input type="password" placeholder="Confirm new password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required />
              </div>

              <button type="submit" className="btn-gold login-submit-btn-full" style={{ marginTop: '16px' }}>
                Reset Password
              </button>
            </form>
          </>
        )}

        {forgotStep === 4 && (
          <>
            <h2 className="login-title-text font-serif">Success!</h2>
            <p className="login-subtitle-text">Your password has been reset successfully.</p>

            <button
              type="button"
              onClick={() => { setEmail(forgotEmail); setPassword(''); setForgotStep(0); }}
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
