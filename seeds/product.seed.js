const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { Product } = require("../models/Product.js");

const productList = [
  { category: "electronica", title: "iPhone 14", price: 150, description: "Vendo mi iPhone 14 en perfecto estado. Este teléfono ha sido cuidadosamente mantenido y se encuentra en excelentes condiciones tanto estéticas como funcionales. Es ideal para aquellos que buscan un dispositivo de alta calidad a un precio más asequible.", sold: false, postalCode: "08013" },
  { category: "ropa", title: "Camisa H&M", price: 25, description: "Camisa de H&M de segunda mano en excelente estado. Esta camisa de diseño moderno y tejido de alta calidad es perfecta para cualquier ocasión. Combina estilo y comodidad a un precio asequible. ¡Atrévete a lucir elegante con esta prenda versátil y a la moda!", sold: false, postalCode: "08001" },
  { category: "deporte", title: "Zapatillas de Running #1", price: 60, description: "Zapatillas de running en perfecto estado, ideales para entrenamientos y competiciones. ¡Consigue un impulso extra en tus carreras con este calzado de calidad!", sold: false, postalCode: "08002" },
  { category: "libros", title: "Libro de Ciencia Ficción #1", price: 15, description: "Novela de ciencia ficción en buen estado. Sumérgete en un mundo de fantasía y aventura con esta apasionante historia. ¡Ideal para los amantes de la lectura!", sold: false, postalCode: "08003" },
  { category: "juguetes", title: "Juego de Construcción #1", price: 30, description: "Juego de construcción en perfecto estado, ideal para estimular la creatividad y la habilidad manual de los más pequeños. ¡Diviértete construyendo con este emocionante juego!", sold: false, postalCode: "08004" },
  { category: "automoviles", title: "Coche de Juguete #1", price: 20, description: "Coche de juguete en excelente estado. Este divertido juguete garantiza horas de diversión para los niños. ¡Hazte con él y empieza a rodar!", sold: false, postalCode: "08005" },
  { category: "musica", title: "Guitarra Acústica #1", price: 100, description: "Guitarra acústica en perfectas condiciones. Con un sonido nítido y cálido, esta guitarra es ideal para músicos principiantes y avanzados. ¡Empieza a tocar tus melodías favoritas hoy mismo!", sold: false, postalCode: "08006" },
  { category: "arte", title: "Cuadro Abstracto #1", price: 50, description: "Cuadro abstracto en excelente estado. Con sus colores vibrantes y su diseño único, esta obra de arte añadirá un toque de estilo a cualquier espacio. ¡Hazte con esta pieza única y decora tu hogar con elegancia!", sold: false, postalCode: "08007" },
  { category: "deporte", title: "Balón de Fútbol #1", price: 25, description: "Balón de fútbol en buen estado, perfecto para partidos y entrenamientos. Con su diseño resistente y suave, este balón garantiza un juego dinámico y emocionante. ¡Marca goles con estilo!", sold: false, postalCode: "08008" },
  { category: "libros", title: "Libro de Misterio #2", price: 12, description: "Libro de misterio en excelente estado. Sumérgete en una trama intrigante llena de giros inesperados y revelaciones sorprendentes. ¡No podrás dejar de leer hasta descubrir el misterio!", sold: false, postalCode: "08009" },
  { category: "juguetes", title: "Muñeca de Peluche #1", price: 18, description: "Muñeca de peluche en perfecto estado, lista para ser abrazada y mimada. Con su suave textura y su adorable diseño, esta muñeca será la compañera perfecta para jugar y dormir. ¡Regala momentos de ternura y diversión!", sold: false, postalCode: "08010" },
  { category: "automoviles", title: "Carrera de Coches #1", price: 35, description: "Set de carrera de coches en excelente estado. Este emocionante juego incluye pistas curvas, rectas y loopings para disfrutar de carreras trepidantes. ¡Acelera y llega primero a la meta!", sold: false, postalCode: "08011" },
  { category: "musica", title: "Micrófono Profesional #1", price: 80, description: "Micrófono profesional en perfectas condiciones. Con su calidad de sonido superior y su diseño robusto, este micrófono es perfecto para grabaciones y actuaciones en vivo. ¡Haz que tu voz se escuche con claridad!", sold: false, postalCode: "08012" },
  { category: "arte", title: "Escultura Moderna #1", price: 70, description: "Escultura moderna en excelente estado. Con su diseño abstracto y su estilo contemporáneo, esta pieza de arte añadirá un toque de sofisticación a cualquier ambiente. ¡Hazte con esta obra de arte y despierta la admiración de tus invitados!", sold: false, postalCode: "08013" },
  { category: "deporte", title: "Bicicleta de Montaña #1", price: 180, description: "Bicicleta de montaña en buen estado, perfecta para aventuras al aire libre. Con su resistente estructura y su sistema de cambios suave, esta bicicleta te llevará a explorar nuevos caminos y paisajes. ¡Prepárate para vivir emociones intensas!", sold: false, postalCode: "08014" },
  { category: "libros", title: "Libro de Aventuras #3", price: 20, description: "Libro de aventuras en excelente estado. Embárcate en una emocionante aventura llena de peligros y descubrimientos. ¡Atrévete a explorar nuevos mundos y vivir experiencias inolvidables!", sold: false, postalCode: "08015" },
  { category: "juguetes", title: "Set de Construcción #1", price: 28, description: "Set de construcción en perfecto estado, ideal para niños creativos y curiosos. Con sus piezas versátiles y su diseño intuitivo, este set permite construir una variedad de figuras y estructuras. ¡Despierta la imaginación y diviértete creando!", sold: false, postalCode: "08016" },
  { category: "automoviles", title: "Coche de Carreras #1", price: 40, description: "Coche de carreras en excelente estado, listo para emocionantes competiciones. Con su diseño aerodinámico y su potente motor, este coche alcanza velocidades impresionantes. ¡Siente la adrenalina y disfruta de la velocidad!", sold: false, postalCode: "08017" },
  { category: "musica", title: "Teclado Eléctrico #1", price: 120, description: "Teclado eléctrico en perfecto estado. Con su amplia gama de sonidos y funciones avanzadas, este teclado es perfecto para músicos de todos los niveles. ¡Deja volar tu creatividad y crea música sorprendente!", sold: false, postalCode: "08018" },
  { category: "arte", title: "Pintura al Óleo #1", price: 90, description: "Pintura al óleo en excelente estado. Con su estilo expresivo y sus colores vibrantes, esta obra de arte añadirá un toque de elegancia a cualquier espacio. ¡Hazte con esta pintura única y decora tu hogar con estilo!", sold: false, postalCode: "08019" },
  { category: "deporte", title: "Raqueta de Tenis #1", price: 50, description: "Raqueta de tenis en perfectas condiciones. Con su diseño ligero y su excelente manejo, esta raqueta te ayudará a mejorar tu juego y disfrutar de emocionantes partidos. ¡Prepárate para darlo todo en la pista!", sold: false, postalCode: "08020" },
];

const productSeed = async () => {
  try {
    await connect();
    console.log("Tenemos conexión");

    // Borrar datos
    await Product.collection.drop();
    console.log("Productos eliminados");

    // Añadimos productos
    const documents = productList.map((product) => new Product(product));

    for (let i = 0; i < documents.length; i++) {
      const document = documents[i];
      await document.save();
    }

    console.log("Productos creados correctamente!");
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
};

productSeed();
