const  { login, register } = require('../controller/authController');
const express = require('express');
const dotenv = require('dotenv');
const { getAllBookings, updateBookingStatus, deleteBooking } = require('../controller/bookingController');


dotenv.config();

const app = express();


module.exports = (app) => {
  app.post("/login", login);

  app.post("/register", register);

  app.get('/admin/getAllBookings', getAllBookings);

  app.put('/admin/updateBookingStatus/:id', updateBookingStatus);

  app.delete('/admin/deleteBooking/:id', deleteBooking);
};