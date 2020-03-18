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
    return this.isCompleted;
  }
  edit(newWork) {
    if (newWork) {
      this.work = newWork;
      return true;
    }
    return false;
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
    if (!work) {
      return false;
    }
    const previousTask = this.tasks[this.tasks.length - NUMBER_ONE];
    const id = getNewId(previousTask);
    const task = new Task(id, work, false);
    this.tasks.push(task);
    return true;
  }
  removeTask(id) {
    if (!id) {
      return false;
    }
    const taskIndex = getIndex(this.tasks, id);
    this.tasks.splice(taskIndex, NUMBER_ONE);
    return true;
  }
  changeTaskStatus(id) {
    const task = this.getTask(id);
    if (task) {
      return task.changeStatus();
    }
    return false;
  }
  editTitle(newTitle) {
    if (newTitle) {
      this.title = newTitle;
      return true;
    }
    return false;
  }
  editTask(taskId, newTask) {
    const task = this.getTask(taskId);
    if (task) {
      return task.edit(newTask);
    }
    return false;
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
    if (!title) {
      return false;
    }
    const id = this.generateTodoId();
    const todo = new Todo(id, title, []);
    this.todos.unshift(todo);
    return true;
  }
  removeTodo(id) {
    if (!id) {
      return false;
    }
    const todoIndex = getIndex(this.todos, id);
    this.todos.splice(todoIndex, NUMBER_ONE);
    return true;
  }
  addTaskToTodo(todoId, work) {
    const todo = this.getTodo(todoId);
    if (todo) {
      return todo.addTask(work);
    }
    return false;
  }
  removeTaskFromTodo(taskId, todoId) {
    const todo = this.getTodo(todoId);
    if (todo) {
      return todo.removeTask(taskId);
    }
    return false;
  }
  changeTaskStatus(taskId, todoId) {
    const todo = this.getTodo(todoId);
    if (todo) {
      return todo.changeTaskStatus(taskId);
    }
    return false;
  }
  editTodoTitle(todoId, newTitle) {
    const todo = this.getTodo(todoId);
    if (todo) {
      return todo.editTitle(newTitle);
    }
    return false;
  }
  editTodoTask(taskId, todoId, newTask) {
    const todo = this.getTodo(todoId);
    if (todo) {
      return todo.editTask(taskId, newTask);
    }
    return false;
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
