const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      unique: true,
      required: false,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    buyerMessages: [
      {
        content: {
          type: String,
          required: true,
          maxLength: [200, "El mensaje no puede contener más de 200 caracteres"],
        },
        timestamp: {
          type: Date,
          required: true,
        },
      },
    ],
    ownerMessages: [
      {
        content: {
          type: String,
          required: true,
          maxLength: [200, "El mensaje no puede contener más de 200 caracteres"],
        },
        timestamp: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatSchema);
module.exports = { Chat };
