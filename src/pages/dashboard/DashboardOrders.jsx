import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function formatPaymentMethod(method) {
  const raw = String(method || '').trim();
  const key = raw.toLowerCase();
  if (!raw || key === 'cod' || key.includes('cash')) return 'Cash on Delivery';
  if (key === 'card' || key === 'bank card' || key === 'credit card') return 'Card';
  if (key.includes('easy')) return 'EasyPaisa';
  if (key.includes('jazz')) return 'JazzCash';
  if (key.includes('naya')) return 'NayaPay';
  if (key.includes('sada')) return 'SadaPay';
  // legacy mis-label: do not treat random strings containing "card" inside other words
  if (key.includes('bank') && key.includes('card')) return 'Card';
  return raw;
}

export default function DashboardOrders() {
  const { token } = useAuth();
  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.status === 'success' || data.success) {
        let list = data.data || [];

        // Repair known mis-tagged COD order from earlier bug
        const bad = list.find(
          (o) =>
            o.trackingId === 'ALI-320017' &&
            /bank\s*card|card/i.test(String(o.paymentMethod || '')) &&
            !/cash/i.test(String(o.paymentMethod || ''))
        );
        if (bad) {
          try {
            const fixRes = await fetch(`/api/orders/fix-payment/ALI-320017`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                paymentMethod: 'Cash on Delivery',
                paymentStatus: 'Pending',
              }),
            });
            if (fixRes.ok) {
              const fixed = await fixRes.json();
              list = list.map((o) => (o.trackingId === 'ALI-320017' ? fixed.data : o));
            }
          } catch {
            /* ignore repair failure */
          }
        }

        setOrdersList(list);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setMessage('');
    setError('');
    try {
      const res = await fetch(`/api/orders/status/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentStatus: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`Order payment status set to ${newStatus}.`);
        fetchOrders();
      } else {
        setError(data.message || 'Failed to update order.');
      }
    } catch {
      setError('Network error updating status.');
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Delete this order permanently?')) return;
    setMessage('');
    setError('');
    try {
      const headers = { Authorization: `Bearer ${token}` };
      let res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE', headers });
      if (res.status === 404 || res.status === 405) {
        res = await fetch(`/api/orders/delete/${orderId}`, { method: 'POST', headers });
      }

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        setError('Delete API not reachable. Restart backend: cd project && npm run dev:all');
        return;
      }

      const data = await res.json();
      if (res.ok) {
        setMessage('Order deleted.');
        setOrdersList((prev) => prev.filter((o) => o._id !== orderId));
      } else {
        setError(data.message || 'Failed to delete order.');
      }
    } catch (err) {
      setError(err.message || 'Network error deleting order.');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="dash-page-content">
      <div className="dash-page-header glass">
        <div className="dash-page-icon-wrap" style={{ color: 'var(--accent-blue)', borderColor: 'var(--accent-blue-semi)' }}>
          <ShoppingBag size={24} />
        </div>
        <div>
          <h2 className="dash-page-title">Orders Management</h2>
          <p className="dash-page-subtitle">Track orders, shipping addresses, payment details, and toggle verification flags</p>
        </div>
      </div>

      {message && <div className="form-success-msg" style={{ marginTop: '20px' }}>{message}</div>}
      {error && <div className="form-error-msg" style={{ marginTop: '20px' }}>{error}</div>}

      <div className="dash-page-grid card-span-12" style={{ display: 'block', marginTop: '24px' }}>
        <div className="dash-card glass" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>Customer Orders</h3>

          {loading ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading orders...</p>
          ) : ordersList.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No orders found.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-secondary)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                    <th style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: '600' }}>Tracking ID</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: '600' }}>Gmail</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: '600' }}>Items</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: '600' }}>Total Amount</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: '600' }}>Method</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: '600' }}>Status</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: '600', textAlign: 'center' }}>Modify Status</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: '600', textAlign: 'center' }}>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersList.map((order) => {
                    const methodLabel = formatPaymentMethod(order.paymentMethod);
                    return (
                      <tr key={order._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                        <td style={{ padding: '16px', color: 'var(--text-primary)', fontWeight: '600' }}>{order.trackingId}</td>
                        <td style={{ padding: '16px' }}>{order.email}</td>
                        <td style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {(order.items || []).map((item, idx) => (
                              <span key={idx} style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                {item.title} (x{item.quantity})
                              </span>
                            ))}
                          </div>
                        </td>
                        <td style={{ padding: '16px', color: 'var(--text-primary)' }}>${order.totalAmount}</td>
                        <td style={{ padding: '16px' }}>
                          <span style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 600 }}>
                            {methodLabel}
                          </span>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span className={`variant-tag ${order.paymentStatus === 'Paid' ? 'active' : ''}`} style={{ fontSize: '10px' }}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <select
                            value={order.paymentStatus}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            style={{
                              backgroundColor: 'var(--bg-tertiary)',
                              color: 'var(--text-primary)',
                              border: '1px solid var(--glass-border)',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              cursor: 'pointer',
                            }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Failed">Failed</option>
                          </select>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleDelete(order._id)}
                            title="Delete order"
                            style={{
                              background: 'rgba(239,68,68,0.1)',
                              border: '1px solid rgba(239,68,68,0.3)',
                              color: '#ef4444',
                              borderRadius: '8px',
                              padding: '6px 10px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
