const mongoose = require("mongoose");

/**
 * Food Schema
 * Defines the structure for food items in the database.
 */
const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
        type: String,
        required: true,
        // Categories could be "Main Course", "Drinks", "Desserts", etc.
    },
    image: {
        type: String, // URL or file path to the image
    },
    isAvailable: {
        type: Boolean,
        default: true, // Food is available by default when added
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Food", foodSchema);
