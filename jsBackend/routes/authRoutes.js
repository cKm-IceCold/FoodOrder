const express = require("express");
const router = express.Router();

// Import the User model
const User = require("../models/User");

// Import authentication utilities
const { generateOTP, generateReferralCode, sendOTP } = require("../utils/authUtils");

/**
 * POST /api/auth/signup
 * Handles user registration using Email or Phone.
 * Optionally accepts a referral code.
 */
router.post("/signup", async (req, res) => {
    try {
        const { email, phone, password, referredByCode } = req.body;

        // 1. Basic validation
        if (!email && !phone) {
            return res.status(400).json({ message: "Email or phone number is required" });
        }
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        // 2. Check for duplicate email/phone
        const query = [];
        if (email) query.push({ email });
        if (phone) query.push({ phone });

        const existingUser = await User.findOne({ $or: query });
        if (existingUser) {
            return res.status(400).json({ message: "Email or phone number already registered" });
        }

        // 3. Handle Referral Logic (if a code was provided)
        let referredById = null;
        if (referredByCode) {
            const referrer = await User.findOne({ referralCode: referredByCode });
            if (!referrer) {
                return res.status(400).json({ message: "Invalid referral code" });
            }
            referredById = referrer._id;
        }

        // 4. Generate OTP and Expiration (e.g., 10 minutes from now)
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        // 5. Generate a unique referral code for the new user
        const myReferralCode = generateReferralCode();

        // 6. Create the user (marks as unverified for now)
        const newUser = await User.create({
            email,
            phone,
            password, // NOTE: In a real app, hash this password using bcrypt!
            role: "customer",
            isVerified: false,
            otp,
            otpExpires,
            referralCode: myReferralCode,
            referredBy: referredById
        });

        // 7. Send the OTP (Mock service)
        sendOTP(email || phone, otp);

        // 8. Return success
        res.status(201).json({
            message: "User registered. Please verify your account with the OTP sent.",
            userId: newUser._id,
            // We usually don't send OTP in the response, but for development/testing:
            debug_otp: otp
        });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Server error during registration", error: error.message });
    }
});

/**
 * POST /api/auth/verify-otp
 * Verifies the user's account using the OTP sent during signup.
 */
router.post("/verify-otp", async (req, res) => {
    try {
        const { userId, otp } = req.body;

        if (!userId || !otp) {
            return res.status(400).json({ message: "User ID and OTP are required" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if OTP matches and hasn't expired
        if (user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP code" });
        }

        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "OTP has expired. Please request a new one." });
        }

        // Mark user as verified and clear OTP fields
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({
            message: "Account verified successfully! You can now log in.",
            user: {
                id: user._id,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Verification failed", error: error.message });
    }
});

module.exports = router;