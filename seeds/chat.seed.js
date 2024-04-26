const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const { connect } = require("../db.js");
const { Chat } = require("../models/Chat.js");

const chatList = [
  {
    buyerMessages: [
      {
        content: faker.lorem.sentence(),
        timestamp: "2024-04-25T12:30:00.000Z",
      },
    ],
    ownerMessages: [
      {
        content: faker.lorem.sentence(),
        timestamp: "2024-04-25T12:31:00.000Z",
      },
    ],
  },
];

for (let i = 0; i < 50; i++) {
  const newChat = {
    buyerMessages: [
      {
        content: faker.lorem.words(),
        timestamp: faker.date.recent(),
      },
    ],
    ownerMessages: [
      {
        content: faker.lorem.words(),
        timestamp: faker.date.recent(),
      },
    ],
  };
  chatList.push(newChat);
}
console.log(chatList);

const chatSeed = async () => {
  try {
    // Conexión a BBDD
    await connect();
    console.log("Tenemos conexión");

    // Borramos datos de los chats
    await Chat.collection.drop();
    console.log("Chats eliminados");

    const documents = chatList.map((chat) => new Chat(chat));

    for (let i = 0; i < documents.length; i++) {
      const document = documents[i];
      await document.save();
    }

    console.log(`Hemos creado ${chatList.length} correctamente!`);
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
};

chatSeed();
