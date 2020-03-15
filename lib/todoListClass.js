'use strict';

const NUMBER_ONE = 1;

const getIndex = (array, id) => array.findIndex(element => element.id === +id);

const getNewId = lastItem => lastItem ? lastItem.id + NUMBER_ONE : NUMBER_ONE;

class Task {
  constructor(id, work, isCompleted) {
    this.id = id;
    this.work = work;
    this.isCompleted = isCompleted;
  }
  changeStatus() {
    this.isCompleted = !this.isCompleted;
  }
  edit(newWork) {
    this.work = newWork || this.work;
  }
  static load({ id, work, isCompleted }) {
    const task = new Task(id, work, isCompleted);
    return task;
  }
}

class Todo {
  constructor(id, title, tasks) {
    this.id = id;
    this.title = title;
    this.tasks = tasks;
  }
  addTask(work) {
    const previousTask = this.tasks[this.tasks.length - NUMBER_ONE];
    const id = getNewId(previousTask);
    const task = new Task(id, work, false);
    this.tasks.push(task);
  }
  removeTask(id) {
    const taskIndex = getIndex(this.tasks, id);
    this.tasks.splice(taskIndex, NUMBER_ONE);
  }
  changeTaskStatus(id) {
    const task = this.getTask(id);
    task.changeStatus();
  }
  editTitle(newTitle) {
    this.title = newTitle || this.title;
  }
  editTask(taskId, newTask) {
    const task = this.getTask(taskId);
    task.edit(newTask);
  }
  getTask(id) {
    return this.tasks.find(task => task.id === +id);
  }
  static load({ id, title, tasks }) {
    const todo = new Todo(id, title, []);
    todo.tasks = tasks.map(task => Task.load(task));
    return todo;
  }
}

class TodoList {
  constructor() {
    this.todos = [];
  }
  generateTodoId() {
    const [previousTodo] = this.todos;
    return getNewId(previousTodo);
  }
  addTodo(title) {
    const id = this.generateTodoId();
    const todo = new Todo(id, title, []);
    this.todos.unshift(todo);
  }
  removeTodo(id) {
    const todoIndex = getIndex(this.todos, id);
    this.todos.splice(todoIndex, NUMBER_ONE);
  }
  addTaskToTodo(todoId, work) {
    const todo = this.getTodo(todoId);
    todo.addTask(work);
  }
  removeTaskFromTodo(taskId, todoId) {
    const todo = this.getTodo(todoId);
    todo.removeTask(taskId);
  }
  changeTaskStatus(taskId, todoId) {
    const todo = this.getTodo(todoId);
    todo.changeTaskStatus(taskId);
  }
  editTodoTitle(todoId, newTitle) {
    const todo = this.getTodo(todoId);
    todo.editTitle(newTitle);
  }
  editTodoTask(taskId, todoId, newTask) {
    const todo = this.getTodo(todoId);
    todo.editTask(taskId, newTask);
  }
  getTodo(id) {
    return this.todos.find(todo => todo.id === +id);
  }
  static load(todos) {
    const todoList = new TodoList();
    todoList.todos = todos.map(todo => Todo.load(todo));
    return todoList;
  }
}

module.exports = TodoList;
