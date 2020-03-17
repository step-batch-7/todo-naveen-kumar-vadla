'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

const {
  serveTasks,
  createTodo,
  removeTodo,
  addTask,
  removeTask,
  toggleTaskCompletion,
  editTitle,
  editTask,
  login,
  signUp,
  getUser,
  redirectToHome,
  redirectToLogin,
  logout
} = require('./handlers');

const hasFields = (...parameters) => {
  return function(req, res, next) {
    if (parameters.every(param => param in req.body)) {
      return next();
    }
    res.statusCode = 400;
    res.end('Bad Request');
  };
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(getUser);

app.get('/', redirectToHome);
app.get('/homePage.html', redirectToLogin);
app.get('/tasks', serveTasks);

app.use(express.static('public'));

app.post('/createTodo', hasFields('title'), createTodo);
app.post('/removeTodo', hasFields('todoId'), removeTodo);
app.post('/addTask', hasFields('todoId', 'work'), addTask);
app.post('/removeTask', hasFields('todoId', 'taskId'), removeTask);
app.post(
  '/toggleTaskCompletion',
  hasFields('todoId', 'taskId'),
  toggleTaskCompletion
);
app.post('/editTitle', hasFields('todoId', 'newTitle'), editTitle);
app.post('/editTask', hasFields('todoId', 'taskId', 'newWork'), editTask);

app.post('/login', hasFields('userName', 'password'), login);
app.post(
  '/signUp',
  hasFields('userName', 'password', 'fullName', 'mail'),
  signUp
);
app.get('/logout', logout);

module.exports = app;
