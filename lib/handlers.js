'use strict';

const queryString = require('querystring');

const CONTENT_TYPES = require('./mimeTypes');
const App = require('./app');
const { isExistingFile, readFromFile } = require('./fsUtils');

const STATIC_FOLDER = `${__dirname}/../public`;

const readBody = (req, res, next) => {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    req.body = queryString.parse(data);
    next();
  });
};

const serveNotFoundPage = (req, res) => {
  const content = '404 File Not Found';
  res.setHeader('Content-Type', CONTENT_TYPES.txt);
  res.setHeader('Content-Length', content.length);
  res.statusCode = 404;
  res.end(content);
};

const serveBadRequestPage = (req, res) => {
  const content = '400 Method Not Allowed';
  res.setHeader('Content-Type', CONTENT_TYPES.txt);
  res.setHeader('Content-Length', content.length);
  res.statusCode = 400;
  res.end(content);
};

const decideUrl = url => {
  return url === '/' ? '/index.html' : url;
};

const serveStaticFile = (req, res, next) => {
  const url = decideUrl(req.url);
  const path = `${STATIC_FOLDER}${url}`;
  if (!isExistingFile(path)) {
    return next();
  }
  const [, extension] = path.match(/.*\.(.*)$/) || [];
  const content = readFromFile(path);
  res.setHeader('Content-Type', CONTENT_TYPES[extension]);
  res.setHeader('Content-Length', content.length);
  res.end(content);
};

const todoLists = [];
const NUMBER_ONE = 1;

const serveTasks = (req, res) => {
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(JSON.stringify(todoLists));
};

const createList = (req, res) => {
  const { title } = req.body;
  const [lastList] = todoLists;
  const listId = lastList ? lastList.id + NUMBER_ONE : NUMBER_ONE;
  todoLists.unshift({ id: listId, title, tasks: [] });
  serveTasks(req, res);
};

const removeList = (req, res) => {
  const { listId } = req.body;
  const listIndex = todoLists.findIndex(list => list.id === +listId);
  todoLists.splice(listIndex, NUMBER_ONE);
  serveTasks(req, res);
};

const addTask = (req, res) => {
  const { listId, work } = req.body;
  const list = todoLists.find(todoList => todoList.id === +listId);
  const lastTask = list.tasks[list.tasks.length - NUMBER_ONE];
  const taskId = lastTask ? lastTask.id + NUMBER_ONE : NUMBER_ONE;
  list.tasks.push({ id: taskId, work, isCompleted: false });
  serveTasks(req, res);
};

const removeTask = (req, res) => {
  const { taskId, listId } = req.body;
  const list = todoLists.find(todoList => todoList.id === +listId);
  const taskIndex = list.tasks.findIndex(task => task.id === +taskId);
  list.tasks.splice(taskIndex, NUMBER_ONE);
  serveTasks(req, res);
};

const toggleTaskCompletion = (req, res) => {
  const { taskId, listId } = req.body;
  const list = todoLists.find(todoList => todoList.id === +listId);
  const task = list.tasks.find(task => task.id === +taskId);
  task.isCompleted = !task.isCompleted;
  serveTasks(req, res);
};

const app = new App();

app.use(readBody);

app.get('/tasks', serveTasks);
app.get('', serveStaticFile);
app.get('', serveNotFoundPage);

app.post('/createList', createList);
app.post('/removeList', removeList);
app.post('/addTask', addTask);
app.post('/removeTask', removeTask);
app.post('/completeTask', toggleTaskCompletion);
app.post('', serveNotFoundPage);

app.use(serveBadRequestPage);

module.exports = app;
