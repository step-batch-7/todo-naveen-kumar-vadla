'use strict';

const fs = require('fs');
const queryString = require('querystring');

const CONTENT_TYPES = require('./mimeTypes');
const App = require('./app');

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

const areStatsOk = path => {
  const stat = fs.existsSync(path) && fs.statSync(path);
  return stat && stat.isFile();
};

const decideUrl = url => {
  return url === '/' ? '/index.html' : url;
};

const serveStaticFile = (req, res, next) => {
  const url = decideUrl(req.url);
  const path = `${STATIC_FOLDER}${url}`;
  if (!areStatsOk(path)) {
    return next();
  }
  const [, extension] = path.match(/.*\.(.*)$/) || [];
  const content = fs.readFileSync(path);
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
  const [lastTask] = todoLists;
  const id = lastTask ? lastTask.id + NUMBER_ONE : NUMBER_ONE;
  todoLists.unshift({ id, title, tasks: [] });
  serveTasks(req, res);
};

const removeList = (req, res) => {
  const { id } = req.body;
  const taskIndex = todoLists.findIndex(task => task.id === +id);
  todoLists.splice(taskIndex, NUMBER_ONE);
  serveTasks(req, res);
};

const addTask = (req, res) => {
  const { id, work } = req.body;
  const [list] = todoLists.filter(todoList => todoList.id === +id);
  const lastTask = list.tasks[list.tasks.length - NUMBER_ONE];
  const taskId = lastTask ? lastTask.id + NUMBER_ONE : NUMBER_ONE;
  list.tasks.push({ id: taskId, work });
  serveTasks(req, res);
};

const app = new App();

app.use(readBody);

app.get('/tasks', serveTasks);
app.get('', serveStaticFile);
app.get('', serveNotFoundPage);

app.post('/createList', createList);
app.post('/addTask', addTask);
app.post('/removeList', removeList);
app.post('', serveNotFoundPage);

app.use(serveBadRequestPage);

module.exports = app;
