'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

const userRouter = require('./userRouter');

const {
  login,
  signUp,
  redirectToHome,
  logout,
  getUser,
  hasFields
} = require('./handlers');

const logger = (req, res, next) => {
  console.log(req.method, req.url);
  next();
};
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(getUser);
app.use('/user', userRouter);

app.get('/', redirectToHome);

app.use(express.static('public'));

app.post('/login', hasFields('userName', 'password'), login);
app.post(
  '/signUp',
  hasFields('userName', 'password', 'fullName', 'mail'),
  signUp
);
app.get('/logout', logout);

module.exports = app;
