'use strict';

const CONTENT_TYPES = require('./mimeTypes');
const { isExistingFile, readFromFile, writeIntoFile } = require('./fsUtils');
const UserList = require('./userListClass');

const { DATA_PATH } = require('../config');

const loadUsers = () => {
  if (isExistingFile(DATA_PATH)) {
    return UserList.load(readFromFile(DATA_PATH));
  }
  return new UserList();
};

const userList = loadUsers();

const serveTasks = (req, res) => {
  const user = req.user;
  writeIntoFile(DATA_PATH, JSON.stringify(userList.getUsers()));
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(JSON.stringify(user.todos));
};

const createTodo = (req, res) => {
  const { title } = req.body;
  const user = req.user;
  user.addTodo(title);
  serveTasks(req, res);
};

const removeTodo = (req, res) => {
  const { todoId } = req.body;
  const user = req.user;
  user.removeTodo(todoId);
  serveTasks(req, res);
};

const addTask = (req, res) => {
  const { todoId, work } = req.body;
  const user = req.user;
  user.addTaskToTodo(todoId, work);
  serveTasks(req, res);
};

const removeTask = (req, res) => {
  const { taskId, todoId } = req.body;
  const user = req.user;
  user.removeTaskFromTodo(taskId, todoId);
  serveTasks(req, res);
};

const toggleTaskCompletion = (req, res) => {
  const { taskId, todoId } = req.body;
  const user = req.user;
  user.changeTaskStatus(taskId, todoId);
  serveTasks(req, res);
};

const editTitle = (req, res) => {
  const { newTitle, todoId } = req.body;
  const user = req.user;
  user.editTodoTitle(todoId, newTitle);
  serveTasks(req, res);
};

const editTask = (req, res) => {
  const { newWork, taskId, todoId } = req.body;
  const user = req.user;
  user.editTodoTask(taskId, todoId, newWork);
  serveTasks(req, res);
};

const login = (req, res) => {
  const { userName, password } = req.body;
  if (userList.isAnExistingUser(userName, password)) {
    const user = userList.findUser(userName);
    res.cookie('sessionId', user.id);
    res.redirect('/user/');
    return;
  }
  res.redirect('/');
};

const signUp = (req, res) => {
  if (userList.findUser(req.body.userName)) {
    res.end(`User Name ${req.body.userName} Already in use`);
    return;
  }
  userList.add(req.body);
  res.redirect('/');
};

const logout = (req, res) => {
  res.clearCookie('sessionId');
  res.redirect('/');
};

const getUser = (req, res, next) => {
  const sessionId = req.cookies.sessionId;
  if (sessionId) {
    req.user = userList.getUsers().find(user => user.id === +sessionId);
  }
  next();
};

const redirectToLogin = (req, res, next) => {
  const user = req.user;
  return user ? next() : res.redirect('/');
};

const redirectToHome = (req, res, next) => {
  const user = req.user;
  return user ? res.redirect('/user/') : next();
};

const hasFields = (...parameters) => {
  return function(req, res, next) {
    if (parameters.every(param => param in req.body)) {
      return next();
    }
    res.statusCode = 400;
    res.end('Bad Request');
  };
};

module.exports = {
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
  logout,
  hasFields
};
