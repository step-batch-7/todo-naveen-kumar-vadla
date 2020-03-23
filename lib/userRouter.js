'use strict';

const express = require('express');
const userRouter = express.Router();

const {
  serveTasks,
  createTodo,
  removeTodo,
  addTask,
  removeTask,
  toggleTaskCompletion,
  editTitle,
  editTask,
  redirectToLogin,
  hasFields
} = require('./handlers');

userRouter.use(redirectToLogin);
userRouter.use(express.static('public', { index: 'homePage.html' }));

userRouter.get('/tasks', serveTasks);

userRouter.post('/createTodo', hasFields('title'), createTodo);
userRouter.post('/removeTodo', hasFields('todoId'), removeTodo);
userRouter.post('/addTask', hasFields('todoId', 'work'), addTask);
userRouter.post('/removeTask', hasFields('todoId', 'taskId'), removeTask);
userRouter.post(
  '/toggleTaskCompletion',
  hasFields('todoId', 'taskId'),
  toggleTaskCompletion
);
userRouter.post('/editTitle', hasFields('todoId', 'newTitle'), editTitle);
userRouter.post(
  '/editTask',
  hasFields('todoId', 'taskId', 'newWork'),
  editTask
);

module.exports = userRouter;
