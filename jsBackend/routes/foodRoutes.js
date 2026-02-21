const express = require("express");
const router = express.Router();

// Import the Food model
const Food = require("../models/Food");

// Import authorization middleware
const { protect, adminOnly } = require("../middleware/authMiddleware");

/**
 * GET /api/foods
 * Public route: Allowed for everyone to browse food items.
 */
router.get("/", async (req, res) => {
    try {
        // Find only available food items (unless it's an admin browsing, maybe)
        const foods = await Food.find({ isAvailable: true });
        res.status(200).json(foods);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch food items", error: error.message });
    }
});

/**
 * POST /api/foods
 * Admin route: Create a new food item.
 * Requires: Header { "x-user-id": "ADMIN_ID" }
 */
router.post("/", protect, adminOnly, async (req, res) => {
    try {
        const { name, description, price, category, image } = req.body;

        // Basic validation
        if (!name || !price || !category) {
            return res.status(400).json({ message: "Name, price, and category are required" });
        }

        const newFood = await Food.create({
            name,
            description,
            price,
            category,
            image
        });

        res.status(201).json({ message: "Food item added successfully", food: newFood });
    } catch (error) {
        res.status(500).json({ message: "Error adding food item", error: error.message });
    }
});

/**
 * PUT /api/foods/:id
 * Admin route: Update food details or price.
 */
router.put("/:id", protect, adminOnly, async (req, res) => {
    try {
        const updatedFood = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedFood) {
            return res.status(404).json({ message: "Food item not found" });
        }
        res.status(200).json({ message: "Food item updated", food: updatedFood });
    } catch (error) {
        res.status(500).json({ message: "Error updating food item", error: error.message });
    }
});

/**
 * PATCH /api/foods/:id/status
 * Admin route: Toggle food availability (e.g., mark item unavailable).
 */
router.patch("/:id/status", protect, adminOnly, async (req, res) => {
    try {
        const { isAvailable } = req.body;

        const food = await Food.findById(req.params.id);
        if (!food) {
            return res.status(404).json({ message: "Food item not found" });
        }

        food.isAvailable = isAvailable;
        await food.save();

        res.status(200).json({ message: `Food marked as ${isAvailable ? 'available' : 'unavailable'}`, food });
    } catch (error) {
        res.status(500).json({ message: "Error updating food status", error: error.message });
    }
});

module.exports = router;
