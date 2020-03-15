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
  const user = userList.findUser(req.user);
  writeIntoFile(DATA_PATH, JSON.stringify(userList.getUsers()));
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(JSON.stringify(user.todoList.todos));
};

const createTodo = (req, res) => {
  const { title } = req.body;
  const user = userList.findUser(req.user);
  user.todoList.addTodo(title);
  serveTasks(req, res);
};

const removeTodo = (req, res) => {
  const { todoId } = req.body;
  const user = userList.findUser(req.user);
  user.todoList.removeTodo(todoId);
  serveTasks(req, res);
};

const addTask = (req, res) => {
  const { todoId, work } = req.body;
  const user = userList.findUser(req.user);
  user.todoList.addTaskToTodo(todoId, work);
  serveTasks(req, res);
};

const removeTask = (req, res) => {
  const { taskId, todoId } = req.body;
  const user = userList.findUser(req.user);
  user.todoList.removeTaskFromTodo(taskId, todoId);
  serveTasks(req, res);
};

const toggleTaskCompletion = (req, res) => {
  const { taskId, todoId } = req.body;
  const user = userList.findUser(req.user);
  user.todoList.changeTaskStatus(taskId, todoId);
  serveTasks(req, res);
};

const editTitle = (req, res) => {
  const { newTitle, todoId } = req.body;
  const user = userList.findUser(req.user);
  user.todoList.editTodoTitle(todoId, newTitle);
  serveTasks(req, res);
};

const editTask = (req, res) => {
  const { newWork, taskId, todoId } = req.body;
  const user = userList.findUser(req.user);
  user.todoList.editTodoTask(taskId, todoId, newWork);
  serveTasks(req, res);
};

const login = (req, res) => {
  const { userName, password } = req.body;
  if (userList.isAnExistingUser(userName, password)) {
    const user = userList.findUser(userName);
    res.cookie('sessionId', user.id);
    res.redirect('homePage.html');
    return;
  }
  res.redirect('/');
};

const signUp = (req, res) => {
  userList.add(req.body);
  res.redirect('/');
};

const getUser = (req, res, next) => {
  const sessionId = req.cookies.sessionId;
  if (sessionId) {
    const users = userList.getUsers();
    const user = users.find(user => user.id === +sessionId);
    req.user = user && user.userName;
  }
  next();
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
  getUser
};
