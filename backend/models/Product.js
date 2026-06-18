const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide a product price'],
    min: [0, 'Price must be a positive number']
  },
  image: {
    type: String,
    required: [true, 'Please provide a product image URL']
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description']
  },
  category: {
    type: String,
    required: [true, 'Please provide a product category'],
    trim: true
  },
  countInStock: {
    type: Number,
    required: true,
    default: 10,
    min: [0, 'Stock cannot be negative']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);
