const express = require("express");

// Modelos
const { Sale } = require("../models/Sale.js");
const { Product } = require("../models/Product.js");
const { User } = require("../models/User.js");
const { isAuth } = require("../middlewares/auth.middleware.js");

const router = express.Router();

// CRUD: READ
router.get("/", isAuth, async (req, res, next) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
      return res.status(400).json({ error: "Invalid page or limit value" });
    }

    const userId = req.user.id;
    const sales = await Sale.find({ $or: [{ buyer: userId }, { seller: userId }] })
      .limit(limit)
      .skip((page - 1) * limit);

    const totalElements = await Sale.countDocuments({ $or: [{ buyer: userId }, { seller: userId }] });

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: sales,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// CRUD: READ
router.get("/:id", isAuth, async (req, res, next) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    const sale = await Sale.findOne({ _id: id, $or: [{ buyer: userId }, { seller: userId }] });

    if (sale) {
      res.json(sale);
    } else {
      res.status(404).json({ error: "Sale not found" });
    }
  } catch (error) {
    next(error);
  }
});

// CRUD: CREATE
router.post("/", isAuth, async (req, res, next) => {
  try {
    const { product, buyer } = req.body;
    const seller = req.user.id;

    const productExists = await Product.exists({ _id: product, owner: seller });
    const buyerExists = await User.exists({ _id: buyer });
    const previousSaleExists = await Sale.exists({ product, seller });

    if (!productExists || !buyerExists) {
      return res.status(404).json({ error: "Product or buyer not found" });
    }

    if (previousSaleExists) {
      return res.status(409).json({ error: "A previous sale for this product already exists" });
    }

    const sale = new Sale({
      product,
      buyer,
      seller,
    });

    const createdSale = await sale.save();
    res.status(201).json(createdSale);
  } catch (error) {
    next(error);
  }
});

// CRUD: DELETE
router.delete("/:id", isAuth, async (req, res, next) => {
  try {
    const id = req.params.id;
    const sale = await Sale.findById(id);

    if (!sale) {
      return res.status(404).json({ error: "Sale not found" });
    }

    if (req.user.id !== sale.seller.toString()) {
      return res.status(401).json({ error: "You are not authorized to perform this operation" });
    }

    res.status(403).json({ error: "Deleting sales is not allowed" });
  } catch (error) {
    next(error);
  }
});

// CRUD: UPDATE
router.put("/:id", isAuth, async (req, res, next) => {
  try {
    const id = req.params.id;
    const sale = await Sale.findById(id);

    if (!sale) {
      return res.status(404).json({ error: "Sale not found" });
    }

    if (req.user.id !== sale.seller.toString()) {
      return res.status(401).json({ error: "You are not authorized to perform this operation" });
    }

    // Se eliminan las propiedades "product" y "seller" del cuerpo de la solicitud
    const { product, seller, ...updateData } = req.body;

    const updatedSale = await Sale.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (updatedSale) {
      res.json(updatedSale);
    } else {
      res.status(404).json({ error: "Sale not found" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = { saleRouter: router };
