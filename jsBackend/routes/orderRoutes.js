const express = require("express");
const router = express.Router();

// Import models
const Order = require("../models/Order");
const Food = require("../models/Food");

// Import middleware
const { protect, adminOnly } = require("../middleware/authMiddleware");

/**
 * POST /api/orders
 * Customer route: Create a new order from a cart.
 * Complexity: Validates items, checks availability, calculates price.
 */
router.post("/", protect, async (req, res) => {
    try {
        const { items } = req.body; // Expects array of { foodId, quantity }

        if (!items || !items.length) {
            return res.status(400).json({ message: "Cart cannot be empty" });
        }

        let calculatedTotalPrice = 0;
        const verifiedItems = [];

        // 1. Validate items and calculate price
        for (const item of items) {
            const food = await Food.findById(item.foodId);

            // Edge Case: Food doesn't exist
            if (!food) {
                return res.status(404).json({ message: `Food item with ID ${item.foodId} not found` });
            }

            // Edge Case: Food becomes unavailable after being added to cart
            if (!food.isAvailable) {
                return res.status(400).json({
                    message: `Item '${food.name}' is currently unavailable. Please remove it from your cart.`
                });
            }

            calculatedTotalPrice += food.price * item.quantity;
            verifiedItems.push({
                food: food._id,
                quantity: item.quantity
            });
        }

        // 2. Create and store the order
        const newOrder = await Order.create({
            customer: req.user._id,
            items: verifiedItems,
            totalPrice: calculatedTotalPrice,
            status: "pending" // Initial status
        });

        res.status(201).json({
            message: "Order placed successfully! 🏪",
            order: newOrder
        });

    } catch (error) {
        res.status(500).json({ message: "Order creation failed", error: error.message });
    }
});

/**
 * GET /api/orders/:id
 * Customer/Admin route: Fetch order details and status.
 */
router.get("/:id", protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("items.food", "name price") // Show food details
            .populate("customer", "email phone");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Check if user is the owner OR an admin
        if (order.customer._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized to view this order" });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch order", error: error.message });
    }
});

/**
 * PATCH /api/orders/:id/status
 * Admin route: Update order status (Lifecycle management)
 */
router.patch("/:id/status", protect, adminOnly, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ["pending", "confirmed", "preparing", "out-for-delivery", "completed", "cancelled"];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;
        await order.save();

        res.status(200).json({ message: `Order status updated to ${status}`, order });
    } catch (error) {
        res.status(500).json({ message: "Status update failed", error: error.message });
    }
});

/**
 * PATCH /api/orders/:id/cancel
 * Customer route: Cancel their own order (only if it's still pending)
 */
router.patch("/:id/cancel", protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        // Verify ownership
        if (order.customer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You can only cancel your own orders" });
        }

        // Edge Case: Cannot cancel if already preparing/delivered
        if (order.status !== "pending") {
            return res.status(400).json({ message: `Cannot cancel order in '${order.status}' status.` });
        }

        order.status = "cancelled";
        await order.save();

        res.status(200).json({ message: "Order cancelled successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Cancellation failed", error: error.message });
    }
});

module.exports = router;
