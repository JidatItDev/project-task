const  { login, register } = require('../controller/authController');
const express = require('express');
const dotenv = require('dotenv');


dotenv.config();

const app = express();


module.exports = (app) => {
  app.post("/login", login);
  app.post("/register", register);
};