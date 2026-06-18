const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// Helper to get or create wishlist
const getOrCreateUserWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
  }
  return wishlist;
};

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
  try {
    const wishlist = await getOrCreateUserWishlist(req.user._id);
    const populatedWishlist = await wishlist.populate('products');
    res.json({ success: true, wishlist: populatedWishlist });
  } catch (error) {
    console.error(`Get wishlist error: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server error retrieving wishlist' });
  }
};

// @desc    Toggle product in wishlist (add if not present, remove if present)
// @route   POST /api/wishlist
// @access  Private
const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const wishlist = await getOrCreateUserWishlist(req.user._id);

    const productIndex = wishlist.products.findIndex(id => id.toString() === productId);

    let message = '';
    if (productIndex > -1) {
      // Product is already in wishlist, remove it
      wishlist.products.splice(productIndex, 1);
      message = 'Product removed from wishlist';
    } else {
      // Product is not in wishlist, add it
      wishlist.products.push(productId);
      message = 'Product added to wishlist';
    }

    await wishlist.save();
    const populatedWishlist = await wishlist.populate('products');

    res.status(200).json({ success: true, message, wishlist: populatedWishlist });
  } catch (error) {
    console.error(`Toggle wishlist error: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server error toggling wishlist' });
  }
};

module.exports = {
  getWishlist,
  toggleWishlist
};
