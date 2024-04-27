const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { usersData } = require("./users.data.js");
const { productsData } = require("./products.data.js");
const { salesData } = require("./sales.data.js");
const { chatsData } = require("./chats.data.js");
const { Product } = require("../models/Product.js");
const { Chat } = require("../models/Chat.js");
const { User } = require("../models/User.js");
const { Sale } = require("../models/Sale.js");

const relationsSeed = async () => {
  try {
    await connect();
    console.log("Tenemos conexión!");

    // Eliminamos datos
    await User.collection.drop();
    await Product.collection.drop();
    await Chat.collection.drop();
    await Sale.collection.drop();
    console.log("Todos los datos eliminados correctamente!");

    // Creamos los usuarios
    const userInfo = usersData.map((user) => new User(user));

    // Añadimos los usuarios
    for (let i = 0; i < userInfo.length; i++) {
      const user = userInfo[i];
      await user.save();
    }

    // Relaciones de producto con owner
    for (let i = 0; i < productsData.length; i++) {
      const product = productsData[i];
      product.owner = userInfo[0].id;
    }

    // Creamos los productos
    const productInfo = productsData.map((product) => new Product(product));

    // Relaciones de sale con product, buyer, seller
    for (let i = 0; i < salesData.length; i++) {
      const sale = salesData[i];
      sale.seller = userInfo[0].id;
      sale.buyer = userInfo[1].id;
      sale.product = productInfo[i].id;
    }

    // Creamos los sales
    const saleInfo = salesData.map((sale) => new Sale(sale));    

    // Relaciones de chat con users, product
    for (let i = 0; i < chatsData.length; i++) {
      const chat = chatsData[i];
      chat.user1 = userInfo[0].id;
      chat.user2 = userInfo[1].id;
      chat.product = productInfo[i].id;

      for (let j = 0; j < chat.messages.length; j++) {
        const message = chat.messages[j];
        message.sender = userInfo[j % 2].id;
        message.receiver = userInfo[(j + 1) % 2].id;
      }
    }

    // Creamos los chats
    const chatInfo = chatsData.map((chat) => new Chat(chat));  

    await Product.insertMany(productInfo);
    await Chat.insertMany(chatInfo);
    await Sale.insertMany(saleInfo);

    console.log("Relaciones entre productos-usuarios-chats-sales creadas correctamente.");
  } catch (error) {
    console.error("Error al crear relaciones:", error);
  } finally {
    mongoose.disconnect();
  }
};

relationsSeed();
