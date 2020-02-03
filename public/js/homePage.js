'use strict';

const getTaskAdderBox = () => document.querySelector('#task-adder');

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
  createImage.classList.add('createImage');
  createButton.appendChild(createImage);
  return createButton;
};

const setupTodoAdder = () => {
  const taskAdder = getTaskAdderBox();
  const form = document.createElement('form');
  form.id = 'addTaskBar';
  form.setAttribute('action', 'createTodo');
  form.setAttribute('method', 'POST');
  form.appendChild(getTitleBox());
  form.appendChild(getCreateButton());
  taskAdder.appendChild(form);
};

const main = () => {
  setupTodoAdder();
};

window.onload = main;
