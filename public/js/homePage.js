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
  sendXHR('POST', '/removeList', `listId=${taskId}`, generateTasks);
};

const addTask = event => {
  const textBox = event.target.previousElementSibling;
  const [, , , list] = event.path;
  const message = `listId=${list.id}&work=${textBox.value}`;
  sendXHR('POST', '/addTask', message, generateTasks);
};

const removeTask = event => {
  const [, taskItem, , , list] = event.path;
  const taskId = taskItem.id;
  const listId = list.id;
  const message = `taskId=${taskId}&listId=${listId}`;
  sendXHR('POST', '/removeTask', message, generateTasks);
};

const createTasksAdder = () => {
  const taskAdder = `<div class="addTaskBar">
    <input type="text" name="task"  
    placeholder="Add your task here" class="addTask">
      <img src="images/add.svg" class="svg addButton" onclick="addTask(event)">
  </div>`;
  return taskAdder;
};

const generateTasksHtml = (allTasksHtml, task) => {
  const taskHtml = `<div id="${task.id}" class="task-item">
    <p><input type="checkbox"> ${task.work}</p>
    <img src="images/remove.svg" class="svg removeImage" 
    onclick="removeTask(event)">
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
