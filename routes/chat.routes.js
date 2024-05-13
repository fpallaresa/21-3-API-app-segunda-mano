const express = require("express");

// Modelos
const { Chat } = require("../models/Chat.js");
const { isAuth } = require("../middlewares/auth.middleware.js");

// Router propio de usuarios
const router = express.Router();

// CRUD: READ
router.get("/", async (req, res, next) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    const chats = await Chat.find()
      .limit(limit)
      .skip((page - 1) * limit);

    const totalElements = await Chat.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: chats,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// CRUD: READ
router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const chat = await Chat.findById(id).populate(["product", "user1", "user2"]);

    if (chat) {
      res.json(chat);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});

// CRUD: CREATE
router.post("/", async (req, res, next) => {
  try {
    const chat = new Chat(req.body);
    const createdChat = await chat.save();
    return res.status(201).json(createdChat);
  } catch (error) {
    next(error);
  }
});

// CRUD: DELETE
router.delete("/:id", isAuth, async (req, res, next) => {
  try {
    const id = req.params.id;

    // Puedes añadir condiciones adicionales de autorización según tus necesidades
    // ...

    const chatDeleted = await Chat.findByIdAndDelete(id);
    if (chatDeleted) {
      res.json(chatDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});

// CRUD: UPDATE
router.put("/:id", isAuth, async (req, res, next) => {
  try {
    const id = req.params.id;

    // Puedes añadir condiciones adicionales de autorización según tus necesidades
    // ...

    const chatToUpdate = await Chat.findById(id);
    if (chatToUpdate) {
      Object.assign(chatToUpdate, req.body);
      await chatToUpdate.save();
      res.json(chatToUpdate);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});

module.exports = { chatRouter: router };
