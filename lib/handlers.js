'use strict';

const CONTENT_TYPES = require('./mimeTypes');
const { isExistingFile, readFromFile, writeIntoFile } = require('./fsUtils');
const { TodoList } = require('../lib/todoListClass');

const { DATA_PATH } = require('../config');

const loadTasks = () => {
  if (isExistingFile(DATA_PATH)) {
    return TodoList.load(readFromFile(DATA_PATH));
  }
  return new TodoList();
};

const todoList = loadTasks();

const serveTasks = (req, res) => {
  writeIntoFile(DATA_PATH, JSON.stringify(todoList.todos));
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(JSON.stringify(todoList.todos));
};

const createTodo = (req, res) => {
  const { title } = req.body;
  todoList.addTodo(title);
  serveTasks(req, res);
};

const removeTodo = (req, res) => {
  const { todoId } = req.body;
  todoList.removeTodo(todoId);
  serveTasks(req, res);
};

const addTask = (req, res) => {
  const { todoId, work } = req.body;
  todoList.addTaskToTodo(todoId, work);
  serveTasks(req, res);
};

const removeTask = (req, res) => {
  const { taskId, todoId } = req.body;
  todoList.removeTaskFromTodo(taskId, todoId);
  serveTasks(req, res);
};

const toggleTaskCompletion = (req, res) => {
  const { taskId, todoId } = req.body;
  todoList.changeTaskStatus(taskId, todoId);
  serveTasks(req, res);
};

const editTitle = (req, res) => {
  const { newTitle, todoId } = req.body;
  todoList.editTodoTitle(todoId, newTitle);
  serveTasks(req, res);
};

const editTask = (req, res) => {
  const { newWork, taskId, todoId } = req.body;
  todoList.editTodoTask(taskId, todoId, newWork);
  serveTasks(req, res);
};

module.exports = {
  serveTasks,
  createTodo,
  removeTodo,
  addTask,
  removeTask,
  toggleTaskCompletion,
  editTitle,
  editTask
};
