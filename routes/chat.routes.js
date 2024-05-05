const express = require("express");

// Modelos
const { Chat } = require("../models/Chat.js");

const router = express.Router();

// CRUD: READ
router.get("/", async (req, res, next) => {
  try {
    console.log("Estamos en el middleware /chat que comprueba parámetros");

    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    if (!isNaN(page) && !isNaN(limit) && page > 0 && limit > 0) {
      req.query.page = page;
      req.query.limit = limit;
      next();
    } else {
      console.log("Parámetros no válidos:");
      console.log(JSON.stringify(req.query));
      res.status(400).json({ error: "Params page or limit are not valid" });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    // Asi leemos query params
    const { page, limit } = req.query;
    const chats = await Chat.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .populate ([{path:"user1"}, {path:"user2"}]);

    // Num total de elementos
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
    const chat = await Chat.findById(id).populate(["user1", "user2"]);
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
router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
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
router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const chatUpdated = await Chat.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (chatUpdated) {
      res.json(chatUpdated);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});

module.exports = { chatRouter: router };
