'use strict';

const NUMBER_ONE = 1;

const getNewId = lastItem => (lastItem ? lastItem.id + NUMBER_ONE : NUMBER_ONE);

class UserList {
  constructor() {
    this.users = [];
  }
  getNewUserId() {
    const previousTodo = this.users[this.users.length - NUMBER_ONE];
    return getNewId(previousTodo);
  }
  add(userData) {
    userData.id = this.getNewUserId();
    this.users.push(userData);
  }
  isAnExistingUser(userName, password) {
    return this.users.some(
      user => user.userName === userName && user.password === password
    );
  }
}

module.exports = UserList;
