const mongoose = require('mongoose');

const RentalSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  date: { 
    type: Date, 
    required: true,
  },
  startTime: { 
    type: String, // ej. "10:00"
    required: true,
  },
  endTime: { 
    type: String, // ej."10:30"
    required: true,
  },
  peopleCount: { 
    type: Number, 
    required: true,
    default: 1,
  },
  includesHelmet: {
    type: Boolean,
    default: false,
  },
  includesLifeJacket: {
    type: Boolean,
    default: false,
  },
  priceTotal: { 
    type: Number, 
    required: true,
  },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'cancelled'],
    default: 'active',
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card'],
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  currency: {
    type: String,
    enum: ['ARS', 'USD'],
    required: true,
    default: 'ARS'
  },
}, { timestamps: true });

const Rental = mongoose.model('Rental', RentalSchema);

module.exports = Rental;