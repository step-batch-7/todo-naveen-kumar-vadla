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

const createList = () => {
  const inputBox = document.querySelector('#title');
  const message = `title=${inputBox.value}`;
  inputBox.value && sendXHR('POST', '/createList', message, generateTasks);
  inputBox.value = '';
};

const deleteList = event => {
  const [, , , list] = event.path;
  sendXHR('POST', '/removeList', `listId=${list.id}`, generateTasks);
};

const addTask = event => {
  const [, , , list] = event.path;
  const textBox = event.target.previousElementSibling;
  const message = `listId=${list.id}&work=${textBox.value}`;
  textBox.value && sendXHR('POST', '/addTask', message, generateTasks);
  textBox.value = '';
};

const removeTask = event => {
  const [, task, , , list] = event.path;
  const message = `taskId=${task.id}&listId=${list.id}`;
  sendXHR('POST', '/removeTask', message, generateTasks);
};

const completeTask = event => {
  const [, , task, , , list] = event.path;
  const message = `taskId=${task.id}&listId=${list.id}`;
  sendXHR('POST', '/completeTask', message, generateTasks);
};
