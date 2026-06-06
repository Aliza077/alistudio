import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, ChevronDown } from 'lucide-react';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    type: 'Suggestion', // General, Consult, Report, Suggestion
    message: '' 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setFormData({ name: '', email: '', type: 'Suggestion', message: '' });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="place-container">
      <div className="place-glow-top" />
      <div className="place-glow-bottom" />

      {/* Header */}
      <header className="place-header">
        <Link to="/" className="place-logo-block">
          <div className="place-logo-wrapper">
            <img src="/logo.png" alt="Ali Logo" className="avatar-img" />
          </div>
          <span className="place-logo-title">Ali <span>STUDIO</span></span>
        </Link>
        <Link to="/" className="btn-outline place-btn-back">
          <ArrowLeft size={12} />
          Back to Home
        </Link>
      </header>

      {/* Main Content */}
      <main className="place-main" style={{ maxWidth: '600px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="place-box glass"
          style={{ textAlign: 'left', width: '100%' }}
        >
          <div className="place-scanner" />

          <span className="place-node-badge" style={{ marginBottom: '16px', display: 'inline-block' }}>
            Submission Desk
          </span>
          <h1 className="place-title" style={{ marginTop: '8px', marginBottom: '24px', fontSize: '32px' }}>
            Contact, Report & Suggestions
          </h1>

          {sent ? (
            <div className="form-error-msg" style={{ backgroundColor: 'rgba(52, 211, 153, 0.1)', borderColor: 'rgba(52, 211, 153, 0.2)', color: '#34d399' }}>
              Submission transmitted successfully. Thank you for your feedback!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="register-form-el">
              {/* Name field */}
              <div className="form-underlined-group">
                <input 
                  type="text" 
                  name="name"
                  placeholder="Your Name" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
              </div>

              {/* Email field */}
              <div className="form-underlined-group">
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email Address" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>

              {/* Type Select Dropdown Selector */}
              <div className="form-underlined-group select-wrapper">
                <select name="type" value={formData.type} onChange={handleChange} style={{ color: '#fff' }}>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Design Consultation">Design Consultation</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="Suggestion">Suggestion & Feedback</option>
                </select>
                <ChevronDown size={14} className="input-icon-right pointer-events-none" />
              </div>

              {/* Message textarea */}
              <div className="form-underlined-group">
                <textarea 
                  name="message"
                  placeholder="Type your message, suggestion, or bug description here..." 
                  value={formData.message}
                  onChange={handleChange}
                  required
                  style={{ 
                    width: '100%', 
                    background: 'transparent', 
                    border: 'none', 
                    outline: 'none', 
                    color: '#fff', 
                    padding: '10px 0', 
                    fontFamily: 'var(--font-sans)', 
                    fontSize: '14px', 
                    height: '100px',
                    resize: 'none'
                  }}
                />
              </div>

              <button type="submit" className="btn-gold" style={{ marginTop: '16px', width: '100%', justifyContent: 'center' }}>
                Transmit Submission
                <Send size={14} />
              </button>
            </form>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="place-footer">
        <p className="place-footer-text">
          &copy; {new Date().getFullYear()} Ali Studio. All Systems Operational.
        </p>
      </footer>
    </div>
  );
}
