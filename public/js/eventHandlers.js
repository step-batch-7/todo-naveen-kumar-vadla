'use strict';

const STATUS_CODES = { OK: 200 };

const sendXHR = (method, url, message, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  if (method === 'POST') {
    xhr.setRequestHeader('Content-Type', 'application/json');
  }
  xhr.onload = function() {
    if (this.status === STATUS_CODES.OK) {
      callback(this.responseText);
    }
  };
  xhr.send(JSON.stringify(message));
};

const createTodo = () => {
  const inputBox = document.querySelector('#title');
  const title = inputBox.value;
  const message = { title };
  inputBox.value && sendXHR('POST', '/user/createTodo', message, showTodoLists);
  inputBox.value = '';
};

const deleteTodo = todoId => {
  const message = { todoId };
  sendXHR('POST', '/user/removeTodo', message, showTodoLists);
};

const addTask = todoId => {
  const textBox = event.target.previousElementSibling;
  const work = textBox.value;
  const message = { todoId, work };
  textBox.value && sendXHR('POST', '/user/addTask', message, showTodoLists);
  textBox.value = '';
};

const removeTask = taskId => {
  const [, , , todo] = event.path;
  const todoId = todo.id;
  const message = { taskId, todoId };
  sendXHR('POST', '/user/removeTask', message, showTodoLists);
};

const toggleTaskCompletion = taskId => {
  const [, , , , todo] = event.path;
  const todoId = todo.id;
  const message = { taskId, todoId };
  sendXHR('POST', '/user/toggleTaskCompletion', message, showTodoLists);
};

const editTitle = (todoId, newTitle) => {
  const message = { newTitle, todoId };
  sendXHR('POST', '/user/editTitle', message, showTodoLists);
};

const editTask = (taskId, newWork) => {
  const [, , , todo] = event.path;
  const todoId = todo.id;
  const message = { newWork, taskId, todoId };
  sendXHR('POST', '/user/editTask', message, showTodoLists);
};

const focusTodoTitle = todoId => {
  const query = `.todo[id="${todoId}"] .todo-title`;
  document.querySelector(query).focus();
};

let allTodos = [];
const getTodos = () =>
  sendXHR('GET', '/user/tasks', {}, text => (allTodos = JSON.parse(text)));

const searchByTitle = (todo, searchTitle) => todo.title.includes(searchTitle);
const searchByTask = (todo, searchTask) => {
  if (todo.tasks.length) {
    return todo.tasks.some(task => task.work.includes(searchTask));
  }
  return true;
};

const search = (searchString, searchType) => {
  const searchMethods = { searchByTitle, searchByTask };
  const filterer = searchMethods[searchType];
  const matchingTodos = allTodos.filter(todo => filterer(todo, searchString));
  showTodoLists(JSON.stringify(matchingTodos));
};
