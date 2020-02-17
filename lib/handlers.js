'use strict';

const CONTENT_TYPES = require('./mimeTypes');
const { isExistingFile, readFromFile, writeIntoFile } = require('./fsUtils');
const { TodoList } = require('../lib/todoListClass');

const { DATA_PATH } = require('../config');
const STATIC_FOLDER = `${__dirname}/../public`;

const readBody = (req, res, next) => {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    req.body = data;
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

const loadTasks = () => {
  if (isExistingFile(DATA_PATH)) {
    return TodoList.load(readFromFile(DATA_PATH));
  }
  return [];
};

const todoList = loadTasks();

const serveTasks = (req, res) => {
  writeIntoFile(DATA_PATH, JSON.stringify(todoList.todos));
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(JSON.stringify(todoList.todos));
};

const createTodo = (req, res) => {
  const { title } = JSON.parse(req.body);
  todoList.addTodo(title);
  serveTasks(req, res);
};

const removeTodo = (req, res) => {
  const { todoId } = JSON.parse(req.body);
  todoList.removeTodo(todoId);
  serveTasks(req, res);
};

const addTask = (req, res) => {
  const { todoId, work } = JSON.parse(req.body);
  todoList.addTaskToTodo(todoId, work);
  serveTasks(req, res);
};

const removeTask = (req, res) => {
  const { taskId, todoId } = JSON.parse(req.body);
  todoList.removeTaskFromTodo(taskId, todoId);
  serveTasks(req, res);
};

const toggleTaskCompletion = (req, res) => {
  const { taskId, todoId } = JSON.parse(req.body);
  todoList.changeTaskStatus(taskId, todoId);
  serveTasks(req, res);
};

const editTitle = (req, res) => {
  const { newTitle, todoId } = JSON.parse(req.body);
  todoList.editTodoTitle(todoId, newTitle);
  serveTasks(req, res);
};

const editTask = (req, res) => {
  const { newWork, taskId, todoId } = JSON.parse(req.body);
  todoList.editTodoTask(taskId, todoId, newWork);
  serveTasks(req, res);
};

module.exports = {
  readBody,
  serveStaticFile,
  serveNotFoundPage,
  serveBadRequestPage,
  serveTasks,
  createTodo,
  removeTodo,
  addTask,
  removeTask,
  toggleTaskCompletion,
  editTitle,
  editTask
};
