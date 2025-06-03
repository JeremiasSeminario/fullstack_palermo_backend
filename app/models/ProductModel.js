const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  maxPeople: {
    type: Number,
    default: 1,
  },
  requirements: {
    requiresHelmet: {
      type: Boolean,
      default: false,
    },
    requiresLifeJacket: {
      type: Boolean,
      default: false,
    }
  },
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
