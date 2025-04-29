const Customer = require('../models/CustomerModel');

function listall(req, res) {
  Customer.find({})
    .then(customers => {
      if (customers.length) return res.status(200).send({ customers });
      return res.status(200).send({ message: 'No Content' });
    })
    .catch(err => res.status(500).send({ err }));
}

function create(req, res) {
  let customer = new Customer(req.body);
  customer.save()
    .then(customer => res.status(201).send({ customer }))
    .catch(err => {
      if (err.code === 11000) {
        // Error de clave duplicada en el campo dni
        return res.status(400).send({
          error: 'Ya existe un cliente con este DNI',
          keyValue: err.keyValue,
        });
      }
      return res.status(500).send({ error: 'Error al crear el cliente', details: err });
    });
}

function show(req, res) {
  if (req.body.error) return res.status(500).send({ error });
  if (!req.body.customers) return res.status(404).send({ message: 'Not Found' });
  let customers = req.body.customers;
  return res.status(200).send({ customers });
}

function update(req, res) {
  if (req.body.error) return res.status(500).send({ error });
  if (!req.body.customers) return res.status(404).send({ message: 'Not Found' });
  let customer = req.body.customers[0];
  customer = Object.assign(customer, req.body);
  customer.save()
    .then(customer => res.status(200).send({ message: 'Customer Updated', customer }))
    .catch(err => res.status(500).send({ err }));
}

function deleted(req, res) {
  if (req.body.error) return res.status(500).send({ error });
  if (!req.body.customers) return res.status(404).send({ message: 'Not Found' });
  req.body.customers[0].remove()
    .then(customer => res.status(200).send({ message: 'Customer removed', customer }))
    .catch(err => res.status(500).send({ err }));
}

function find(req, res, next) {
  let query = {};
  query[req.params.key] = req.params.value;
  Customer.find(query)
    .then(customers => {
      if (!customers.length) return next();
      req.body.customers = customers;
      return next();
    })
    .catch(err => {
      req.body.error = err;
      next();
    });
}

module.exports = {
  listall,
  show,
  create,
  update,
  deleted,
  find,
};