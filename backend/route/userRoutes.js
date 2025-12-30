const express = require('express');
const dotenv = require('dotenv');
const { createBooking, getBookingsByUserId, getBookingsByUserId2 } = require('../controller/bookingController');
const  { authenticateToken } = require('../middleware/authMiddleware');

dotenv.config();

const app = express();


module.exports = (app) => {
  app.post("/user/createBooking", authenticateToken, createBooking);
  
  app.get('/user/getBookingsByUserId/:id',  getBookingsByUserId);

  app.get('/user/getBookingsByUserId2/:id',  getBookingsByUserId2);
};