const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with Bearer
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'shopez_secret_key_123456_secure');

      // Get user from the token, exclude password
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found, authorization denied' });
      }

      next();
    } catch (error) {
      console.error(`Auth Middleware Error: ${error.message}`);
      res.status(401).json({ success: false, message: 'Token invalid or expired, authorization denied' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'No token provided, authorization denied' });
  }
};

module.exports = { protect };
