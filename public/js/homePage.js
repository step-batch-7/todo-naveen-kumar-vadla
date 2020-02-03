'use strict';

const getTaskAdderBox = () => document.querySelector('#task-adder');

const addHeader = function() {
  const taskAdder = getTaskAdderBox();
  const header = document.createElement('h3');
  header.textContent = 'Create A New Todo List';
  header.classList.add('task-adder-header');
  taskAdder.appendChild(header);
};

const getTitleBox = ( ) => {
  const titleBox = document.createElement('input');
  titleBox.setAttribute('type', 'text');
  titleBox.setAttribute('name', 'title');
  titleBox.setAttribute('id', 'title');
  titleBox.setAttribute('placeholder', 'Enter your title here');
  return titleBox;
};

const getCreateButton = ( ) => {
  const createButton = document.createElement('button');
  createButton.setAttribute('id', 'createButton');
  const createImage = document.createElement('img');
  createImage.setAttribute('src', './images/create.svg');
  createImage.setAttribute('alt', 'createButton');
  createImage.classList.add('svg');
  createButton.appendChild(createImage);
  return createButton;
};

const setupTodoAdder = () => {
  const taskAdder = getTaskAdderBox();
  const form = document.createElement('form');
  form.id = 'addTitleBar';
  form.setAttribute('action', 'createList');
  form.setAttribute('method', 'POST');
  form.appendChild(getTitleBox());
  form.appendChild(getCreateButton());
  taskAdder.appendChild(form);
};

const deleteList = function(event) {
  const [,, task] = event.path;
  const taskId = task.id;
  postHttpMsg('/removeList', generateTasks, `id=${taskId}`);
};

const addTask = () => {};

const createImage = (src, cssClass, eventListener) => {
  const img = document.createElement('img');
  img.setAttribute('src', src);
  img.classList.add(cssClass);
  img.addEventListener('click', eventListener);
  return img;
};

const createListHeader = ( title ) => {
  const listHeader = document.createElement('div');
  const listTitle = document.createElement('h3');
  const removeImage = createImage('images/delete.svg', 'svg', deleteList);
  listTitle.classList.add('list-title');
  listTitle.textContent = title;
  listHeader.classList.add('list-header');
  listHeader.appendChild(listTitle);
  listHeader.appendChild(removeImage);
  return listHeader;
};

const createAddButton = () => {
  const addButton = document.createElement('button');
  const addImage = createImage('images/plus.svg', 'svg', addTask);
  addButton.classList.add('addButton');
  addButton.appendChild(addImage);
  return addButton;
};

const createTaskBox = () => {
  const textBox = document.createElement('input');
  textBox.setAttribute('type', 'text');
  textBox.classList.add('addTask');
  textBox.setAttribute('placeholder', 'Add your task here');
  return textBox;
};

const createTasks = ( tasks ) => {
  const form = document.createElement('form');
  const tasksContainer = document.createElement('div');
  tasksContainer.classList.add('list-items');
  form.classList.add('addTaskBar');
  form.appendChild(createTaskBox());
  form.appendChild(createAddButton());
  tasksContainer.appendChild(form);
  return tasksContainer;
};

const createTodoList = ( list ) => {
  const listContainer = document.createElement('div');
  const header = createListHeader(list.title);
  const tasks = createTasks(list.tasks);
  listContainer.id = list.id;
  listContainer.classList.add('list');
  listContainer.appendChild(header);
  listContainer.appendChild(tasks);
  return listContainer;
};

const STATUS_CODES = { OK: 200 };

const sendHttpGet = ( url, callback ) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.onload = function () {
    if(this.status === STATUS_CODES.OK) {
      callback(this.responseText);
    }
  };
  xhr.send();
};

const postHttpMsg = function(url, callback, message) {
  const req = new XMLHttpRequest();
  req.onload = function() {
    if(this.status === STATUS_CODES.OK) {
      callback(this.responseText);
    }
  };
  req.open('POST', url);
  req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  req.send(message);
};

const generateTasks = function(text) {
  const todoListContainer = document.querySelector('#todo-lists');
  const todoListsJSON = JSON.parse(text);
  const todoLists = todoListsJSON.map(createTodoList);
  todoListContainer.innerHTML = '';
  todoLists.forEach(task => todoListContainer.appendChild(task));
};

const loadTasks = () => {
  sendHttpGet('/tasks', generateTasks);
};

const main = () => {
  addHeader();
  setupTodoAdder();
  loadTasks();
};

window.onload = main;

