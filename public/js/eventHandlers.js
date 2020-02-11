'use strict';

const STATUS_CODES = { OK: 200 };

const sendXHR = (method, url, message, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.onload = function() {
    if (this.status === STATUS_CODES.OK) {
      callback(this.responseText);
    }
  };
  xhr.send(message);
};

const toJSONString = jsonData => JSON.stringify(jsonData);

const createList = () => {
  const inputBox = document.querySelector('#title');
  const title = inputBox.value;
  const message = toJSONString({ title });
  inputBox.value && sendXHR('POST', '/createList', message, showTodoLists);
  inputBox.value = '';
};

const deleteList = event => {
  const [, , , list] = event.path;
  const listId = list.id;
  const message = toJSONString({ listId });
  sendXHR('POST', '/removeList', message, showTodoLists);
};

const addTask = event => {
  const [, , list] = event.path;
  const textBox = event.target.previousElementSibling;
  const work = textBox.value;
  const listId = list.id;
  const message = toJSONString({ listId, work });
  textBox.value && sendXHR('POST', '/addTask', message, showTodoLists);
  textBox.value = '';
};

const removeTask = event => {
  const [, , task, , list] = event.path;
  const taskId = task.id;
  const listId = list.id;
  const message = toJSONString({ taskId, listId });
  sendXHR('POST', '/removeTask', message, showTodoLists);
};

const toggleTaskCompletion = event => {
  const [, , task, , list] = event.path;
  const taskId = task.id;
  const listId = list.id;
  const message = toJSONString({ taskId, listId });
  sendXHR('POST', '/toggleTaskCompletion', message, showTodoLists);
};

const editTitle = event => {
  const [header, , list] = event.path;
  const newTitle = header.value;
  const listId = list.id;
  const message = toJSONString({ newTitle, listId });
  sendXHR('POST', '/editTitle', message, showTodoLists);
};

const editTask = event => {
  const [work, , task, , list] = event.path;
  const newWork = work.value;
  const taskId = task.id;
  const listId = list.id;
  const message = toJSONString({ newWork, taskId, listId });
  sendXHR('POST', '/editTask', message, showTodoLists);
};

const getElementAndAddFocus = query => document.querySelector(query).focus();

const focusListTitle = event => {
  const [, , , list] = event.path;
  const query = `.list[id="${list.id}"] .list-title`;
  getElementAndAddFocus(query);
};

const focusListTask = event => {
  const [, , taskItem, , list] = event.path;
  const query = `.list[id="${list.id}"] .task-item[id="${taskItem.id}"] .work`;
  getElementAndAddFocus(query);
};
