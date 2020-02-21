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
  xhr.send(message);
};

const toJSONString = jsonData => JSON.stringify(jsonData);

const createTodo = () => {
  const inputBox = document.querySelector('#title');
  const title = inputBox.value;
  const message = toJSONString({ title });
  inputBox.value && sendXHR('POST', '/createTodo', message, showTodoLists);
  inputBox.value = '';
};

const deleteTodo = todoId => {
  const message = toJSONString({ todoId });
  sendXHR('POST', '/removeTodo', message, showTodoLists);
};

const addTask = todoId => {
  const textBox = event.target.previousElementSibling;
  const work = textBox.value;
  const message = toJSONString({ todoId, work });
  textBox.value && sendXHR('POST', '/addTask', message, showTodoLists);
  textBox.value = '';
};

const removeTask = taskId => {
  const [, , , , todo] = event.path;
  const todoId = todo.id;
  const message = toJSONString({ taskId, todoId });
  sendXHR('POST', '/removeTask', message, showTodoLists);
};

const toggleTaskCompletion = taskId => {
  const [, , , , todo] = event.path;
  const todoId = todo.id;
  const message = toJSONString({ taskId, todoId });
  sendXHR('POST', '/toggleTaskCompletion', message, showTodoLists);
};

const editTitle = todoId => {
  const [header] = event.path;
  const newTitle = header.value;
  const message = toJSONString({ newTitle, todoId });
  sendXHR('POST', '/editTitle', message, showTodoLists);
};

const editTask = taskId => {
  const [work, , , , todo] = event.path;
  const newWork = work.value;
  const todoId = todo.id;
  const message = toJSONString({ newWork, taskId, todoId });
  sendXHR('POST', '/editTask', message, showTodoLists);
};

const getElementAndAddFocus = query => document.querySelector(query).focus();

const focusTodoTitle = todoId => {
  const query = `.todo[id="${todoId}"] .todo-title`;
  getElementAndAddFocus(query);
};

const focusTodoTask = taskId => {
  const [, , , , todo] = event.path;
  const query = `.todo[id="${todo.id}"] .task-item[id="${taskId}"] .work`;
  getElementAndAddFocus(query);
};
