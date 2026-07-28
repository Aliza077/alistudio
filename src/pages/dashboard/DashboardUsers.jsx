import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, CircleDot, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function DashboardUsers() {
  const { fetchUsers, usersList, deleteUser, updateUserRole, user: currentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers().finally(() => setLoading(false));
  }, []);

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to permanently delete this user account?")) {
      const res = await deleteUser(userId);
      if (!res.success) {
        alert(res.message || "Failed to delete user.");
      }
    }
  };

  const handleRoleChange = async (userId, urole) => {
    const id = userId?._id || userId?.id || userId;
    const res = await updateUserRole(id, urole);
    if (!res.success) {
      alert(res.message || 'Failed to update role.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="dash-page-content"
    >
      <div className="dash-page-header glass">
        <div className="dash-page-icon-wrap">
          <Users size={24} />
        </div>
        <div>
          <h2 className="dash-page-title">User Accounts</h2>
          <p className="dash-page-subtitle">Manage all registered users, roles, and contacts</p>
        </div>
      </div>

      <div className="dash-page-grid card-span-12" style={{ display: 'block', marginTop: '24px' }}>
        <div className="dash-card glass" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>Registered Members</h3>
          
          {loading ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading users list...</p>
          ) : usersList.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No registered users found.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-secondary)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                    <th style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: '600' }}>Name</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: '600' }}>Email</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: '600' }}>Phone</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: '600' }}>Role</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: '600' }}>Status</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: '600', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((usr) => (
                    <tr key={usr._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '16px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {usr.image ? (
                          <img src={usr.image} alt={usr.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Users size={14} />
                          </div>
                        )}
                        <span style={{ fontWeight: '500' }}>{usr.name}</span>
                      </td>
                      <td style={{ padding: '16px' }}>{usr.email}</td>
                      <td style={{ padding: '16px' }}>{usr.phone || 'N/A'}</td>
                      <td style={{ padding: '16px' }}>
                        <select
                          value={usr.urole || 'user'}
                          onChange={(e) => handleRoleChange(usr._id || usr.id, e.target.value)}
                          disabled={String(currentUser?.id) === String(usr._id || usr.id) || String(currentUser?._id) === String(usr._id || usr.id)}
                          style={{
                            background: 'var(--bg-tertiary)',
                            border: '1px solid var(--glass-border)',
                            color: 'var(--text-primary)',
                            padding: '6px 10px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                          title="Admin only — change member role"
                        >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: usr.isactive ? '#10b981' : '#ef4444' }}>
                          <CircleDot size={10} />
                          {usr.isactive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <button
                          onClick={() => {
                            if (currentUser?.id !== usr._id && currentUser?._id !== usr._id) {
                              handleDelete(usr._id);
                            }
                          }}
                          disabled={currentUser?.id === usr._id || currentUser?._id === usr._id}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: (currentUser?.id === usr._id || currentUser?._id === usr._id) ? 'var(--text-muted)' : '#ef4444',
                            cursor: (currentUser?.id === usr._id || currentUser?._id === usr._id) ? 'not-allowed' : 'pointer',
                            padding: '6px',
                            borderRadius: '6px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease',
                            backgroundColor: (currentUser?.id === usr._id || currentUser?._id === usr._id) ? 'transparent' : 'rgba(239, 68, 68, 0.05)',
                            opacity: (currentUser?.id === usr._id || currentUser?._id === usr._id) ? 0.4 : 1
                          }}
                          className="user-delete-btn"
                          title={currentUser?.id === usr._id || currentUser?._id === usr._id ? "Current Session (Cannot Delete)" : "Delete User"}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
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
