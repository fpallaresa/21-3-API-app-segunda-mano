const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { User } = require("../models/User.js");

const userList = [
  { email: "gabriel@gmail.com", password: "12345678", name: "Gabriel G. Márquez" },
  { email: "jane@gmail.com", password: "12345678", name: "Jane Austen" },
  { email: "leo@gmail.com", password: "12345678", name: "Leo Tolstoy" },
  { email: "virginia@gmail.com", password: "12345678", name: "Virginia Woolf" },
  { email: "ernest@gmail.com", password: "12345678", name: "Ernest Hemingway" },
  { email: "jorge@gmail.com", password: "12345678", name: "Jorge Luis Borges" },
  { email: "franz@gmail.com", password: "12345678", name: "Franz Kafka" },
  { email: "toni@gmail.com", password: "12345678", name: "Toni Morrison" },
  { email: "haruki@gmail.com", password: "12345678", name: "Haruki Murakami" },
  { email: "chinua@gmail.com", password: "12345678", name: "Chinua Achebe" },
];

const userSeed = async () => {
  try {
    await connect();
    console.log("Tenemos conexión");

    // Borrar datos
    await User.collection.drop();
    console.log("Usuarios eliminados");

    // Añadimos usuarios
    const documents = userList.map((user) => new User(user));

    for (let i = 0; i < documents.length; i++) {
      const document = documents[i];
      await document.save();
    }

    console.log("Usuarios creados correctamente!");
  } catch (error) {
    console.error("ERROR AL CONECTAR CON LA BBDD");
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
};

userSeed();
