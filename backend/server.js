const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Product = require('./models/Product');

// Route imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Body Parser Middleware
app.use(express.json());

// Robust CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman, or server-to-server)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.includes(origin) || 
                      origin.startsWith('http://localhost:') || 
                      origin.startsWith('http://127.0.0.1:') ||
                      origin.endsWith('.vercel.app');
                      
    if (isAllowed) {
      return callback(null, true);
    } else {
      console.warn(`Blocked by CORS: Origin ${origin} not in allowed list:`, allowedOrigins);
      return callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Connect to MongoDB
connectDB().then(async () => {
  // Database seed function
  try {
    const productCount = await Product.countDocuments();
    if (productCount < 20) {
      console.log('Seeding/Updating mockup products collection with expanded inventory...');
      
      // Delete existing to avoid duplicates on structure change
      await Product.deleteMany({});
      
      const seedProducts = [
        // Electronics
        {
          name: "SHOPEZ Premium Headphones",
          price: 99.99,
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60",
          description: "Experience premium sound quality with active noise cancellation, 40-hour battery life, and comfortable memory foam ear cups.",
          category: "Electronics",
          countInStock: 15
        },
        {
          name: "Minimalist Smart Watch",
          price: 199.99,
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60",
          description: "Track your fitness, receive notifications, and customize watch faces with this sleek, water-resistant aluminum smart watch.",
          category: "Electronics",
          countInStock: 20
        },
        {
          name: "Smart LED 4K Projector",
          price: 299.99,
          image: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&auto=format&fit=crop&q=60",
          description: "Create an immersive cinema experience at home with this 4K Ultra HD projector featuring built-in smart TV apps and Wi-Fi.",
          category: "Electronics",
          countInStock: 5
        },
        {
          name: "Wireless Mechanical Keyboard",
          price: 89.99,
          image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=60",
          description: "Ergonomic layout with mechanical switches, custom RGB backlighting, and Bluetooth connectivity for up to 3 devices.",
          category: "Electronics",
          countInStock: 12
        },
        {
          name: "Ergonomic Wireless Mouse",
          price: 49.99,
          image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=60",
          description: "Designed for all-day comfort, featuring precision tracking, programmable buttons, and an ultra-fast scroll wheel.",
          category: "Electronics",
          countInStock: 25
        },
        // Fashion
        {
          name: "Premium Leather Backpack",
          price: 129.99,
          image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=60",
          description: "Handcrafted from full-grain leather, this durable backpack features a padded laptop sleeve and multiple organization pockets.",
          category: "Fashion",
          countInStock: 8
        },
        {
          name: "Ultra-Comfort Running Sneakers",
          price: 89.99,
          image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60",
          description: "Engineered with breathable mesh and responsive cushioning, these shoes provide maximum comfort for workouts and daily wear.",
          category: "Fashion",
          countInStock: 12
        },
        {
          name: "Vintage Biker Leather Jacket",
          price: 179.99,
          image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=60",
          description: "A classic distressed black leather jacket with asymmetrical zippers and quilted shoulder patches for a rugged look.",
          category: "Fashion",
          countInStock: 7
        },
        {
          name: "Classic Polarized Sunglasses",
          price: 35.00,
          image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=60",
          description: "Shield your eyes in style with these timeless unisex polarized sunglasses featuring UV400 protection.",
          category: "Fashion",
          countInStock: 30
        },
        {
          name: "Minimalist Quartz Wristwatch",
          price: 75.00,
          image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&auto=format&fit=crop&q=60",
          description: "An elegant, minimalist watch with a genuine leather strap and water-resistant stainless steel casing.",
          category: "Fashion",
          countInStock: 15
        },
        // Home & Living
        {
          name: "Sleek Wood Desk Lamp",
          price: 45.00,
          image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=60",
          description: "Modern Nordic design desk lamp with adjustable arm and energy-efficient LED bulb. Perfect for office or bedroom.",
          category: "Home & Living",
          countInStock: 10
        },
        {
          name: "Automatic Espresso Coffee Machine",
          price: 249.99,
          image: "https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?w=600&auto=format&fit=crop&q=60",
          description: "Brew rich, barista-quality espresso, cappuccinos, and lattes at home with a 15-bar pressure pump and integrated steam wand.",
          category: "Home & Living",
          countInStock: 5
        },
        {
          name: "Aromatic Essential Oil Diffuser",
          price: 29.99,
          image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=60",
          description: "Ultrasonic cool mist humidifier with 7-color ambient LED lights and automatic shut-off to freshen any room.",
          category: "Home & Living",
          countInStock: 40
        },
        {
          name: "Non-Stick Ceramic Cookware Set",
          price: 149.99,
          image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=60",
          description: "10-piece eco-friendly ceramic non-stick cookware set including frying pans, pots, and lids. Free of PFOA, lead, and cadmium.",
          category: "Home & Living",
          countInStock: 6
        },
        {
          name: "Handwoven Boho Area Rug",
          price: 110.00,
          image: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=600&auto=format&fit=crop&q=60",
          description: "Add warmth to your living room or bedroom with this high-quality, geometric patterned Bohemian tassel rug.",
          category: "Home & Living",
          countInStock: 10
        },
        // Books
        {
          name: "Inspiring Fiction Novel Book",
          price: 14.99,
          image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=60",
          description: "A gripping bestseller novel about mystery, discovery, and resilience. A must-read addition to your personal library.",
          category: "Books",
          countInStock: 25
        },
        {
          name: "The Great Gatsby (Collector Edition)",
          price: 19.99,
          image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=60",
          description: "F. Scott Fitzgerald's famous masterpiece, bound in a premium hard-cover collector's edition with gold-embossed details.",
          category: "Books",
          countInStock: 15
        },
        {
          name: "Cooking Masterclass Cookbook",
          price: 24.99,
          image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&auto=format&fit=crop&q=60",
          description: "Featuring over 100 chef-designed recipes, visual step-by-step plating tutorials, and culinary techniques for home chefs.",
          category: "Books",
          countInStock: 18
        },
        {
          name: "Modern Entrepreneurship Guide",
          price: 22.50,
          image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop&q=60",
          description: "A practical guide to launching a startup, building a digital brand, and scaling business structures in the modern age.",
          category: "Books",
          countInStock: 22
        }
      ];

      await Product.insertMany(seedProducts);
      console.log('Seeded database with expanded 20 product catalog successfully.');
    } else {
      console.log(`Product collection already has ${productCount} records. Skipping seeding.`);
    }
  } catch (seedErr) {
    console.error(`Database seeding failed: ${seedErr.message}`);
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('SHOPEZ API Server is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`Unhandled server error: ${err.message}`);
  res.status(500).json({ success: false, message: 'Server error encountered' });
});

// Define Server Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`SHOPEZ SERVER RUNNING`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Port: ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}`);
  console.log(`=========================================`);
});
