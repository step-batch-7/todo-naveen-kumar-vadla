'use strict';

class TodoList {
  constructor() {
    this.todos = [];
  }
  static load(content) {
    const todos = JSON.parse(content || '[]');
    const todoList = new TodoList();
    todoList.todos = todos;
    return todoList;
  }
}

module.exports = { TodoList };
