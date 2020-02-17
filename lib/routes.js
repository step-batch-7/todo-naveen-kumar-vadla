'use strict';

const App = require('./app');

const app = new App();
const handlers = require('./handlers');

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
