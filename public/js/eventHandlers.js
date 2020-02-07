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
  const createButton = document.querySelector('.createButton');
  const inputBox = createButton.previousElementSibling;
  const message = `title=${inputBox.value}`;
  inputBox.value && sendXHR('POST', '/createList', message, generateTasks);
  inputBox.value = '';
};

const deleteList = event => {
  const [, , , task] = event.path;
  const taskId = task.id;
  sendXHR('POST', '/removeList', `listId=${taskId}`, generateTasks);
};

const addTask = event => {
  const textBox = event.target.previousElementSibling;
  const [, , , list] = event.path;
  const message = `listId=${list.id}&work=${textBox.value}`;
  textBox.value && sendXHR('POST', '/addTask', message, generateTasks);
};

const removeTask = event => {
  const [, taskItem, , , list] = event.path;
  const message = `taskId=${taskItem.id}&listId=${list.id}`;
  sendXHR('POST', '/removeTask', message, generateTasks);
};

const completeTask = event => {
  const [, , taskItem, , , list] = event.path;
  const message = `taskId=${taskItem.id}&listId=${list.id}`;
  sendXHR('POST', '/completeTask', message, generateTasks);
};
