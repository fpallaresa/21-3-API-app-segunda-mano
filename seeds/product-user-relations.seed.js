const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { generateRandom } = require("../utils/utils.js");
const { Product } = require("../models/Product.js");
const { Chat } = require("../models/Chat.js");
const { User } = require("../models/User.js");

const productRelationsSeed = async () => {
  try {
    await connect();
    console.log("Tenemos conexión!");

    // Recuperamos usuarios, productos y chats
    const products = await Product.find();
    const users = await User.find();
    const chats = await Chat.find();

    // Comprobar que existen productos
    if (!products.length) {
      console.error("No hay productos para relacionar en la base de datos");
      return;
    }

    if (!users.length) {
      console.error("No hay usuarios para relacionar en la base de datos");
      return;
    }

    if (!chats.length) {
      console.error("No hay chats para relacionar en la base de datos");
      return;
    }

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const randomUser = users[generateRandom(0, users.length - 1)];
      const randomChat = chats[generateRandom(0, chats.length - 1)];
      product.owner = randomUser._id;
      product.chats = randomChat._id;

      // if (product.boughtBy) {
      //  product.sold = true;
      // }
      await product.save();
    }

    console.log("Relaciones entre productos-usuarios-chats creadas correctamente.");
  } catch (error) {
    console.error("Error al crear relaciones:", error);
  } finally {
    mongoose.disconnect();
  }
};

productRelationsSeed();
