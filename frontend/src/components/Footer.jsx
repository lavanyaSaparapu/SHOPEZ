import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h2>🛍️ SHOPEZ</h2>
            <p>Your one-stop destination for premium, high-quality products. Experience seamless shopping, instant wishlisting, and lightning-fast checkout with our modern, secure design system.</p>
          </div>
          
          <div className="footer-col">
            <h3>Shop Categories</h3>
            <ul>
              <li><Link to="/?category=Electronics">Electronics</Link></li>
              <li><Link to="/?category=Fashion">Fashion</Link></li>
              <li><Link to="/?category=Home%20%26%20Living">Home & Living</Link></li>
              <li><Link to="/?category=Books">Books</Link></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h3>Customer Service</h3>
            <ul>
              <li><Link to="/profile">My Account</Link></li>
              <li><Link to="/cart">Shopping Cart</Link></li>
              <li><Link to="/wishlist">Wishlist</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} SHOPEZ Inc. All rights reserved.</p>
          <p>Made with ❤️ for a premium shopping experience</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
