const express = require("express");
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "public" });
const { isAuth } = require("../middlewares/auth.middleware.js");

// Modelos
const { Product } = require("../models/Product.js");
const { Chat } = require("../models/Chat.js");
const { Sale } = require("../models/Sale.js");

// Router propio de productos
const router = express.Router();

// CRUD: READ
router.get("/", (req, res, next) => {
  try {
    console.log("Estamos en el middleware /product que comprueba parámetros");

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
    const products = await Product.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .populate(["owner"]);

    // Num total de elementos
    const totalElements = await Product.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: products,
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
    const product = await Product.findById(id).populate(["owner"]);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    next(error);
  }
});

// CRUD: CREATE
router.post("/", isAuth, async (req, res, next) => {
  try {
    const product = new Product(req.body);

    // Verificar si el usuario autenticado es el propietario del producto
    if (req.user.id !== product.owner.toString()) {
      return res.status(401).json({ error: "You are not authorized to perform this operation" });
    }

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
});

// CRUD: DELETE
router.delete("/:id", isAuth, async (req, res, next) => {
  try {
    const productId = req.params.id;

    // Verificar si el usuario autenticado es el propietario del producto
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (req.user.id !== product.owner.toString()) {
      return res.status(401).json({ error: "You are not authorized to perform this operation" });
    }

    // Verificar si el producto tiene conversaciones o ventas asociadas
    const hasChats = await Chat.exists({ product: productId });
    const hasSales = await Sale.exists({ product: productId });
    if (hasChats || hasSales) {
      return res.status(403).json({ error: "Cannot delete the product. It has associated chats or sales." });
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (deletedProduct) {
      res.json(deletedProduct);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    next(error);
  }
});

// CRUD: UPDATE
router.put("/:id", isAuth, async (req, res, next) => {
  try {
    const id = req.params.id;
    const productUpdated = await Product.findById(id);

    // Verificar si el producto tiene asociada una venta
    const saleExists = await Sale.exists({ product: id });
    if (saleExists) {
      return res.status(403).json({ error: "Cannot update the product. It has an associated sale." });
    }

    if (productUpdated) {
      // Verificar si el usuario autenticado es el propietario del producto
      if (req.user.id !== productUpdated.owner.toString()) {
        return res.status(401).json({ error: "You are not authorized to perform this operation" });
      }

      Object.assign(productUpdated, req.body);
      await productUpdated.save();
      res.json(productUpdated);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/image-upload", isAuth, upload.single("image"), async (req, res, next) => {
  try {
    // Renombrado de la imagen
    const originalname = req.file.originalname;
    const path = req.file.path;
    const newPath = path + "_" + originalname;
    fs.renameSync(path, newPath);

    // Búsqueda del producto
    const productId = req.body.productId;
    const product = await Product.findById(productId);

    if (!product) {
      fs.unlinkSync(newPath);
      return res.status(404).send("Product not found");
    }

    // Verificar si el usuario autenticado es el propietario del producto
    if (req.user.id !== product.owner.toString()) {
      fs.unlinkSync(newPath);
      return res.status(401).json({ error: "You are not authorized to add images to this product" });
    }

    // Verificar si el producto está vendido
    if (product.sold) {
      fs.unlinkSync(newPath);
      return res.status(403).json({ error: "Cannot add images to a sold product" });
    }

    product.images.push(newPath);
    await product.save();
    res.json(product);

    console.log("Product saved!");
  } catch (error) {
    next(error);
  }
});

module.exports = { productRouter: router };
