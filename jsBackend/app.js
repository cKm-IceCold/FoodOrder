// Load environment variables from .env
require('dotenv').config();

// Import express
const express = require('express');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Test route to check server is running
app.get('/', (req, res) => {
  res.send('Server is running! 🎉');
});

// Start server on port 3000
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

app.post('/signup', (req, res) => {
  const { email, phone, password } = req.body;

  // Basic validation
  if (!email && !phone) {
    return res.status(400).json({ error: "Email or phone is required" });
  }

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  // For now, we just return success
  res.status(200).json({ message: "Signup validation passed" });
});


// Import database connection
const connectDB = require('./database/connect');

// Connect to MongoDB
connectDB();

app.get('/', (req, res) => {
  res.send('Server is running! 🎉');
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});