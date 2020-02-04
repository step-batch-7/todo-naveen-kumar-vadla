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
const NUMBER = 1;

const createTodoList = ( req, res ) => {
  const { title } = req.body;
  const [lastTask] = todoLists;
  const id = lastTask ? lastTask.id + NUMBER : NUMBER;
  todoLists.unshift({id, title, tasks: []});
  res.statusCode = 301;
  res.setHeader('Location', '/');
  res.end();
};

const serveTasks = (req, res) => {
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(JSON.stringify(todoLists));
};

const removeList = (req, res) => {
  const {id} = req.body;
  const taskIndex = todoLists.findIndex(task => task.id === +id);
  todoLists.splice(taskIndex, NUMBER);
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(todoLists));
};

const app = new App();

app.use(readBody);

app.get('/tasks', serveTasks);
app.get('', serveStaticFile);
app.get('', serveNotFoundPage);

app.post('/createList', createTodoList);
app.post('/removeList', removeList);
app.post('', serveNotFoundPage);

app.use(serveBadRequestPage);

module.exports = app; 