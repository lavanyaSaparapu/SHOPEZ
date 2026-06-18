const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to find or create cart for a user
const getOrCreateUserCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateUserCart(req.user._id);
    const populatedCart = await cart.populate('items.product');
    res.json({ success: true, cart: populatedCart });
  } catch (error) {
    console.error(`Get cart error: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server error retrieving cart' });
  }
};

// @desc    Add product to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const qty = Number(quantity) || 1;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const cart = await getOrCreateUserCart(req.user._id);

    // Check if product already exists in cart
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      // Product exists, increment quantity
      cart.items[itemIndex].quantity += qty;
    } else {
      // Product does not exist, add new item
      cart.items.push({ product: productId, quantity: qty });
    }

    await cart.save();
    const populatedCart = await cart.populate('items.product');

    res.status(200).json({ success: true, cart: populatedCart });
  } catch (error) {
    console.error(`Add to cart error: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server error adding to cart' });
  }
};

// @desc    Update quantity of product in cart
// @route   PUT /api/cart
// @access  Private
const updateCartQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const qty = Number(quantity);

    if (!productId || isNaN(qty)) {
      return res.status(400).json({ success: false, message: 'Product ID and numeric quantity are required' });
    }

    const cart = await getOrCreateUserCart(req.user._id);
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Product not found in cart' });
    }

    if (qty <= 0) {
      // Remove item if quantity is set to 0 or negative
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = qty;
    }

    await cart.save();
    const populatedCart = await cart.populate('items.product');

    res.status(200).json({ success: true, cart: populatedCart });
  } catch (error) {
    console.error(`Update cart quantity error: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server error updating cart quantity' });
  }
};

// @desc    Remove product from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const cart = await getOrCreateUserCart(req.user._id);

    cart.items = cart.items.filter(item => item.product.toString() !== productId);

    await cart.save();
    const populatedCart = await cart.populate('items.product');

    res.status(200).json({ success: true, cart: populatedCart });
  } catch (error) {
    console.error(`Remove from cart error: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server error removing product from cart' });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart
};
