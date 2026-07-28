import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sliders, Plus, Trash2, Save, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { readFileAsDataUrl } from '../../utils/uploadService';

export default function DashboardHomeSettings() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Settings State
  const [slides, setSlides] = useState([]);
  const [megaDeals, setMegaDeals] = useState({
    festTag: '',
    title: '',
    discountText: '',
    datesLabel: '',
    images: []
  });

  // Slide Form Fields (for adding a slide)
  const [newSlide, setNewSlide] = useState({ image: '', title: '', subtitle: '' });

  // Deal Image File Input state
  const [newDealImg, setNewDealImg] = useState('');

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/home-settings');
      const data = await res.json();
      if (data.status === 'success' && data.data) {
        setSlides(data.data.slides || []);
        setMegaDeals(data.data.megaDeals || {
          festTag: '',
          title: '',
          discountText: '',
          datesLabel: '',
          images: []
        });
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSlideImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await readFileAsDataUrl(file);
      setNewSlide(prev => ({ ...prev, image: url }));
    } catch {
      setError('Failed to read image.');
    }
  };

  const handleDealImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await readFileAsDataUrl(file);
      setMegaDeals(prev => ({
        ...prev,
        images: [...prev.images, url]
      }));
    } catch {
      setError('Failed to read image.');
    }
  };

  const addCarouselSlide = (e) => {
    e.preventDefault();
    if (!newSlide.image) {
      setError('Please select an image for the new slide.');
      return;
    }
    setSlides([...slides, newSlide]);
    setNewSlide({ image: '', title: '', subtitle: '' });
    setMessage('Slide staged for saving. Please click Save Changes.');
  };

  const removeCarouselSlide = (idx) => {
    setSlides(slides.filter((_, i) => i !== idx));
    setMessage('Slide staged for deletion. Please click Save Changes.');
  };

  const removeDealImage = (idx) => {
    setMegaDeals({
      ...megaDeals,
      images: megaDeals.images.filter((_, i) => i !== idx)
    });
    setMessage('Deal image staged for deletion. Please click Save Changes.');
  };

  const saveSettings = async () => {
    setMessage('');
    setError('');
    try {
      const res = await fetch('/api/admin/home-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ slides, megaDeals })
      });
      if (res.ok) {
        setMessage('Home configurations saved successfully.');
        fetchSettings();
      } else {
        setError('Failed to save home settings.');
      }
    } catch {
      setError('Network error saving settings.');
    }
  };

  if (loading) {
    return (
      <div className="dash-page-content">
        <p style={{ color: 'var(--text-muted)' }}>Loading Home settings...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="dash-page-content">
      <div className="dash-page-header glass">
        <div className="dash-page-icon-wrap" style={{ color: 'var(--accent-blue)', borderColor: 'var(--accent-blue-semi)' }}>
          <Sliders size={24} />
        </div>
        <div>
          <h2 className="dash-page-title">Home Page Carousel & Deals</h2>
          <p className="dash-page-subtitle">Configure homepage slider slides, banner content, headings, dates, and promo graphics</p>
        </div>
      </div>

      {error && <div className="form-error-msg" style={{ marginTop: '20px' }}>{error}</div>}
      {message && <div className="form-success-msg" style={{ marginTop: '20px' }}>{message}</div>}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <button onClick={saveSettings} className="btn-gold" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '8px' }}>
          <Save size={16} />
          Save Changes
        </button>
      </div>

      <div className="dash-page-grid" style={{ gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px', marginTop: '24px', display: 'grid' }}>
        
        {/* CAROUSEL SLIDES COLUMN */}
        <div className="glass card-span-6" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>Hero Carousel Slides</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {slides.map((s, idx) => (
              <div key={idx} className="glass" style={{ display: 'flex', gap: '16px', padding: '12px', borderRadius: '12px', border: '1px solid var(--glass-border)', alignItems: 'center' }}>
                <img src={s.image} alt={s.title} style={{ width: '80px', height: '50px', borderRadius: '8px', objectFit: 'cover', backgroundColor: 'var(--bg-tertiary)' }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: '600' }}>{s.title || 'Untitled'}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{s.subtitle}</p>
                </div>
                <button onClick={() => removeCarouselSlide(idx)} className="feedback-delete-btn" style={{ color: '#ef4444' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <h4 style={{ color: 'var(--text-primary)', marginBottom: '12px', fontSize: '13px', fontWeight: '600' }}>Add New Slide</h4>
          <form onSubmit={addCarouselSlide} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="form-underlined-group">
              <input
                type="text"
                placeholder="Slide Title"
                value={newSlide.title}
                onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                required
                style={{ color: 'var(--text-primary)', fontSize: '13px', width: '100%', border: 'none', background: 'none' }}
              />
            </div>
            <div className="form-underlined-group">
              <input
                type="text"
                placeholder="Slide Subtitle"
                value={newSlide.subtitle}
                onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
                style={{ color: 'var(--text-primary)', fontSize: '13px', width: '100%', border: 'none', background: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '8px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: 'var(--bg-tertiary)' }}>
                {newSlide.image ? <img src={newSlide.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ImageIcon size={18} style={{ color: 'var(--text-muted)' }} />}
              </div>
              <input type="file" accept="image/*" onChange={handleSlideImage} style={{ fontSize: '11px', color: 'var(--text-secondary)' }} />
            </div>
            <button type="submit" className="btn-gold" style={{ padding: '8px 16px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'center', fontSize: '12px' }}>
              <Plus size={14} /> Add Slide
            </button>
          </form>
        </div>

        {/* MEGA DEALS CONFIG COLUMN */}
        <div className="glass card-span-6" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>Mega Deals Promotions</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-underlined-group">
              <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Festival Tag</label>
              <input
                type="text"
                value={megaDeals.festTag}
                onChange={(e) => setMegaDeals({ ...megaDeals, festTag: e.target.value })}
                style={{ color: 'var(--text-primary)', fontSize: '13px', width: '100%', border: 'none', background: 'none' }}
              />
            </div>

            <div className="form-underlined-group">
              <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Main Heading / Title</label>
              <input
                type="text"
                value={megaDeals.title}
                onChange={(e) => setMegaDeals({ ...megaDeals, title: e.target.value })}
                style={{ color: 'var(--text-primary)', fontSize: '13px', width: '100%', border: 'none', background: 'none' }}
              />
            </div>

            <div className="form-underlined-group">
              <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Discount Description Text</label>
              <input
                type="text"
                value={megaDeals.discountText}
                onChange={(e) => setMegaDeals({ ...megaDeals, discountText: e.target.value })}
                style={{ color: 'var(--text-primary)', fontSize: '13px', width: '100%', border: 'none', background: 'none' }}
              />
            </div>

            <div className="form-underlined-group">
              <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Dates Label</label>
              <input
                type="text"
                value={megaDeals.datesLabel}
                onChange={(e) => setMegaDeals({ ...megaDeals, datesLabel: e.target.value })}
                style={{ color: 'var(--text-primary)', fontSize: '13px', width: '100%', border: 'none', background: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Promo Slideshow Images</label>
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '12px' }}>
                {megaDeals.images.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative', width: '80px', height: '60px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                    <img src={img} alt="Deal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => removeDealImage(idx)}
                      style={{ position: 'absolute', top: '2px', right: '2px', padding: '4px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.6)', color: '#ef4444', border: 'none', cursor: 'pointer', display: 'flex' }}
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                ))}
              </div>
              <input type="file" accept="image/*" onChange={handleDealImage} style={{ fontSize: '11px', color: 'var(--text-secondary)' }} />
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
