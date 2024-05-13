const mongoose = require("mongoose");
const { User } = require("./User");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = { Product };
