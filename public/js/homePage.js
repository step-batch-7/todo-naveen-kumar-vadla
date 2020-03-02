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

const TodoHeaderTemplate = `
<div class="todo-header">
  <h4 class="todo-title" onfocusout="editTitle(__id__)"
    contenteditable>__title__</h4>
  <div class="options"> 
    <img src="images/edit.svg" class="editImage" 
      onclick="focusTodoTitle(__id__)"> 
    <img src="images/delete.svg" class="deleteImage" 
      onclick="deleteTodo(__id__)">
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
  <h6 class="__className__" onfocusout="editTask(__id__)" 
    contenteditable>__work__</h6>
  </p>
    <img src="images/remove.svg" class="removeImage" 
      onclick="removeTask(__id__)">
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

const createTodoBody = todo => {
  const addTaskBar = fillTemplate(addTaskBarTemplate, todo);
  const taskshtml = todo.tasks.reduce(generateTasksHtml, '');
  const tasksContainer = `<div class="tasks">${taskshtml}</div>`;
  return addTaskBar + tasksContainer;
};

const createTodoHeader = todo => fillTemplate(TodoHeaderTemplate, todo);

const createTodoList = todo => {
  const todoContainer = document.createElement('div');
  const header = createTodoHeader(todo);
  const body = createTodoBody(todo);
  todoContainer.id = todo.id;
  todoContainer.classList.add('todo');
  todoContainer.innerHTML = header + body;
  return todoContainer;
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
