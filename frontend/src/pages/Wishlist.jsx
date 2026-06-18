import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const { wishlistItems, loading, error } = useWishlist();

  if (loading && wishlistItems.length === 0) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in">
      {error && (
        <div className="notification error" style={{ opacity: 1, transform: 'none', position: 'static', marginBottom: '24px', maxWidth: '100%' }}>
          <span>⚠️ {error}</span>
        </div>
      )}

      <h1 style={{ marginBottom: '8px' }}>Your Wishlist</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
        Keep track of items you love and add them to your cart at any time.
      </p>

      {wishlistItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon" style={{ color: 'var(--accent)' }}>
            <Heart size={48} fill="var(--accent)" />
          </div>
          <h3>Your Wishlist is Empty</h3>
          <p>You haven't favorited any products yet. Browse through our products and click the heart icon to save items here!</p>
          <Link to="/" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <section className="product-grid">
          {wishlistItems.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </section>
      )}
    </div>
  );
};

export default Wishlist;
