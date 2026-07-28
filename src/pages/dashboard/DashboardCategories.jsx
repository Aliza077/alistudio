import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sliders, Plus, Trash2, Edit2, X, Image as ImageIcon, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { readFileAsDataUrl } from '../../utils/uploadService';

const SUB_CATEGORY_OPTIONS = [
  'Sofas',
  'Chairs',
  'Beds',
  'Dressing Tables',
  'Tables',
  'Wardrobes',
  'Lighting',
  'Decor',
];

export default function DashboardCategories() {
  const { token } = useAuth();
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Form states
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({ name: '', image: '' });

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/category/getall');
      const data = await res.json();
      if (data.status === 'success') {
        setCategoriesList(data.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImageFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setFormData(prev => ({ ...prev, image: dataUrl }));
    } catch {
      setError('Failed to read image file.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!isEditMode && !formData.name.trim() && !formData.image) {
      setError('Provide a category name or thumbnail image.');
      return;
    }

    const url = isEditMode ? `/api/category/update/${selectedId}` : '/api/category/create';
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(isEditMode ? 'Category updated successfully.' : 'Category created successfully.');
        setFormData({ name: '', image: '' });
        setIsEditMode(false);
        setSelectedId(null);
        fetchCategories();
      } else {
        setError(data.message || 'Operation failed.');
      }
    } catch {
      setError('Network error. Please try again.');
    }
  };

  const handleEdit = (cat) => {
    setIsEditMode(true);
    setSelectedId(cat._id);
    setFormData({ name: cat.name, image: cat.image || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    setMessage('');
    setError('');

    try {
      const res = await fetch(`/api/category/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setMessage('Category deleted successfully.');
        fetchCategories();
      } else {
        setError('Failed to delete category.');
      }
    } catch {
      setError('Network error. Please try again.');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="dash-page-content">
      <div className="dash-page-header glass">
        <div className="dash-page-icon-wrap" style={{ color: 'var(--accent-blue)', borderColor: 'var(--accent-blue-semi)' }}>
          <Sliders size={24} />
        </div>
        <div>
          <h2 className="dash-page-title">Categories Management</h2>
          <p className="dash-page-subtitle">Add, edit, or delete categories and images for "Shop by Category" section</p>
        </div>
      </div>

      <div className="dash-page-grid" style={{ gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px', marginTop: '24px', display: 'grid' }}>
        {/* Form Column */}
        <div className="glass card-span-4" style={{ padding: '24px', height: 'fit-content' }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px', fontSize: '16px', fontWeight: '600' }}>
            {isEditMode ? 'Edit Category' : 'Create Category'}
          </h3>

          {error && <div className="form-error-msg" style={{ marginBottom: '16px' }}>{error}</div>}
          {message && <div className="form-success-msg" style={{ marginBottom: '16px' }}>{message}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Category Thumbnail</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: 'var(--bg-tertiary)' }}>
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <ImageIcon size={20} style={{ color: 'var(--text-muted)' }} />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFile}
                  style={{ fontSize: '12px', color: 'var(--text-secondary)' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '-4px' }}>
              <label style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.02em' }}>
                Category Name <sub style={{ fontSize: '9px', opacity: 0.75 }}>(optional)</sub>
              </label>
              <div className="form-underlined-group" style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="e.g. Lounge Chairs"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  list="sub-category-options"
                  style={{
                    color: 'var(--text-secondary)',
                    padding: '4px 28px 4px 0',
                    fontSize: '12px',
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    fontStyle: 'italic',
                    opacity: 0.9,
                  }}
                />
                <ChevronDown size={14} style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', opacity: 0.5, pointerEvents: 'none' }} />
                <datalist id="sub-category-options">
                  {SUB_CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} />
                  ))}
                  {categoriesList.map((cat) => (
                    <option key={cat._id} value={cat.name} />
                  ))}
                </datalist>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', width: '100%' }}>Sub Categories</span>
                {SUB_CATEGORY_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, name: opt }))}
                    className={`size-btn glass ${formData.name === opt ? 'active' : ''}`}
                    style={{
                      fontSize: '11px',
                      padding: '6px 10px',
                      background: formData.name === opt ? 'rgba(0, 240, 255, 0.15)' : undefined,
                      borderColor: formData.name === opt ? 'var(--accent-blue)' : undefined,
                      color: formData.name === opt ? 'var(--accent-blue)' : 'var(--text-secondary)',
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button type="submit" className="btn-gold" style={{ flex: 1, padding: '10px 0', borderRadius: '8px', fontSize: '13px' }}>
                {isEditMode ? 'Update' : 'Create'}
              </button>
              {isEditMode && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditMode(false);
                    setSelectedId(null);
                    setFormData({ name: '', image: '' });
                  }}
                  className="btn-outline"
                  style={{ padding: '10px 16px', borderRadius: '8px', fontSize: '13px' }}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Column */}
        <div className="glass card-span-8" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px', fontSize: '16px', fontWeight: '600' }}>
            Registered Categories
          </h3>

          {loading ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading categories...</p>
          ) : categoriesList.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No categories registered.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {categoriesList.map((cat) => (
                <div key={cat._id} className="glass" style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '110px', width: '100%', overflow: 'hidden', backgroundColor: 'var(--bg-tertiary)', position: 'relative' }}>
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        <ImageIcon size={28} />
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '500', color: 'var(--text-secondary)', fontSize: '11px', fontStyle: 'italic' }}>{cat.name}</span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => handleEdit(cat)}
                        style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', padding: '6px', borderRadius: '6px', backgroundColor: 'rgba(175, 133, 80, 0.05)' }}
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px', borderRadius: '6px', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
