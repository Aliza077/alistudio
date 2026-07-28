import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Trash2, Edit2, Plus, X, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { readFileAsDataUrl } from '../../utils/uploadService';

export default function DashboardProducts() {
  const { token } = useAuth();
  const authToken = token || localStorage.getItem('ali_token');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    category: 'Sofas',
    price: '',
    quantity: '',
    description: '',
    image: ''
  });

  const [editFormData, setEditFormData] = useState({
    title: '',
    category: 'Sofas',
    price: '',
    quantity: '',
    description: '',
    image: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchProductsList = async () => {
    try {
      const res = await fetch('/api/products');
      const result = await res.json();
      if (res.ok) {
        const list = result.data || [];
        setProducts(list.filter((p) => p.image && String(p.image).trim()));
        return list;
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
    return [];
  };

  const cleanupMissingImages = async () => {
    if (!authToken) return;
    try {
      const res = await fetch('/api/products/cleanup-no-image', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.deletedCount > 0) {
        setMessage(`Removed ${data.deletedCount} product(s) without images.`);
        await fetchProductsList();
      }
    } catch {
      /* optional cleanup — ignore failures */
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await fetchProductsList();
      if (!cancelled && authToken) await cleanupMissingImages();
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditInputChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleImageFile = async (e, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      if (isEdit) {
        setEditFormData((prev) => ({ ...prev, image: dataUrl }));
      } else {
        setFormData((prev) => ({ ...prev, image: dataUrl }));
      }
    } catch {
      setError('Failed to read image file.');
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok) {
        setMessage('Product added successfully!');
        setFormData({ title: '', category: 'Sofas', price: '', quantity: '', description: '', image: '' });
        setShowAddForm(false);
        fetchProductsList();
      } else {
        setError(data.message || 'Failed to add product.');
      }
    } catch (err) {
      setError('Network error while creating product.');
    }
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setEditFormData({
      title: product.title,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
      description: product.description || '',
      image: product.image || ''
    });
  };

  const handleEditSubmit = async (e, id) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(editFormData)
      });
      const data = await res.json();

      if (res.ok) {
        setMessage('Product updated successfully!');
        setEditingId(null);
        fetchProductsList();
      } else {
        setError(data.message || 'Failed to update product.');
      }
    } catch (err) {
      setError('Network error while updating product.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setMessage('');
    setError('');

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const data = await res.json();

      if (res.ok) {
        setMessage('Product deleted successfully!');
        fetchProductsList();
      } else {
        setError(data.message || 'Failed to delete product.');
      }
    } catch (err) {
      setError('Network error while deleting product.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="dash-page-content"
    >
      <div className="dash-page-header glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div className="dash-page-icon-wrap">
            <Package size={24} />
          </div>
          <div>
            <h2 className="dash-page-title">Products Inventory</h2>
            <p className="dash-page-subtitle">Track, add, edit, or delete items from catalog</p>
          </div>
        </div>
        {!showAddForm && (
          <button onClick={() => setShowAddForm(true)} className="header-btn-add" style={{ padding: '8px 16px', borderRadius: '10px' }}>
            <Plus size={14} />
            <span>New Product</span>
          </button>
        )}
      </div>

      {message && <div className="form-success-msg" style={{ margin: '16px 0' }}>{message}</div>}
      {error && <div className="form-error-msg" style={{ margin: '16px 0' }}>{error}</div>}

      {showAddForm && (
        <div className="dash-card glass" style={{ padding: '24px', margin: '24px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#fff', fontSize: '18px' }}>Add New Product</h3>
            <button onClick={() => setShowAddForm(false)} className="qty-btn-circle"><X size={14} /></button>
          </div>
          <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 200px' }} className="form-underlined-group">
                <input type="text" name="title" placeholder="Product Title" value={formData.title} onChange={handleInputChange} required />
              </div>
              <div style={{ flex: '1 1 200px' }} className="form-underlined-group select-wrapper">
                <select name="category" value={formData.category} onChange={handleInputChange}>
                  <option value="Sofas">Sofas</option>
                  <option value="Chairs">Chairs</option>
                  <option value="Bed">Beds</option>
                  <option value="Dressing Table">Dressing Tables</option>
                  <option value="Tables">Tables</option>
                  <option value="Wardrobes">Wardrobes</option>
                  <option value="Lighting">Lighting</option>
                  <option value="Decor">Decor</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 200px' }} className="form-underlined-group">
                <input type="number" name="price" placeholder="Price (USD)" value={formData.price} onChange={handleInputChange} required />
              </div>
              <div style={{ flex: '1 1 200px' }} className="form-underlined-group">
                <input type="number" name="quantity" placeholder="Stock Quantity" value={formData.quantity} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="form-underlined-group">
              <input type="text" name="image" placeholder="Image URL or upload below" value={formData.image} onChange={handleInputChange} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <label className="btn-outline" style={{ padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>
                Upload to Cloudinary
                <input type="file" accept="image/*" onChange={(e) => handleImageFile(e, false)} style={{ display: 'none' }} />
              </label>
              {formData.image && (
                <img src={formData.image} alt="Preview" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
              )}
            </div>
            <div className="form-underlined-group">
              <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} />
            </div>
            <button type="submit" className="btn-gold" style={{ padding: '10px 24px', alignSelf: 'flex-start', borderRadius: '10px' }}>Create Product</button>
          </form>
        </div>
      )}

      <div className="dash-page-grid card-span-12" style={{ display: 'block', marginTop: '24px' }}>
        <div className="dash-card glass" style={{ padding: '24px' }}>
          <h3 style={{ color: '#fff', marginBottom: '20px', fontSize: '18px', fontWeight: '500' }}>Furniture Inventory</h3>

          {loading ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading products inventory...</p>
          ) : products.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No products in database.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-secondary)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'left' }}>
                    <th style={{ padding: '12px 16px', color: '#fff', fontWeight: '500' }}>Item</th>
                    <th style={{ padding: '12px 16px', color: '#fff', fontWeight: '500' }}>Category</th>
                    <th style={{ padding: '12px 16px', color: '#fff', fontWeight: '500' }}>Price</th>
                    <th style={{ padding: '12px 16px', color: '#fff', fontWeight: '500' }}>Stock Qty</th>
                    <th style={{ padding: '12px 16px', color: '#fff', fontWeight: '500', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      {editingId === p._id ? (
                        /* Editing Row State */
                        <td colSpan="5" style={{ padding: '16px' }}>
                          <form onSubmit={(e) => handleEditSubmit(e, p._id)} style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
                            <input type="text" name="title" value={editFormData.title} onChange={handleEditInputChange} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '13px' }} required />
                            <select name="category" value={editFormData.category} onChange={handleEditInputChange} style={{ background: '#1c1c24', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '13px' }}>
                              <option value="Sofas">Sofas</option>
                              <option value="Chairs">Chairs</option>
                              <option value="Bed">Beds</option>
                              <option value="Dressing Table">Dressing Tables</option>
                              <option value="Tables">Tables</option>
                              <option value="Wardrobes">Wardrobes</option>
                              <option value="Lighting">Lighting</option>
                              <option value="Decor">Decor</option>
                            </select>
                            <input type="number" name="price" value={editFormData.price} onChange={handleEditInputChange} style={{ width: '80px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '13px' }} required />
                            <input type="number" name="quantity" value={editFormData.quantity} onChange={handleEditInputChange} style={{ width: '70px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '13px' }} required />
                            <label className="btn-outline" style={{ padding: '6px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>
                              Image
                              <input type="file" accept="image/*" onChange={(e) => handleImageFile(e, true)} style={{ display: 'none' }} />
                            </label>
                            {editFormData.image && (
                              <img src={editFormData.image} alt="Edit preview" style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }} />
                            )}
                            <button type="submit" className="btn-gold" style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '12px' }}>Save</button>
                            <button type="button" onClick={() => setEditingId(null)} className="btn-outline" style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '12px' }}>Cancel</button>
                          </form>
                        </td>
                      ) : (
                        /* Standard View Row State */
                        <>
                          <td style={{ padding: '16px', color: '#fff', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src={p.image} alt={p.title} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                            <span style={{ fontWeight: '500' }}>{p.title}</span>
                          </td>
                          <td style={{ padding: '16px' }}>{p.category}</td>
                          <td style={{ padding: '16px', color: 'var(--accent-gold)' }}>${p.price}</td>
                          <td style={{ padding: '16px', color: p.quantity === 0 ? '#f87171' : 'var(--text-secondary)' }}>
                            {p.quantity === 0 ? 'Out of Stock' : `${p.quantity} units`}
                          </td>
                          <td style={{ padding: '16px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                              <button onClick={() => startEdit(p)} className="cart-item-delete-btn" style={{ color: 'var(--accent-gold)' }} aria-label="Edit product">
                                <Edit2 size={15} />
                              </button>
                              <button onClick={() => handleDelete(p._id)} className="cart-item-delete-btn" aria-label="Delete product">
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
