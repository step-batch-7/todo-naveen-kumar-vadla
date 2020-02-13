'use strict';

const NUMBER_ONE = 1;

const getNewId = lastItem => lastItem ? lastItem.id + NUMBER_ONE : NUMBER_ONE;

class Task {
  constructor(id, work, isCompleted) {
    this.id = id;
    this.work = work;
    this.isCompleted = isCompleted;
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
  add(title) {
    const id = this.generateTodoId();
    const todo = new Todo(id, title, []);
    this.todos.unshift(todo);
  }
  static load(content) {
    const todos = JSON.parse(content || '[]');
    const todoList = new TodoList();
    todoList.todos = todos.map(todo => Todo.load(todo));
    return todoList;
  }
}

module.exports = { TodoList };
