import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const isFavorited = isInWishlist(product._id);

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await toggleWishlist(product);
    if (res.success) {
      showToast(res.message);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    const res = await addToCart(product, 1);
    setAdding(false);
    if (res.success) {
      showToast('Added to Cart!');
    }
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 2000);
  };

  return (
    <div className="product-card animate-fade-in">
      {toastMessage && (
        <div className="notification success" style={{ position: 'absolute', bottom: '10px', left: '10px', right: '10px', zIndex: 20, transform: 'none', opacity: 1, padding: '8px 12px', fontSize: '0.85rem' }}>
          {toastMessage}
        </div>
      )}
      
      <button 
        onClick={handleWishlistClick} 
        className="wishlist-toggle" 
        aria-label="Toggle Wishlist"
      >
        <Heart 
          size={18} 
          color={isFavorited ? "var(--accent)" : "var(--text-light)"} 
          fill={isFavorited ? "var(--accent)" : "none"} 
        />
      </button>

      <Link to={`/product/${product._id}`}>
        <div className="product-image-container">
          <img src={product.image} alt={product.name} loading="lazy" />
        </div>
      </Link>

      <div className="product-info">
        <div>
          <span className="product-category">{product.category}</span>
          <Link to={`/product/${product._id}`}>
            <h3 className="product-name" title={product.name}>{product.name}</h3>
          </Link>
        </div>

        <div className="product-row">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button 
            onClick={handleAddToCart} 
            className="btn btn-icon" 
            disabled={adding}
            aria-label="Add to Cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
