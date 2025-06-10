const Rental = require('../models/RentalModel');
const Product = require('../models/ProductModel');
const moment = require('moment');

async function validateAndCreateRentalList(rentalsData) {
  const errors = [];
  const createdRentals = [];
  const now = moment();

  const grouped = groupByCustomerAndProduct(rentalsData);

  for (const group of Object.values(grouped)) {
    if (exceedsConsecutiveLimit(group)) {
      errors.push({ message: 'No se pueden reservar más de 3 turnos consecutivos para el mismo producto' });
      continue;
    }

    for (const rental of group) {
      const validation = await validateRental(rental, now);
      if (validation.error) {
        errors.push({ message: validation.error });
        continue;
      }

      createdRentals.push(validation.rental);
    }
  }

  if (errors.length > 0) throw { message: 'Errores en las reservas', errors };

  applyMultipleProductDiscount(createdRentals);

  return await Rental.insertMany(createdRentals);
}

function groupByCustomerAndProduct(data) {
  return data.reduce((acc, r) => {
    const key = `${r.customer}_${r.product}`;
    acc[key] = acc[key] || [];
    acc[key].push(r);
    return acc;
  }, {});
}

function exceedsConsecutiveLimit(group) {
  const sorted = group.sort((a, b) => moment(`${a.date} ${a.startTime}`).diff(moment(`${b.date} ${b.startTime}`)));
  let count = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prevEnd = moment(`${sorted[i - 1].date} ${sorted[i - 1].endTime}`, 'YYYY-MM-DD HH:mm');
    const currStart = moment(`${sorted[i].date} ${sorted[i].startTime}`, 'YYYY-MM-DD HH:mm');
    if (currStart.isSame(prevEnd)) {
      count++;
      if (count > 3) return true;
    } else if (currStart.diff(prevEnd, 'minutes') < 30) {
      // Si no hay un turno libre de al menos 30 minutos entre bloques de 3 turnos
      return true;
    } else {
      count = 1;
    }
  }
  return false;
}

async function validateRental(rental, now) {
  const { product: productId, date, startTime, endTime, customer, peopleCount, paymentMethod, isPaid } = rental;

  const product = await Product.findById(productId);
  if (!product) return { error: `Producto con ID ${productId} no encontrado` };

  const start = moment(`${date} ${startTime}`, 'YYYY-MM-DD HH:mm');
  const end = moment(`${date} ${endTime}`, 'YYYY-MM-DD HH:mm');

  if (!start.isValid() || !end.isValid()) return { error: 'Fecha u hora con formato inválido' };
  if (end.diff(start, 'minutes') !== 30) return { error: 'La duración del turno debe ser exactamente 30 minutos' };
  if (start.diff(now, 'hours') > 48) return { error: 'No se pueden reservar turnos con más de 48 horas de anticipación' };

  const overlapping = await Rental.findOne({ product: productId, date, startTime });
  if (overlapping) return { error: `El producto "${product.name}" ya tiene un turno reservado a las ${startTime} del ${date}` };

  // Automatizar la inclusión de casco y chaleco salvavidas si son requeridos
  const includesHelmet = rental.includesHelmet ?? product.requirements.requiresHelmet;
  const includesLifeJacket = rental.includesLifeJacket ?? product.requirements.requiresLifeJacket;

  if (product.requirements.requiresHelmet && (!includesHelmet || peopleCount > product.maxPeople)) {
    return { error: `El alquiler del producto "${product.name}" requiere casco(s) y no se incluyó en la reserva` };
  }
  if (product.requirements.requiresLifeJacket && (!includesLifeJacket || peopleCount > product.maxPeople)) {
    return { error: `El alquiler del producto "${product.name}" requiere chaleco(s) salvavidas y no se incluyó en la reserva` };
  }

  return {
    rental: {
      product: productId,
      customer,
      date,
      startTime,
      endTime,
      peopleCount,
      priceTotal: product.price,
      paymentMethod,
      isPaid,
      includesHelmet,
      includesLifeJacket,
      status: 'active',
      currency: rental.currency || 'ARS'
    },
  };
}

function applyMultipleProductDiscount(rentals) {
  const rentalsByCustomer = rentals.reduce((acc, rental) => {
    const customerId = rental.customer.toString();
    acc[customerId] = acc[customerId] || [];
    acc[customerId].push(rental);
    return acc;
  }, {});

  for (const customerRentals of Object.values(rentalsByCustomer)) {
    const uniqueProducts = new Set(customerRentals.map(r => r.product.toString()));
    if (uniqueProducts.size > 1) {
      const totalPrice = customerRentals.reduce((sum, r) => sum + r.priceTotal, 0);
      const discountedTotal = totalPrice * 0.9;
      const ratio = discountedTotal / totalPrice;

      customerRentals.forEach(r => {
        r.priceTotal = Math.round(r.priceTotal * ratio); // descuento proporcional
      });
    }
  }
}

async function cancelRentalByStorm(rentalId) {
  const rental = await Rental.findById(rentalId).populate('customer');
  if (!rental || rental.status !== 'active') {
    throw new Error(`Turno con ID ${rentalId} no encontrado o ya cancelado`);
  }

  rental.status = 'cancelled';
  await rental.save();

  if (rental.isPaid) {
    const refundAmount = rental.priceTotal * 0.5;
    rental.customer.credits += refundAmount;
    await rental.customer.save();
    return { rental, refundAmount };
  }

  return { rental, refundAmount: 0 };
}

async function cancelUnpaidCashRentals() {
  const now = moment();
  const twoHoursAhead = now.add(2, 'hours');

  const rentalsToCancel = await Rental.find({
    paymentMethod: 'cash',
    isPaid: false,
    status: 'active',
    $expr: {
      $lte: [
        {
          $dateFromString: {
            dateString: {
              $concat: [
                { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                'T',
                '$startTime',
              ],
            },
          },
        },
        twoHoursAhead.toDate(),
      ],
    },
  });

  const ids = rentalsToCancel.map(r => r._id);

  await Rental.updateMany({ _id: { $in: ids } }, { status: 'cancelled' });

  return ids;
}

async function getAvailableSlots(productId, date) {
  const slots = [];
  const startHour = 8;
  const endHour = 20;

  for (let hour = startHour; hour < endHour; hour++) {
    let startTime = `${hour.toString().padStart(2, '0')}:00`;
    let endTime = `${hour.toString().padStart(2, '0')}:30`;

    let overlapping = await Rental.findOne({
      product: productId,
      date,
      startTime,
    });

    if (!overlapping) {
      slots.push({ startTime, endTime });
    }

    startTime = `${hour.toString().padStart(2, '0')}:30`;
    endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
    if (hour + 1 === endHour) {
      if (startTime === `${endHour}:00`) continue;
    }

    overlapping = await Rental.findOne({
      product: productId,
      date,
      startTime,
    });

    if (!overlapping) {
      slots.push({ startTime, endTime });
    }
  }

  slots.sort((a, b) => {
    const timeA = parseInt(a.startTime.split(':')[0]) * 60 + parseInt(a.startTime.split(':')[1]);
    const timeB = parseInt(b.startTime.split(':')[0]) * 60 + parseInt(b.startTime.split(':')[1]);
    return timeA - timeB;
  });

  return slots;
}

module.exports = {
  validateAndCreateRentalList,
  cancelRentalByStorm,
  cancelUnpaidCashRentals,
  getAvailableSlots,
  applyMultipleProductDiscount,
};