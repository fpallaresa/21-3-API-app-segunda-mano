const { userRouter } = require("./routes/user.routes.js");
const { productRouter } = require("./routes/product.routes.js");
const { chatRouter } = require("./routes/chat.routes.js");
const { saleRouter } = require("./routes/sale.routes.js");
const express = require("express");
const cors = require("cors");

const main = async () => {
  // Conexión a la BBDD
  const { connect } = require("./db.js");
  const database = await connect();

  // Configuración del server
  const PORT = 3000;
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(
    cors({
      origin: "http://localhost:3000",
    })
  );

  // Rutas
  const router = express.Router();
  router.get("/", (req, res) => {
    res.send(`Esta es la home de nuestra API. Estamos utilizando la BBDD de ${database.connection.name} `);
  });
  router.get("*", (req, res) => {
    res.status(404).send("Lo sentimos :( No hemos encontrado la página solicitada.");
  });

  // Middlewares de aplicación, por ejemplo middleware de logs en consola
  app.use((req, res, next) => {
    const date = new Date();
    console.log(`Petición de tipo ${req.method} a la url ${req.originalUrl} el ${date}`);
    next();
  });

  // Acepta /product/*
  app.use("/product", (req, res, next) => {
    console.log("Me han pedido productos!!");
    next();
  });

  // Usamos las rutas
  app.use("/user", userRouter);
  app.use("/product", productRouter);
  app.use("/chat", chatRouter);
  app.use("/sale", saleRouter);
  app.use("/public", express.static("public"));
  app.use("/", router);

  // Middleware de gestión de errores
  app.use((err, req, res, next) => {
    console.log("*** INICIO DE ERROR ***");
    console.log(`PETICIÓN FALLIDA: ${req.method} a la url ${req.originalUrl}`);
    console.log(err);
    console.log("*** FIN DE ERROR ***");

    if (err?.name === "ValidationError") {
      res.status(400).json(err);
    } else if (err.errmsg?.indexOf("duplicate key") !== -1) {
      res.status(400).json({ error: err.errmsg });
    } else {
      res.status(500).json(err);
    }
  });

  app.listen(PORT, () => {
    console.log(`Server levantado en el puerto ${PORT}`);
  });
};

main();
