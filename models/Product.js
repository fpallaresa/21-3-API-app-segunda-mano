const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const allowedCategories = ["electronica", "ropa", "deporte", "libros", "juguetes", "automoviles", "musica", "arte"];

const productSchema = new Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    category: {
      type: String,
      required: false,
      enum: allowedCategories,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 50,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      minLength: [1, "Debes añadir un precio al producto"],
      maxLength: [6, "No es posible vender un producto de más de 999.999 €"],
    },
    description: {
      type: String,
      required: false,
      trim: true,
      maxLength: [640, "No está permitido escribir más de 640 caracteres, revisa la descripción, por favor."],
    },
    images: {
      type: [String],
      required: false,
    },
    sold: {
      type: Boolean,
      default: false,
      required: true,
    },
    boughtBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    chats: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: false,
    }],
    postalCode: {
      type: String,
      required: true,
      trim: true,
      minLength: [4, "El Código Postal debe tener al menos 4 caracteres"],
      maxLength: [6, "El Código Postal no puede contener más de 6 caracteres"],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
module.exports = { Product };
