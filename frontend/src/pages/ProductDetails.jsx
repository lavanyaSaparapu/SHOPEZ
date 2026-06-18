import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Heart, ShoppingBag, ArrowLeft, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import API_BASE_URL from '../config';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingCart, setAddingCart] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API_BASE_URL}/products/${id}`);
      if (res.data.success) {
        setProduct(res.data.product);
      } else {
        setError(res.data.message || 'Product not found');
      }
    } catch (err) {
      console.error('Fetch product details error:', err.message);
      setError(err.response?.data?.message || 'Failed to retrieve product details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAddingCart(true);
    const res = await addToCart(product, quantity);
    setAddingCart(false);
    if (res.success) {
      showToast(`Added ${quantity} item(s) to Cart!`);
    } else {
      showToast(res.message || 'Failed to add item to Cart');
    }
  };

  const handleWishlistToggle = async () => {
    if (!product) return;
    const res = await toggleWishlist(product);
    if (res.success) {
      showToast(res.message);
    }
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 2500);
  };

  const isFavorited = product ? isInWishlist(product._id) : false;

  // Loader Skeleton
  if (loading) {
    return (
      <div className="container animate-fade-in" style={{ marginTop: '24px' }}>
        <div className="details-container">
          <div className="skeleton" style={{ height: '450px', borderRadius: '14px' }}></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center' }}>
            <div className="skeleton" style={{ height: '20px', width: '30%' }}></div>
            <div className="skeleton" style={{ height: '40px', width: '90%' }}></div>
            <div className="skeleton" style={{ height: '30px', width: '40%' }}></div>
            <div className="skeleton" style={{ height: '100px', width: '100%' }}></div>
            <div className="skeleton" style={{ height: '50px', width: '60%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Error page
  if (error) {
    return (
      <div className="container animate-fade-in" style={{ marginTop: '40px' }}>
        <div className="error-container">
          <h3>Product Details Error</h3>
          <p>{error}</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/" className="btn btn-secondary" style={{ gap: '8px' }}>
              <ArrowLeft size={16} /> Back to Shop
            </Link>
            <button onClick={fetchProductDetails} className="btn btn-primary" style={{ gap: '8px' }}>
              <RotateCcw size={16} /> Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="container animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="notification success" style={{ opacity: 1, transform: 'none' }}>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Back button */}
      <Link to="/" className="btn btn-secondary" style={{ marginBottom: '24px', display: 'inline-flex', padding: '8px 16px', fontSize: '0.9rem' }}>
        <ArrowLeft size={16} /> Back to Shop
      </Link>

      <div className="details-container">
        {/* Gallery/Image Frame */}
        <div className="details-gallery">
          <img src={product.image} alt={product.name} />
        </div>

        {/* Product Information */}
        <div className="details-info">
          <span className="details-category">{product.category}</span>
          <h1 className="details-name">{product.name}</h1>
          <p className="details-price">${product.price.toFixed(2)}</p>

          <p className="details-description">{product.description}</p>

          {/* Metadata details */}
          <div className="details-meta">
            <div className="meta-item">
              <span className="meta-label">Availability:</span>
              <span style={{ color: product.countInStock > 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold' }}>
                {product.countInStock > 0 ? `In Stock (${product.countInStock} left)` : 'Out of Stock'}
              </span>
            </div>
            
            <div className="meta-item">
              <Truck size={16} color="var(--text-secondary)" />
              <span>Free Delivery on orders over $50</span>
            </div>
            <div className="meta-item">
              <ShieldCheck size={16} color="var(--text-secondary)" />
              <span>2 Year Manufacturer Warranty</span>
            </div>
          </div>

          {/* Interactive controls */}
          {product.countInStock > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <span className="meta-label">Quantity:</span>
              <div className="cart-item-qty" style={{ padding: '6px 12px' }}>
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                  className="qty-btn"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="qty-value" style={{ fontSize: '1.05rem', minWidth: '25px' }}>{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => Math.min(product.countInStock, q + 1))} 
                  className="qty-btn"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="details-actions">
            <button
              onClick={handleAddToCart}
              className="btn btn-primary"
              style={{ flexGrow: 1, padding: '14px 24px' }}
              disabled={product.countInStock === 0 || addingCart}
            >
              <ShoppingBag size={18} /> {addingCart ? 'Adding...' : 'Add to Cart'}
            </button>
            
            <button
              onClick={handleWishlistToggle}
              className="btn btn-secondary"
              style={{ padding: '14px 18px', borderColor: isFavorited ? 'var(--accent)' : '' }}
              aria-label="Toggle Wishlist"
            >
              <Heart 
                size={18} 
                color={isFavorited ? "var(--accent)" : "var(--text-secondary)"} 
                fill={isFavorited ? "var(--accent)" : "none"} 
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
