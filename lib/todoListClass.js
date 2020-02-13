'use strict';

class Todo {
  constructor(id, title, tasks) {
    this.id = id;
    this.title = title;
    this.tasks = tasks;
  }
  static load({ id, title, tasks }) {
    const todo = new Todo(id, title, []);
    todo.tasks = tasks;
    return todo;
  }
}

class TodoList {
  constructor() {
    this.todos = [];
  }
  static load(content) {
    const todos = JSON.parse(content || '[]');
    const todoList = new TodoList();
    todoList.todos = todos.map(todo => Todo.load(todo));
    return todoList;
  }
}

module.exports = { TodoList };
