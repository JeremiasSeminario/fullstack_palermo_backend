const Rental = require('../models/RentalModel');
const RentalService = require('../services/RentalService');

async function listall(req, res) {
  try {
    const rentals = await Rental.find({})
      .populate('product')
      .populate('customer');

    if (rentals.length === 0) return res.status(204).send({ message: 'No Content' });

    return res.status(200).send({ rentals });
  } catch (err) {
    return res.status(500).send({ error: `Error al listar los turnos: ${err.message}` });
  }
}

async function create(req, res) {
  try {
    const rentals = await RentalService.validateAndCreateRentalList(req.body);
    return res.status(201).send({ rentals });
  } catch (err) {
    return res.status(400).send({ error: `Error al crear los turnos: ${err.message}`, errors: err.errors || [] });
  }
}

async function cancel(req, res) {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental || rental.status !== 'active') {
      return res.status(400).send({ error: 'Turno no encontrado o ya cancelado',
      currentStatus: rental ? rental.status : 'not found'
       });
    }

    rental.status = 'cancelled';
    await rental.save();

    // Recalcular descuentos si aplica
    const customerRentals = await Rental.find({ customer: rental.customer, status: 'active' });
    RentalService.applyMultipleProductDiscount(customerRentals);

    return res.status(200).send({
      message: 'Turno cancelado correctamente',
      rental,
      refund: rental.isPaid ? rental.priceTotal : 0,
    });
  } catch (err) {
    return res.status(500).send({ error: `Error al cancelar el turno: ${err.message}` });
  }
}

async function cancelByStorm(req, res) {
  try {
    const result = await RentalService.cancelRentalByStorm(req.params.id);
    return res.status(200).send({
      message: 'Turno cancelado correctamente (Tormenta)',
      rental: result.rental,
      refund: result.refundAmount,
    });
  } catch (err) {
    return res.status(400).send({ error: `Error al cancelar por tormenta: ${err.message}` });
  }
}

async function cancelUnpaidCash(req, res) {
  try {
    const ids = await RentalService.cancelUnpaidCashRentals();
    return res.status(200).send({
      message: 'Turnos cancelados por falta de pago en efectivo',
      cancelledIds: ids,
    });
  } catch (err) {
    return res.status(500).send({ error: `Error al cancelar turnos por falta de pago: ${err.message}` });
  }
}

async function getAvailableSlots(req, res) {
  try {
    const { productId, date } = req.query;
    const slots = await RentalService.getAvailableSlots(productId, date);
    return res.status(200).send({ slots });
  } catch (err) {
    return res.status(500).send({ error: `Error al obtener horarios disponibles: ${err.message}` });
  }
}

module.exports = {
  listall,
  create,
  cancel,
  cancelByStorm,
  cancelUnpaidCash,
  getAvailableSlots,
};
