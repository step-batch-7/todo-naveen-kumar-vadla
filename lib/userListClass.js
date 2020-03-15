'use strict';

const TodoList = require('../lib/todoListClass');

const NUMBER_ONE = 1;

const getNewId = lastItem => lastItem ? lastItem.id + NUMBER_ONE : NUMBER_ONE;

class User {
  constructor(id, userData, todos) {
    this.id = id;
    this.fullName = userData.fullName;
    this.mail = userData.mail;
    this.userName = userData.userName;
    this.password = userData.password;
    this.todoList = TodoList.load(todos);
  }
  static load(userData) {
    const user = new User(userData.id, userData, userData.todoList.todos);
    return user;
  }
}
class UserList {
  constructor() {
    this.users = [];
  }
  getNewUserId() {
    const previousTodo = this.users[this.users.length - NUMBER_ONE];
    return getNewId(previousTodo);
  }
  add(userData) {
    const id = this.getNewUserId();
    const user = new User(id, userData, []);
    this.users.push(user);
  }
  isAnExistingUser(userName, password) {
    return this.users.some(
      user => user.userName === userName && user.password === password
    );
  }
  findUser(userName) {
    return this.users.find(user => user.userName === userName);
  }
  getUsers() {
    return this.users;
  }
  static load(data) {
    const usersData = JSON.parse(data || '[]');
    const userList = new UserList();
    userList.users = usersData.map(user => User.load(user));
    return userList;
  }
}

module.exports = UserList;
