const mongoose = require('mongoose');
const Product = require('./app/models/ProductModel');

const products = [
  {
    name: "Jetski",
    type: "vehiculo acuatico",
    price: 8000,
    description: "Moto de agua de alta velocidad para hasta 2 personas. Incluye casco y chaleco salvavidas obligatorios.",
    shortDescription: "Potencia y adrenalina en el agua",
    maxPeople: 2,
    requirements: {
      requiresHelmet: true,
      requiresLifeJacket: true,
    }
  },
  {
    name: "Cuatriciclo",
    type: "vehiculo terrestre",
    price: 6000,
    description: "Cuatriciclo de aventura para 1 o 2 personas. Incluye casco obligatorio.",
    shortDescription: "Aventura en la arena",
    maxPeople: 2,
    requirements: {
      requiresHelmet: true,
    }
  },
  {
    name: "Equipo de Buceo",
    type: "equipamiento acuatico",
    price: 4500,
    description: "Equipo profesional para bucear en zonas habilitadas.",
    shortDescription: "Explora el mundo submarino",
    maxPeople: 1,
  },
  {
    name: "Tabla de Surf (Niños)",
    type: "equipamiento acuatico",
    price: 2500,
    description: "Tabla de surf de 5 pies, especialmente para niños. Ligera y fácil de manejar.",
    shortDescription: "Diversión segura para los más pequeños",
    maxPeople: 1,
  },
  {
    name: "Tabla de Surf (Adultos)",
    type: "equipamiento acuatico",
    price: 3000,
    description: "Tabla de surf de 7 pies, ideal para principiantes y surfistas intermedios.",
    shortDescription: "Domina las olas",
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