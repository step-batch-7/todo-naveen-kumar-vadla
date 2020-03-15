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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(getUser);

app.get('/', redirectToHome);
app.get('/homePage.html', redirectToLogin);
app.get('/tasks', serveTasks);

app.use(express.static('public'));

app.post('/createTodo', createTodo);
app.post('/removeTodo', removeTodo);
app.post('/addTask', addTask);
app.post('/removeTask', removeTask);
app.post('/toggleTaskCompletion', toggleTaskCompletion);
app.post('/editTitle', editTitle);
app.post('/editTask', editTask);
app.get('/logout', logout);

app.post('/login', login);
app.post('/signUp', signUp);

module.exports = app;
