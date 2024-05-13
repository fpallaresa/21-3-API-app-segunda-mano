const mongoose = require("mongoose");
const { User } = require("./User");
const { Product } = require("./Product");

const saleSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Product,
    required: true,
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Sale = mongoose.model("Sale", saleSchema);

module.exports = { Sale };
