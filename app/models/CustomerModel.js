const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  email: { 
    type: String 
  },
  phone: { 
    type: String 
  },
  credits: { 
    type: Number, default: 0 
  },//en caso de que el cliente tenga un saldo a favor por reembolso.
});

const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = Customer;
