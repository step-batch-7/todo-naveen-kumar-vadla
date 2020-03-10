'use strict';

const NUMBER_ONE = 1;

const getNewId = lastItem => lastItem ? lastItem.id + NUMBER_ONE : NUMBER_ONE;

class User {
  constructor(id, userData, todos) {
    this.id = id;
    this.fullName = userData.fullName;
    this.mail = userData.mail;
    this.userName = userData.userName;
    this.password = userData.password;
    this.todos = todos;
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
}

module.exports = UserList;
