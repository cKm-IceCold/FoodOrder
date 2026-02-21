const mongoose = require("mongoose");
const User = require("../models/User");

/**
 * Protect route: Ensures the user is logged in and verified.
 */
const protect = async (req, res, next) => {
    try {
        const userId = req.headers["x-user-id"];

        if (!userId) {
            return res.status(401).json({ message: "Not authorized: Please provide user ID in headers" });
        }

        // Check if the provided ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid User ID format",
                suggestion: "Please replace 'ADMIN_ID' or 'CUSTOMER_ID' with a real ID from your database (like '65d56f...')"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ message: "User no longer exists" });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: "Account not verified. Please complete OTP verification." });
        }

        // Attach user object to request for downstream use
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Authentication failed", error: error.message });
    }
};

/**
 * Admin check: Ensures the user has the 'admin' role.
 */
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Access denied: Admin role required" });
    }
};

module.exports = { protect, adminOnly };
