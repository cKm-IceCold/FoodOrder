const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully! ✅');
  } catch (error) {
    console.error('⚠️ MongoDB connection error:', error.message);
    console.log('Server is still running, but database features will fail until connected.');
    // process.exit(1); // commented out so server stays online for testing
  }
}

module.exports = connectDB;
