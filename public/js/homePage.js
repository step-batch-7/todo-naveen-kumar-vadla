'use strict';

const removeTaskAdder = event => {
  const [, addTaskBar, , list] = event.path;
  const query = `.list[id="${list.id}"] .tasks`;
  const listItems = document.querySelector(query);
  listItems.removeChild(addTaskBar);
};

const generateTaskAdder = event => {
  const [, , , list] = event.path;
  const query = `.list[id="${list.id}"] .tasks`;
  const listItems = document.querySelector(query);
  const html = `<div class="addTaskBar"><input type="text" name="task"
  placeholder="Add your task here" class="addTask">
  <img src="images/tick.svg" class="addButton" onclick="addTask(event)">
  <img src="images/remove.svg" class="cancelImage" 
  onclick="removeTaskAdder(event)"></div>`;
  listItems.innerHTML = listItems.innerHTML + html;
};

const generateTasksHtml = (allTasksHtml, task) => {
  const { id, work, isCompleted } = task;
  let className = '';
  let checked = '';
  if (isCompleted) {
    className = 'class="completedTask"';
    checked = 'checked';
  }
  const taskHtml = `<div id="${id}" class="task-item">
    <p><input type="checkbox" onclick="completeTask(event)" ${checked}>
      <span ${className} contenteditable onfocusout="editTask(event)">
      ${work}</span>
    </p>
    <img src="images/remove.svg" class="svg removeImage" 
    onclick="removeTask(event)">
    </div>`;
  return allTasksHtml + taskHtml;
};

const createTasks = list => {
  const taskshtml = list.tasks.reduce(generateTasksHtml, '');
  const tasksContainer = `<div class="tasks">${taskshtml}</div>`;
  return tasksContainer;
};

const createListHeader = title => {
  const listHeader = `<div class="list-header">
    <h3 class="list-title" onfocusout="editTitle(event)" 
    contenteditable>${title}</h3>
    <div class="options">
      <img src="images/add.svg" class="deleteImage" 
        onclick="generateTaskAdder(event)">
      <img src="images/delete.svg" class="deleteImage" 
    <img src="images/delete.svg" class="deleteImage" 
      <img src="images/delete.svg" class="deleteImage" 
        onclick="deleteList(event)">
    </div>
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
