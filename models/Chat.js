const mongoose = require("mongoose");
const { User } = require("./User");
const { Product } = require("./Product");

const chatSchema = new mongoose.Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Product,
    required: true,
  },
  messages: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
      },
      receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = { Chat };
