import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, loading, error } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const shippingCost = cartTotal > 50 || cartTotal === 0 ? 0 : 9.99;
  const taxCost = cartTotal * 0.08;
  const orderTotal = cartTotal + shippingCost + taxCost;

  const handleCheckout = () => {
    setCheckingOut(true);
    setTimeout(() => {
      setCheckingOut(false);
      setSuccessMsg('Order Placed Successfully! Thank you for shopping with SHOPEZ.');
      // Simulate emptying cart by removing each item (or just show success)
      cartItems.forEach(item => removeFromCart(item.product._id));
    }, 2000);
  };

  if (loading && cartItems.length === 0) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in">
      {successMsg && (
        <div className="notification success" style={{ opacity: 1, transform: 'none', position: 'static', marginBottom: '24px', maxWidth: '100%' }}>
          <span>🎉 {successMsg}</span>
        </div>
      )}

      {error && (
        <div className="notification error" style={{ opacity: 1, transform: 'none', position: 'static', marginBottom: '24px', maxWidth: '100%' }}>
          <span>⚠️ {error}</span>
        </div>
      )}

      <h1 style={{ marginBottom: '8px' }}>Your Shopping Cart</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
        Review your items and proceed to checkout.
      </p>

      {cartItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <ShoppingBag size={48} />
          </div>
          <h3>Your Cart is Empty</h3>
          <p>You haven't added any items to your shopping cart yet. Explore our featured collection to get started!</p>
          <Link to="/" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-grid">
          {/* Cart Items List */}
          <div className="cart-items-container">
            <h2 className="cart-title">Cart Items ({cartItems.length})</h2>
            
            {cartItems.map((item) => (
              <div key={item.product._id} className="cart-item">
                <img 
                  src={item.product.image} 
                  alt={item.product.name} 
                  className="cart-item-image" 
                />
                
                <div className="cart-item-details">
                  <span className="cart-item-category">{item.product.category}</span>
                  <h3 className="cart-item-name">
                    <Link to={`/product/${item.product._id}`}>{item.product.name}</Link>
                  </h3>
                  <span className="cart-item-price">${item.product.price.toFixed(2)}</span>
                </div>

                {/* Quantity adjustments */}
                <div className="cart-item-qty">
                  <button 
                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)} 
                    className="qty-btn"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)} 
                    className="qty-btn"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Delete button */}
                <button 
                  onClick={() => removeFromCart(item.product._id)} 
                  className="btn-icon"
                  style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                  aria-label="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary Panel */}
          <div className="cart-summary-card">
            <h2 className="cart-title">Order Summary</h2>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>${cartTotal.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
              </span>
            </div>
            
            <div className="summary-row">
              <span>Estimated Tax (8%)</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>${taxCost.toFixed(2)}</span>
            </div>

            {shippingCost > 0 && (
              <p style={{ fontSize: '0.8rem', color: 'var(--primary)', marginBottom: '16px' }}>
                💡 Add <b>${(50 - cartTotal).toFixed(2)}</b> more to unlock FREE shipping!
              </p>
            )}
            
            <div className="summary-row total">
              <span>Total</span>
              <span>${orderTotal.toFixed(2)}</span>
            </div>

            <button 
              onClick={handleCheckout} 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '20px', gap: '8px' }}
              disabled={checkingOut}
            >
              {checkingOut ? 'Processing Checkout...' : 'Proceed to Checkout'} <ArrowRight size={16} />
            </button>

            <Link 
              to="/" 
              className="btn btn-secondary" 
              style={{ width: '100%', marginTop: '12px', gap: '8px' }}
            >
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
