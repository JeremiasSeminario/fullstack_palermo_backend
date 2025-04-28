const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

const Product = require('./routes/product');
const Customer = require('./routes/customer');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("API funcionando");
});

/* endpoints */
app.use("/products", Product);
app.use("/customers", Customer);

module.exports = app
