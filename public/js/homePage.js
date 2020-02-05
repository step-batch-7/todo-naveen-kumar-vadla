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

const addTask = () => {
  const textBox = event.target.previousElementSibling;
  const [, , , list] = event.path;
  sendXHR('POST', '/addTask', `id=${list.id}&work=${textBox.value}`, generateTasks);
};

const removeTask = () => {};

const createTasksAdder = () => {
  const taskAdder = `<div class="addTaskBar">
    <input type="text" name="task"  
    placeholder="Add your task here" class="addTask">
      <img src="images/add.svg" class="svg addButton" onclick="addTask()">
  </div>`;
  return taskAdder;
};

const generateTasksHtml = (allTasksHtml, task) => {
  const taskHtml = `<div id="${task.id}" class="task-item">
    <p><input type="checkbox"> ${task.work}</p>
    <img src="images/remove.svg" class="svg removeImage" onclick="removeTask()">
    </div>`;
  return allTasksHtml + taskHtml;
};

const createTasks = list => {
  const tasksContainer = `<div class="list-items">
    ${createTasksAdder()}
    <div class="tasks">${list.tasks.reduce(generateTasksHtml, '')}</div>
  </div>`;
  return tasksContainer;
};

const createListHeader = title => {
  const listHeader = `<div class="list-header">
    <h3 class="list-title">${title}</h3>
    <img src="images/delete.svg" class="svg deleteImage" 
    onclick="deleteList(event)">
  </div>`;
  return listHeader;
};

const createTodoList = list => {
  const listContainer = document.createElement('div');
  const header = createListHeader(list.title);
  const tasks = createTasks(list);
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
