const mongoose = require("mongoose");

/**
 * Order Schema
 * Tracks customer orders and their status.
 */
const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [{
        food: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Food",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
        }
    }],
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "preparing", "out-for-delivery", "delivered", "cancelled"],
        default: "pending",
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Order", orderSchema);
