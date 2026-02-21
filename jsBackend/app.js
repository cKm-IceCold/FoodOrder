// Load environment variables from .env
require('dotenv').config();

// Import express
const express = require('express');
const app = express();

// Import database connection
const connectDB = require('./database/connect');

// Import routes
const authRoutes = require('./routes/authRoutes');
const foodRoutes = require('./routes/foodRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Connect to MongoDB
connectDB();

// Middleware to parse JSON bodies (Required to read req.body)
app.use(express.json());

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/orders', orderRoutes);

// Test route to check server is running
app.get('/', (req, res) => {
  res.send('Server is running! 🎉');
});

// Start server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});