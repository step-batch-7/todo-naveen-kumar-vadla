'use strict';

const STATUS_CODES = { OK: 200 };

const sendHttpGet = (url, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.onload = function() {
    if (this.status === STATUS_CODES.OK) {
      callback(this.responseText);
    }
  };
  xhr.send();
};

const postHttpMsg = (url, callback, message) => {
  const req = new XMLHttpRequest();
  req.onload = function() {
    if (this.status === STATUS_CODES.OK) {
      callback(this.responseText);
    }
  };
  req.open('POST', url);
  req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  req.send(message);
};

const createImage = (src, cssClass, eventListener) => {
  const img = document.createElement('img');
  img.setAttribute('src', src);
  img.classList.add(cssClass);
  img.addEventListener('click', eventListener);
  return img;
};

const createImageButton = ( btnClass, imgSrc, imgClass, eventListener ) => {
  const button = document.createElement('button');
  const addImage = createImage(imgSrc, imgClass, eventListener);
  button.classList.add(btnClass);
  button.appendChild(addImage);
  return button;
};

const getTaskAdderBox = () => document.querySelector('#task-adder');

const addHeader = () => {
  const taskAdder = getTaskAdderBox();
  const header = document.createElement('h3');
  header.textContent = 'Create A New Todo List';
  header.classList.add('task-adder-header');
  taskAdder.appendChild(header);
};

const getTitleBox = () => {
  const titleBox = document.createElement('input');
  titleBox.setAttribute('type', 'text');
  titleBox.setAttribute('name', 'title');
  titleBox.setAttribute('id', 'title');
  titleBox.setAttribute('required', 'true');
  titleBox.setAttribute('placeholder', 'Enter your title here');
  return titleBox;
};

const setupTodoAdder = () => {
  const taskAdder = getTaskAdderBox();
  const form = document.createElement('form');
  const createButton = createImageButton('createButton', 'images/create.svg', 'svg', () => {} );
  form.id = 'addTitleBar';
  form.setAttribute('action', 'createList');
  form.setAttribute('method', 'POST');
  form.appendChild(getTitleBox());
  form.appendChild(createButton);
  taskAdder.appendChild(form);
};

const deleteList = event => {
  const [, , task] = event.path;
  const taskId = task.id;
  postHttpMsg('/removeList', generateTasks, `id=${taskId}`);
};

const createListHeader = title => {
  const listHeader = document.createElement('div');
  const listTitle = document.createElement('h3');
  const removeImage = createImage('images/delete.svg', 'svg', deleteList);
  listTitle.classList.add('list-title');
  listTitle.textContent = title;
  listHeader.classList.add('list-header');
  removeImage.classList.add('removeButton');
  listHeader.appendChild(listTitle);
  listHeader.appendChild(removeImage);
  return listHeader;
};

const createTaskBox = () => {
  const textBox = document.createElement('input');
  textBox.setAttribute('type', 'text');
  textBox.setAttribute('name', 'task');
  textBox.setAttribute('id', 'task');
  textBox.setAttribute('required', 'true');
  textBox.setAttribute('placeholder', 'Add your task here');
  textBox.classList.add('addTask');
  return textBox;
};

const createTasksAdder = () => {
  const taskAdder = document.createElement('div');
  const addButton = createImageButton('addButton', 'images/plus.svg', 'svg', () => {} );
  taskAdder.classList.add('addTaskBar');
  taskAdder.appendChild(createTaskBox());
  taskAdder.appendChild(addButton);
  return taskAdder;
};

const createTasks = tasks => {
  const tasksContainer = document.createElement('div');
  tasksContainer.classList.add('list-items');
  tasksContainer.appendChild(createTasksAdder());
  return tasksContainer;
};

const createTodoList = list => {
  const listContainer = document.createElement('div');
  const header = createListHeader(list.title);
  const tasks = createTasks(list.tasks);
  listContainer.id = list.id;
  listContainer.classList.add('list');
  listContainer.appendChild(header);
  listContainer.appendChild(tasks);
  return listContainer;
};

const generateTasks = text => {
  const todoListContainer = document.querySelector('#todo-lists');
  const todoListsJSON = JSON.parse(text);
  const todoLists = todoListsJSON.map(createTodoList);
  todoListContainer.innerHTML = '';
  todoLists.forEach(task => todoListContainer.appendChild(task));
};

const loadTasks = () => sendHttpGet('/tasks', generateTasks);

const main = () => {
  addHeader();
  setupTodoAdder();
  loadTasks();
};

window.onload = main;
