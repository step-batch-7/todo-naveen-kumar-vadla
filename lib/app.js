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
  login
} = require('./handlers');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/tasks', serveTasks);

app.post('/createTodo', createTodo);
app.post('/removeTodo', removeTodo);
app.post('/addTask', addTask);
app.post('/removeTask', removeTask);
app.post('/toggleTaskCompletion', toggleTaskCompletion);
app.post('/editTitle', editTitle);
app.post('/editTask', editTask);

app.post('/login', login);

module.exports = app;
