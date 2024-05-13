const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { usersData } = require("./data/users.data.js");
const { productsData } = require("./data/products.data.js");
const { chatsData } = require("./data/chats.data.js");
const { salesData } = require("./data/sales.data.js");
const { User } = require("../models/User.js");
const { Product } = require("../models/Product.js");
const { Chat } = require("../models/Chat.js");
const { Sale } = require("../models/Sale.js");

const userSeed = async () => {
  try {
    await connect();
    console.log("Tenemos conexión");

    // Borramos datos
    await User.collection.drop();
    await Product.collection.drop();
    await Chat.collection.drop();
    await Sale.collection.drop();
    console.log("Todos los datos eliminados");

    // Creamos usuarios
    const userDocuments = usersData.map((user) => new User(user));

    // Los usuarios los añadimos con save para generar password
    for (let i = 0; i < userDocuments.length; i++) {
      const document = userDocuments[i];
      await document.save();
    }

    // Añadimos relaciones producto -> owner
    for (let i = 0; i < productsData.length; i++) {
      const product = productsData[i];
      product.owner = userDocuments[0].id;
    }

    // Creamos los productos
    const productDocuments = productsData.map((product) => new Product(product));

    // Añadimos relaciones sale -> buyer,seller,product
    for (let i = 0; i < salesData.length; i++) {
      const sale = salesData[i];
      sale.seller = userDocuments[0].id;
      sale.buyer = userDocuments[1].id;
      sale.product = productDocuments[i].id;
    }

    // Creamos las ventas
    const saleDocuments = salesData.map((sale) => new Sale(sale));

    // Añadimos relaciones chat -> user1, user2, product
    for (let i = 0; i < chatsData.length; i++) {
      const chat = chatsData[i];
      chat.user1 = userDocuments[0].id;
      chat.user2 = userDocuments[1].id;
      chat.product = productDocuments[i].id;

      for (let j = 0; j < chat.messages.length; j++) {
        const message = chat.messages[j];
        message.sender = userDocuments[j % 2].id;
        message.receiver = userDocuments[(j + 1) % 2].id;
      }
    }

    // Creamos los chats
    const chatDocuments = chatsData.map((chat) => new Chat(chat));

    // El resto con insertmany
    await Product.insertMany(productDocuments);
    await Chat.insertMany(chatDocuments);
    await Sale.insertMany(saleDocuments);

    console.log("Datos creados correctamente!");
  } catch (error) {
    console.error("ERROR AL CONECTAR CON LA BBDD");
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
};

userSeed();
