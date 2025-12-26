const  { login, register, getAllUsers } = require('../controller/authController');
const express = require('express');
const dotenv = require('dotenv');
const { getAllBookings, updateBookingStatus, deleteBooking } = require('../controller/bookingController');
const  { authenticateToken } = require('../middleware/authMiddleware');


dotenv.config();

const app = express();


module.exports = (app) => {
  app.post("/login", login);

  app.post("/register", register);

  app.get('/admin/getAllUsers', getAllUsers);

  app.get('/admin/getAllBookings', authenticateToken, getAllBookings);

  app.put('/admin/updateBookingStatus/:id', authenticateToken, updateBookingStatus);

  app.delete('/admin/deleteBooking/:id', authenticateToken, deleteBooking);
};