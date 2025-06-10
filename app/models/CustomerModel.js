const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  dni: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String
  },
  credits: {
    type: Number, default: 0
  },
});

const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = Customer;
