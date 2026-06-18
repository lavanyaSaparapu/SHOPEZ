const express = require('express');
const router = express.Router();
const { getWishlist, toggleWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

// All wishlist routes require authentication
router.use(protect);

router.route('/')
  .get(getWishlist)
  .post(toggleWishlist);

module.exports = router;
