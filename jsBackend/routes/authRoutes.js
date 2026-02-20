const express = require("express");
const router = express.Router();

// Import the User model (this lets us talk to MongoDB)
const User = require("../models/User");

// POST /signup
// This route handles user registration
router.post("/signup", async (req, res) => {
    try {

        // Destructure data sent from frontend/Postman
        const { email, phone, password } = req.body;

        // 1️⃣ Basic validation
        if (!password) {
            return res.status(400).json({
                message: "Password is required"
            });
        }

        if (!email && !phone) {
            return res.status(400).json({
                message: "Email or phone is required"
            });
        }

        // 2️⃣ Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { phone }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // 3️⃣ Create new user
        const newUser = await User.create({
            email,
            phone,
            password
        });

        // 4️⃣ Send success response
        res.status(201).json({
            message: "User created successfully",
            user: newUser
        });

    } catch (error) {

        // If anything crashes inside try block
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});

module.exports = router;