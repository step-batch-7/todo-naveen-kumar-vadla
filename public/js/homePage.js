'use strict';

const createTasksAdder = () => {
  const taskAdder = `
  <h3 class="addTaskTitle">Add Your Tasks here</h3>
  <div class="addTaskBar">
    <input type="text" name="task"  
    placeholder="Add your task here" class="addTask">
      <img src="images/add.svg" class="svg addButton" onclick="addTask(event)">
  </div>`;
  return taskAdder;
};

const generateTasksHtml = (allTasksHtml, task) => {
  const { id, work, isCompleted } = task;
  let html = `<input type="checkbox" onclick="completeTask(event)"> ${work}`;
  if (isCompleted) {
    html = `<input type="checkbox" onclick="completeTask(event)" checked> 
    <span class="completedTask">${work}</span>`;
  }
  const taskHtml = `<div id="${id}" class="task-item">
    <p>${html}</p>
    <img src="images/remove.svg" class="svg removeImage" 
    onclick="removeTask(event)">
    </div>`;
  return allTasksHtml + taskHtml;
};

const createTasks = list => {
  const taskAdder = createTasksAdder();
  const taskshtml = list.tasks.reduce(generateTasksHtml, '');
  const tasksContainer = `<div class="list-items">
    ${taskAdder}<div class="tasks">${taskshtml}</div>
  </div>`;
  return tasksContainer;
};

const createListHeader = title => {
  const listHeader = `<div class="list-header">
    <h3 class="list-title">${title}</h3>
    <div class="option"><img src="images/edit.svg" class="editTitleImage" 
    onclick="renameListTitle(event)">
    <img src="images/delete.svg" class="deleteImage" 
    onclick="deleteList(event)"></div>
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
