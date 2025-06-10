const mongoose = require('mongoose');
const Product = require('./app/models/ProductModel');

const products = [
  {
    name: "Jetski",
    price: 20000,
    description: "Vive una experiencia extrema sobre el agua con nuestros potentes JetSkis. Ideal para quienes buscan adrenalina y velocidad en el mar.",
    maxPeople: 2,
    requirements: {
      requiresHelmet: true,
      requiresLifeJacket: true,
    }
  },
  {
    name: "Cuatriciclo",
    price: 16000,
    description: "Explora la costa y sus alrededores con nuestros cuatriciclos. Potentes, seguros y listos para la aventura en terrenos variados.",
    maxPeople: 2,
    requirements: {
      requiresHelmet: true,
    }
  },
  {
    name: "Equipo de Buceo",
    price: 14000,
    description: "Sumérgete en el mundo submarino con equipos de buceo profesionales. Ideal para quienes buscan tranquilidad y exploración marina.",
    maxPeople: 1,
  },
  {
    name: "Tabla de Surf (Adultos)",
    price: 8000,
    description: "Tabla de surf profesional para adultos, perfecta para principiantes y surfistas con experiencia. Incluye asesoramiento y tips técnicos.",
    maxPeople: 1,
  },
  {
    name: "Tabla de Surf (Niños)",
    price: 6000,
    description: "Tabla pequeña y segura diseñada especialmente para niños. Ideal para quienes desean iniciar en el surf, con guía básica incluida.",
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