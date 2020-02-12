'use strict';

const fillTemplate = (template, propertyBag) => {
  const replaceKeyWithValue = (template, key) => {
    const pattern = new RegExp(`__${key}__`, 'g');
    return template.replace(pattern, propertyBag[key]);
  };
  const keys = Object.keys(propertyBag);
  const html = keys.reduce(replaceKeyWithValue, template);
  return html;
};

const ListHeaderTemplate = `
<div class="list-header">
  <input class="list-title" onfocusout="editTitle(__id__)"
    onfocus="this.selectionStart = this.selectionEnd = this.value.length;"
    value="__title__">
  <div class="options"> 
    <img src="images/edit.svg" class="editImage" 
      onclick="focusListTitle(__id__)"> 
    <img src="images/delete.svg" class="deleteImage" 
      onclick="deleteList(__id__)">
  </div>
</div>`;

const addTaskBarTemplate = `
<div class="addTaskBar">
  <input type="text" name="task" placeholder="Add your task here" 
    class="addTask">
  <img src="images/tick.svg" class="addButton" onclick="addTask(__id__)">
</div>`;

const taskTemplate = `
<div id="__id__" class="task-item">
  <p>
  <input type="checkbox" onclick="toggleTaskCompletion(__id__)" __checked__>
  <input class="__className__" onfocusout="editTask(__id__)"
    onfocus="this.selectionStart = this.selectionEnd = this.value.length;"
    value="__work__">
  </p>
  <div class="options">
    <img src="images/editTask.svg" class="editTaskImage" 
      onclick="focusListTask(__id__)"> 
    <img src="images/remove.svg" class="removeImage" 
      onclick="removeTask(__id__)">
  </div>
</div>`;

const generateTasksHtml = (allTasksHtml, task) => {
  const { id, work, isCompleted } = task;
  let className = 'work';
  let checked = '';
  if (isCompleted) {
    className = 'work completedTask';
    checked = 'checked';
  }
  const taskHtml = fillTemplate(taskTemplate, { id, work, className, checked });
  return allTasksHtml + taskHtml;
};

const createListBody = list => {
  const addTaskBar = fillTemplate(addTaskBarTemplate, list);
  const taskshtml = list.tasks.reduce(generateTasksHtml, '');
  const tasksContainer = `<div class="tasks">${taskshtml}</div>`;
  return addTaskBar + tasksContainer;
};

const createListHeader = list => fillTemplate(ListHeaderTemplate, list);

const createTodoList = list => {
  const listContainer = document.createElement('div');
  const header = createListHeader(list);
  const body = createListBody(list);
  listContainer.id = list.id;
  listContainer.classList.add('list');
  listContainer.innerHTML = header + body;
  return listContainer;
};

const showTodoLists = text => {
  const todoListContainer = document.querySelector('#todo-lists');
  const todoListsJSON = JSON.parse(text);
  const todoLists = todoListsJSON.map(createTodoList);
  todoListContainer.innerHTML = '';
  todoLists.forEach(todo => todoListContainer.appendChild(todo));
};

const loadTasks = () => sendXHR('GET', '/tasks', '', showTodoLists);

window.onload = loadTasks;
