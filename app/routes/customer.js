const express = require('express');
const CustomerController = require('../controllers/CustomerController');

const router = express.Router();

router.get('/', CustomerController.listall)
      .post('/', CustomerController.create)
      .get('/:key/:value', CustomerController.find, CustomerController.show)
      .put('/:key/:value', CustomerController.find, CustomerController.update)
      .delete('/:key/:value', CustomerController.find, CustomerController.deleted)

module.exports = router;

//:limit/:offset