import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, ChevronDown, Mail, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StudioPageLayout from '../components/StudioPageLayout';

export default function Contact() {
  const { user, submitFeedback } = useAuth();
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.username || '',
    email: user?.email || '',
    type: 'General Inquiry',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const typeMap = {
      'Bug Report': 'complaint',
      'Complaint': 'complaint',
      'Suggestion & Feedback': 'suggestion',
      'General Inquiry': 'suggestion',
      'Design Consultation': 'suggestion',
    };
    submitFeedback(formData.message, typeMap[formData.type] || 'suggestion', {
      username: formData.name,
      email: formData.email,
    });
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setFormData({ name: user?.username || '', email: user?.email || '', type: 'General Inquiry', message: '' });
    }, 3000);
  };

  return (
    <StudioPageLayout maxWidth="640px">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="place-box glass studio-page-box">
        <div className="place-scanner" />
        <span className="place-node-badge">Get In Touch</span>
        <h1 className="studio-page-title font-serif">Contact Us</h1>
        <p className="studio-page-lead">Questions, design consultations, or complaints — we respond within 24 hours. Complaints are sent directly to our admin team.</p>

        <div className="studio-contact-info">
          <div className="studio-contact-item"><Mail size={16} /><div><strong>Email</strong><span>hello@alistudio.com</span></div></div>
          <div className="studio-contact-item"><Phone size={16} /><div><strong>Phone</strong><span>+1 (555) 123-4567</span></div></div>
          <div className="studio-contact-item"><MapPin size={16} /><div><strong>Studio</strong><span>123 Design Avenue, New York</span></div></div>
        </div>

        {sent ? (
          <div className="form-success-msg">Message sent! Our team will review it shortly.</div>
        ) : (
          <form onSubmit={handleSubmit} className="register-form-el studio-contact-form">
            <div className="form-underlined-group">
              <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} required />
            </div>
            <div className="form-underlined-group">
              <input type="email" name="email" placeholder="Gmail / Email" value={formData.email} onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} required />
            </div>
            <div className="form-underlined-group select-wrapper">
              <select name="type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} style={{ color: '#fff' }}>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Design Consultation">Design Consultation</option>
                <option value="Complaint">Complaint</option>
                <option value="Suggestion & Feedback">Suggestion & Feedback</option>
              </select>
              <ChevronDown size={14} className="input-icon-right pointer-events-none" />
            </div>
            <div className="form-underlined-group">
              <textarea name="message" placeholder="Your message..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required rows={4} className="studio-textarea" />
            </div>
            <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
              Send Message <Send size={14} />
            </button>
          </form>
        )}
      </motion.div>
    </StudioPageLayout>
  );
}
