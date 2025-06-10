const mongoose = require('mongoose');
const Product = require('./app/models/ProductModel');

const products = [
  {
    name: "Jetski",
    price: 2500,
    description: "Experimenta la adrenalina sobre el agua con nuestros potentes JetSkis",
    maxPeople: 2,
    requirements: {
      requiresHelmet: true,
      requiresLifeJacket: true,
    }
  },
  {
    name: "Cuatriciclo",
    price: 2250,
    description: "Recorre la playa y alrededores con estos cuatriciclos de gran potencia",
    maxPeople: 2,
    requirements: {
      requiresHelmet: true,
    }
  },
  {
    name: "Equipo de Buceo",
    price: 1250,
    description: "Descubre el mundo submarino con nuestro equipamiento profesional completo",
    maxPeople: 1,
  },
  {
    name: "Tabla de Surf (Adultos)",
    price: 1000,
    description: "Tabla de surf de 5 pies, especialmente para niños. Ligera y fácil de manejar.",
    maxPeople: 1,
  },
  {
    name: "Tabla de Surf (Niños)",
    price: 750,
    description: "Tabla de surf de 7 pies, ideal para principiantes y surfistas intermedios.",
    maxPeople: 1,
  }
];

const CONFIG = require('./app/config/config');

async function loadProducts() {
  try {
    await mongoose.connect(CONFIG.DB);

    // Limpia los productos anteriores si quieres
    await Product.deleteMany({});

    await Product.insertMany(products);
    console.log("Productos cargados exitosamente.");
    process.exit(0);
  } catch (error) {
    console.error("Error cargando productos:", error);
    process.exit(1);
  }
}

loadProducts();