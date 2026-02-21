const mongoose = require("mongoose");

/**
 * User Schema
 * This defines the structure of the 'User' document in MongoDB.
 * We include fields for general info, authentication roles, 
 * and the OTP/Verification flow.
 */
const userSchema = new mongoose.Schema({
    // User credentials
    email: {
        type: String,
        unique: true,
        lowercase: true,
        // Email is optional during initial signup if phone is provided
    },

    phone: {
        type: String,
        unique: true,
        // Phone is optional during initial signup if email is provided
    },

    password: {
        type: String,
        required: true,
    },

    // User Roles: Customer or Admin
    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer",
    },

    // Verification Flow
    isVerified: {
        type: Boolean,
        default: false,
    },

    otp: {
        type: String, // Store the 4-6 digit OTP code
    },

    otpExpires: {
        type: Date, // Timestamp for when the OTP becomes invalid
    },

    // Referral System
    referralCode: {
        type: String,
        unique: true, // Every user gets a unique referral code
    },

    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Stores the ID of the user who referred them
    }

}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Export the model so it can be used in other files
module.exports = mongoose.model("User", userSchema);