const express = require("express");
const { isAuth } = require("../middlewares/auth.middleware.js");

// Modelos
const { Product } = require("../models/Product.js");
const { Sale } = require("../models/Sale.js");
const { User } = require("../models/User.js");

// Router propio de productos
const router = express.Router();

// CRUD: READ
router.get("/", (req, res, next) => {
  try {
    console.log("Estamos en el middleware /sale que comprueba parámetros");

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
    const userId = req.body.id;
    const { page, limit } = req.query;
    const sales = await Sale.find( { $or: [{ buyer: userId }, { seller: userId }] })
      .limit(limit)
      .skip((page - 1) * limit)

    // Num total de elementos
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
    const userId = req.body.id;
    const sale = await Sale.findOne({ _id: id, $or: [{ buyer: userId }, { seller: userID }] });

    if (sale) {
      res.json(sale);
    } else {
      res.status(404).json({ error: "Sale not found"});
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
    
    if(!productExists || !buyerExists) {
      res.status(404).json({ error: "Sale not found"});
    }
    
    if (previousSaleExists) {
      return res.status(409).json({ error: "Previous sale already exists" });
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

    res.status(403).json({ error: "Deleting sales is not allowed" })
  } catch (error) {
    next(error);
  }
});

// CRUD: UPDATE
router.put("/:id", isAuth , async (req, res, next) => {

  try {
    const id = req.params.id;
    const sale = await Sale.findById(id);
    
    if (!sale) {
      res.status(404).json({ error: "Sale not found" });
    }

    if (req.user.id !== sale.seller.toString()) {
      return res.status(401).json({ error: "You are not authorized to perform this operation" });
    }

    // Se eliminan las propiedades "product" y "seller del cuerpo de la solicitud"
    const { product, seller, ...updatedData} = req.body;

    const updatedSale = await Sale.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });

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
