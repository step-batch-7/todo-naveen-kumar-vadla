'use strict';

const generateTasksHtml = (allTasksHtml, task) => {
  const { id, work, isCompleted } = task;
  let className = 'work';
  let checked = '';
  if (isCompleted) {
    className = 'work completedTask';
    checked = 'checked';
  }
  const taskHtml = `<div id="${id}" class="task-item">
    <p><input type="checkbox" onclick="toggleTaskCompletion(event)" ${checked}>
      <input class="${className}" onfocusout="editTask(event)"
      onfocus="this.selectionStart = this.selectionEnd = this.value.length;"
      value="${work}">
    </p>
    <div class="options">
      <img src="images/editTask.svg" class="editTaskImage" 
        onclick="focusListTask(event)"> 
      <img src="images/remove.svg" class="removeImage" 
        onclick="removeTask(event)">
    </div>
    </div>`;
  return allTasksHtml + taskHtml;
};

const createTasks = list => {
  const addTaskBar = `<div class="addTaskBar"><input type="text" name="task"
  placeholder="Add your task here" class="addTask">
  <img src="images/tick.svg" class="addButton" onclick="addTask(event)">
  </div>`;
  const taskshtml = list.tasks.reduce(generateTasksHtml, '');
  const tasksContainer = `<div class="tasks">${taskshtml}</div>`;
  return addTaskBar + tasksContainer;
};

const createListHeader = title => {
  const listHeader = `<div class="list-header">
    <input class="list-title" onfocusout="editTitle(event)"
    onfocus="this.selectionStart = this.selectionEnd = this.value.length;"
    value="${title}">
    <div class="options"> 
     <img src="images/edit.svg" class="editImage" 
      onclick="focusListTitle(event)"> 
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
