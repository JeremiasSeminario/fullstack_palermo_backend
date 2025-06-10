const express = require("express");
const path = require("path");
const cors = require('cors');
const config = require('./config/config.js');

const app = express();

const Product = require('./routes/product');
const Customer = require('./routes/customer');
const Rental = require('./routes/rental');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: config.FRONTEND_URL, // URL de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get("/", (req, res) => {
  res.send("API funcionando");
});

/* endpoints */
app.use("/products", Product);
app.use("/customers", Customer);
app.use("/rentals", Rental);

module.exports = app
