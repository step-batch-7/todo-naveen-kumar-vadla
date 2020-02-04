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
  sendXHR('POST', '/createList', `title=${inputBox.value}`, generateTasks);
  inputBox.value = '';
};

const deleteList = event => {
  const [, , task] = event.path;
  const taskId = task.id;
  sendXHR('POST', '/removeList', `id=${taskId}`, generateTasks);
};

const addTask = () => {};

const createTasksAdder = () => {
  const taskAdder = `<div class="addTaskBar">
    <input type="text" name="task"  
    placeholder="Add your task here" class="addTask">
    <button class="addButton" onclick="addTask()">
      <img src="images/add.svg" class="svg">
    </button>
  </div>`;
  return taskAdder;
};

const createTasksContainer = tasks => '';

const createTasks = tasks => {
  const tasksContainer = `<div class="list-items">
    ${createTasksAdder()}
    ${createTasksContainer(tasks)}
  </div>`;
  return tasksContainer;
};

const createListHeader = title => {
  const listHeader = `<div class="list-header">
    <h3 class="list-title">${title}</h3>
    <img src="images/delete.svg" class="svg removeButton" onclick="deleteList(event)">
  </div>`;
  return listHeader;
};

const createTodoList = list => {
  const listContainer = document.createElement('div');
  const header = createListHeader(list.title);
  const tasks = createTasks(list.tasks);
  listContainer.id = list.id;
  listContainer.classList.add('list');
  listContainer.innerHTML = header + tasks;
  return listContainer;
};

const generateTasks = text => {
  const todoListContainer = document.querySelector('#todo-lists');
  const todoListsJSON = JSON.parse(text);
  const todoLists = todoListsJSON.map(createTodoList);
  todoListContainer.innerHTML = '';
  todoLists.forEach(todo => todoListContainer.appendChild(todo));
};

const loadTasks = () => sendXHR('GET', '/tasks', '', generateTasks);

window.onload = loadTasks;
