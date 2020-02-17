'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

const handlers = require('./handlers');

app.use(express.json);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(handlers.readBody);

app.get('/tasks', handlers.serveTasks);
app.get('', handlers.serveStaticFile);
app.get('', handlers.serveNotFoundPage);

app.post('/createTodo', handlers.createTodo);
app.post('/removeTodo', handlers.removeTodo);
app.post('/addTask', handlers.addTask);
app.post('/removeTask', handlers.removeTask);
app.post('/toggleTaskCompletion', handlers.toggleTaskCompletion);
app.post('/editTitle', handlers.editTitle);
app.post('/editTask', handlers.editTask);
app.post('', handlers.serveNotFoundPage);

app.use(handlers.serveBadRequestPage);

module.exports = app;
