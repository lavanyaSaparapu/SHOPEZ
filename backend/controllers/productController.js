const Product = require('../models/Product');

// @desc    Get all products (with category filter and search search)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    // Filter by category if provided
    if (category && category !== 'All') {
      query.category = category;
    }

    // Search by name or description if search query is provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query);
    res.json({ success: true, products });
  } catch (error) {
    console.error(`Get products error: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server error retrieving products' });
  }
};

// @desc    Get single product details
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json({ success: true, product });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    console.error(`Get product by ID error: ${error.message}`);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(500).json({ success: false, message: 'Server error retrieving product details' });
  }
};

// @desc    Create a product (for seeding / admin testing)
// @route   POST /api/products
// @access  Public (or Protected, but Public here for testing)
const createProduct = async (req, res) => {
  try {
    const { name, price, image, description, category, countInStock } = req.body;

    if (!name || !price || !image || !description || !category) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const product = await Product.create({
      name,
      price,
      image,
      description,
      category,
      countInStock: countInStock || 10
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error(`Create product error: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server error creating product' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct
};
