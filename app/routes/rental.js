const express = require('express');
const RentalController = require('../controllers/RentalController');

const router = express.Router();

router.get('/', RentalController.listall)
      .post('/', RentalController.create)
      .patch('/cancel/:id', RentalController.cancel)
      .patch('/cancel-storm/:id', RentalController.cancelByStorm)
      .get('/cancel-unpaid-cash', RentalController.cancelUnpaidCash)
      .get('/available-slots', RentalController.getAvailableSlots);

module.exports = router;