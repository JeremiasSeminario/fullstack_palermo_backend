const express = require("express");
const path = require("path");

const app = express();

const Product = require('./routes/product');
const Customer = require('./routes/customer');
const Rental = require('./routes/rental');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("API funcionando");
});

/* endpoints */
app.use("/products", Product);
app.use("/customers", Customer);
app.use("/rentals", Rental);

module.exports = app
