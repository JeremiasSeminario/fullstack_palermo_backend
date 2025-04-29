const mongoose = require('mongoose');
const Product = require('./app/models/ProductModel');

const products = [
  {
    name: "Jetsky",
    type: "vehiculo acuatico",
    price: 50000,
    description: "Moto de agua de alta velocidad para hasta 2 personas. Incluye casco y chaleco salvavidas obligatorios.",
    maxPeople: 2,
    requirements: {
      requiresHelmet: true,
      requiresLifeJacket: true,
    }
  },
  {
    name: "Cuatriciclo",
    type: "vehiculo terrestre",
    price: 40000,
    description: "Cuatriciclo de aventura para 1 o 2 personas. Incluye casco obligatorio.",
    maxPeople: 2,
    requirements: {
      requiresHelmet: true,
    }
  },
  {
    name: "Equipo de Buceo",
    type: "equipamiento acuatico",
    price: 35000,
    description: "Equipo profesional para bucear en zonas habilitadas.",
    maxPeople: 1,
  },
  {
    name: "Tabla de Surf (Niños)",
    type: "equipamiento acuatico",
    price: 20000,
    description: "Tabla de surf para niños de hasta 14 años.",
    maxPeople: 1,
  },
  {
    name: "Tabla de Surf (Adultos)",
    type: "equipamiento acuatico",
    price: 25000,
    description: "Tabla de surf, ideal para iniciarse en el surf. Para mayores de 14 años",
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