import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, RotateCcw } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import API_BASE_URL from '../config';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = ['All', 'Electronics', 'Fashion', 'Home & Living', 'Books'];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query string
      let url = `${API_BASE_URL}/products`;
      const params = {};
      if (category && category !== 'All') {
        params.category = category;
      }
      if (search.trim()) {
        params.search = search;
      }

      const res = await axios.get(url, { params });
      if (res.data.success) {
        setProducts(res.data.products);
      } else {
        setError(res.data.message || 'Failed to fetch products');
      }
    } catch (err) {
      console.error('Fetch products error:', err.message);
      setError(err.response?.data?.message || 'Server connection failed. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when category changes, or search input commits
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 400); // Debounce search requests to avoid flooding backend

    return () => clearTimeout(delayDebounceFn);
  }, [category, search]);

  return (
    <div className="container animate-fade-in">
      {/* Hero Banner Section */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1>Discover the Best Deals at <span>SHOPEZ</span></h1>
          <p>Find premium electronics, stylish apparel, cozy home items, and literary masterpieces, curated just for you.</p>
          <button 
            onClick={() => { setCategory('All'); setSearch(''); }} 
            className="btn btn-primary"
          >
            Shop Now
          </button>
        </div>
        <div className="hero-graphic">
          <img src="https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600&auto=format&fit=crop&q=60" alt="SHOPEZ Products Banner" />
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="controls-bar">
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="categories-wrapper">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`category-btn ${category === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Loading Skeleton State */}
      {loading && (
        <div className="product-grid">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="skeleton-product-card">
              <div className="skeleton skeleton-image"></div>
              <div className="skeleton skeleton-text" style={{ marginTop: '10px' }}></div>
              <div className="skeleton skeleton-text-short"></div>
              <div className="skeleton skeleton-text" style={{ marginTop: '10px', height: '35px', borderRadius: '8px' }}></div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="error-container">
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button onClick={fetchProducts} className="btn btn-primary" style={{ gap: '8px' }}>
            <RotateCcw size={16} /> Retry Connection
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && products.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No Products Found</h3>
          <p>We couldn't find any products matching your current search or category filter. Try clearing filters or searching for something else!</p>
          <button 
            onClick={() => { setCategory('All'); setSearch(''); }} 
            className="btn btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Product Grid State */}
      {!loading && !error && products.length > 0 && (
        <section className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </section>
      )}
    </div>
  );
};

export default Home;
