const express = require("express");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/token");

// Modelos
const { User } = require("../models/User.js");
const { Sale } = require("../models/Sale.js");
const { Product } = require("../models/Product.js");
const { isAuth } = require("../middlewares/auth.middleware.js");

// Router propio de usuarios
const router = express.Router();

// CRUD: READ
router.get("/", async (req, res, next) => {
  try {
    // Ternario que se queda con el parametro si llega
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    const users = await User.find()
      .limit(limit)
      .skip((page - 1) * limit);

    // Num total de elementos
    const totalElements = await User.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: users,
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
    const user = await User.findById(id).select("+password");

    if (user) {
      const temporalUser = user.toObject();
      const includeProducts = req.query.includeProducts === "true";
      if (includeProducts) {
        const products = await Product.find({ owner: id });
        temporalUser.products = products;
      }

      res.json(temporalUser);
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
    const user = new User(req.body);
    const createdUser = await user.save();
    return res.status(201).json(createdUser);
  } catch (error) {
    next(error);
  }
});

// CRUD: DELETE
router.delete("/:id", isAuth, async (req, res, next) => {
  try {
    const id = req.params.id;

    if (req.user.id !== id && req.user.email !== "admin@gmail.com") {
      return res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const hasSales = await Sale.exists({ $or: [{ buyer: id }, { seller: id }] });
    const hasProducts = await Product.exists({ owner: id });

    if (hasSales || hasProducts) {
      return res.status(403).json({ error: "No se puede eliminar un usuario con ventas o productos asociados" });
    }

    const userDeleted = await User.findByIdAndDelete(id);
    if (userDeleted) {
      res.json(userDeleted);
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

    if (req.user.id !== id && req.user.email !== "admin@gmail.com") {
      return res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
    }

    const userToUpdate = await User.findById(id);
    if (userToUpdate) {
      Object.assign(userToUpdate, req.body);
      await userToUpdate.save();
      // Quitamos pass de la respuesta
      const userToSend = userToUpdate.toObject();
      delete userToSend.password;
      res.json(userToSend);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});

// LOGIN DE USUARIOS
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Se deben especificar los campos email y password" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Email y/o contraseña incorrectos" });
    }

    // Comprueba la pass
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      // Quitamos password de la respuesta
      const userWithoutPass = user.toObject();
      delete userWithoutPass.password;

      // Generamos token JWT
      const jwtToken = generateToken(user._id, user.email);

      return res.status(200).json({ token: jwtToken });
    } else {
      return res.status(401).json({ error: "Email y/o contraseña incorrectos" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = { userRouter: router };
