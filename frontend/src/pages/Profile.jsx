import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { LogOut, Package, Mail, Calendar, UserCheck } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  // Mock past orders list for premium aesthetic
  const mockOrders = [
    { id: 'ORD-98721', date: '2026-05-14', total: '$144.98', status: 'Delivered' },
    { id: 'ORD-95412', date: '2026-04-02', total: '$89.99', status: 'Delivered' }
  ];

  return (
    <div className="container animate-fade-in">
      <div className="profile-container">
        
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="profile-meta">
            <h2>{user.name}</h2>
            <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <UserCheck size={16} color="var(--primary)" /> Verified Customer
            </p>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="profile-info-grid">
          <div className="profile-info-box">
            <label>
              <Mail size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> 
              Email Address
            </label>
            <p>{user.email}</p>
          </div>
          
          <div className="profile-info-box">
            <label>
              <Calendar size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> 
              Member Since
            </label>
            <p>{new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        {/* Stats Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
          <div style={{ padding: '24px', background: 'var(--primary-light)', border: '1px solid var(--primary-glow)', borderRadius: '14px', textAlign: 'center' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', display: 'block' }}>{cartCount}</span>
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Items in Cart</span>
          </div>

          <div style={{ padding: '24px', background: 'var(--accent-light)', border: '1px solid rgba(236, 72, 153, 0.1)', borderRadius: '14px', textAlign: 'center' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent)', display: 'block' }}>{wishlistItems.length}</span>
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Items in Wishlist</span>
          </div>
        </div>

        {/* Mock Order History */}
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Package size={20} color="var(--primary)" /> Past Order History
          </h3>
          
          <div style={{ border: '1px solid var(--border-color)', borderRadius: '14px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Order ID</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Date</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Total Price</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockOrders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 'bold' }}>{order.id}</td>
                    <td style={{ padding: '12px 16px' }}>{order.date}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{order.total}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Logout button */}
        <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%', gap: '8px', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
          <LogOut size={18} /> Sign Out of Account
        </button>

      </div>
    </div>
  );
};

export default Profile;
