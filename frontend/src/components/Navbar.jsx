import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, User, LogOut, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header-nav glass">
      <div className="container navbar-container">
        <Link to="/" className="logo">
          🛍️ <span>SHOPEZ</span>
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <Home size={18} /> Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/wishlist" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <Heart size={18} /> Wishlist
                {wishlistItems.length > 0 && <span className="badge">{wishlistItems.length}</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/cart" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <ShoppingBag size={18} /> Cart
                {cartCount > 0 && <span className="badge">{cartCount}</span>}
              </NavLink>
            </li>
            {user ? (
              <>
                <li>
                  <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    <User size={18} /> Profile
                  </NavLink>
                </li>
                <li>
                  <button onClick={handleLogout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                    <LogOut size={18} /> Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <NavLink to="/login" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                  <User size={18} /> Login
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
