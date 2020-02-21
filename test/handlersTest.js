'use strict';
const request = require('supertest');
const fs = require('fs');
const sinon = require('sinon');

const app = require('../lib/routes');

describe('GET', () => {
  beforeEach(() => {
    sinon.replace(fs, 'writeFileSync', () => {});
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Home Page', () => {
    it('should get the path / or index.html', done => {
      request(app)
        .get('/')
        .set('Accept', '*/*')
        .expect(200)
        .expect('Content-Type', /html/)
        .expect('content-Length', '887')
        .expect(/<title>TODO<\/title>/, done);
    });
    it('should get the path /css/homePage.css', done => {
      request(app)
        .get('/css/homePage.css')
        .set('Accept', '*/*')
        .expect(200)
        .expect('Content-Type', /css/)
        .expect(/body {/, done);
    });
    it('should get the path /js/homePage.js', done => {
      request(app)
        .get('/js/homePage.js')
        .set('Accept', '*/*')
        .expect(200)
        .expect('Content-Type', /javascript/)
        .expect(/'use strict'/, done);
    });
    it('should get the path /js/eventHandlers.js', done => {
      request(app)
        .get('/js/eventHandlers.js')
        .set('Accept', '*/*')
        .expect(200)
        .expect('Content-Type', /javascript/)
        .expect(/'use strict'/, done);
    });
    it('should get the path /images/create.svg', done => {
      request(app)
        .get('/images/create.svg')
        .set('Accept', '*/*')
        .expect(200)
        .expect('Content-Type', 'image/svg+xml')
        .expect('content-Length', '1375', done);
    });
    it('should get the path /images/edit.svg', done => {
      request(app)
        .get('/images/edit.svg')
        .set('Accept', '*/*')
        .expect(200)
        .expect('Content-Type', 'image/svg+xml')
        .expect('content-Length', '836', done);
    });
    it('should get the path /images/delete.svg', done => {
      request(app)
        .get('/images/delete.svg')
        .set('Accept', '*/*')
        .expect(200)
        .expect('Content-Type', 'image/svg+xml')
        .expect('content-Length', '2075', done);
    });
    it('should get the path /images/tick.svg', done => {
      request(app)
        .get('/images/tick.svg')
        .set('Accept', '*/*')
        .expect(200)
        .expect('Content-Type', 'image/svg+xml')
        .expect('content-Length', '1370', done);
    });
    it('should get the path /images/editTask.svg', done => {
      request(app)
        .get('/images/editTask.svg')
        .set('Accept', '*/*')
        .expect(200)
        .expect('Content-Type', 'image/svg+xml')
        .expect('content-Length', '1751', done);
    });
    it('should get the path /images/remove.svg', done => {
      request(app)
        .get('/images/remove.svg')
        .set('Accept', '*/*')
        .expect(200)
        .expect('Content-Type', 'image/svg+xml')
        .expect('content-Length', '1217', done);
    });
  });

  describe('/tasks', () => {
    it('Should give the tasks as stringified array of objects', done => {
      request(app)
        .get('/tasks')
        .set('Accept', '*/*')
        .expect(200)
        .expect('content-Type', 'application/json')
        .expect('content-Length', '977', done);
    });
  });

  describe('FILE NOT FOUND', () => {
    it('Should give file not found if file not exist', done => {
      request(app)
        .get('/badFile')
        .set('Accept', '*/*')
        .expect(404)
        .expect('Content-Type', /html/)
        .expect('Content-Length', '146')
        .expect(/\/badFile/, done);
    });
  });
});
describe('POST', () => {
  beforeEach(() => {
    sinon.replace(fs, 'writeFileSync', () => {});
  });

  afterEach(() => {
    sinon.restore();
  });
  describe('FILE NOT FOUND', () => {
    it('Should give file not found if file not exist', done => {
      request(app)
        .post('/badFile')
        .set('Accept', '*/*')
        .send('{ "name":"raja", "comment":"wonderful+site" }')
        .expect(404)
        .expect('Content-Type', /html/)
        .expect('Content-Length', '147')
        .expect(/\/badFile/, done);
    });
  });
  describe('/createTodo', () => {
    it('Should create the new todo with given title', done => {
      request(app)
        .post('/createTodo')
        .set('Accept', '*/*')
        .send('{ "title":"English" }')
        .expect(200)
        .expect('content-Type', 'application/json')
        .expect('content-Length', '997', done);
    });
  });
  describe('/removeTodo', () => {
    it('Should remove the todo with given id', done => {
      request(app)
        .post('/removeTodo')
        .set('Accept', '*/*')
        .send('{ "todoId":"4" }')
        .expect(200)
        .expect('content-Type', 'application/json')
        .expect('content-Length', '559', done);
    });
  });
  describe('/addTask', () => {
    it('Should add the given work/task to the given todo', done => {
      request(app)
        .post('/addTask')
        .set('Accept', '*/*')
        .set('Content-Type', 'application/json')
        .send('{ "todoId":"3", "work":"reading books" }')
        .expect(200)
        .expect('content-Type', 'application/json')
        .expect('content-Length', '611', done);
    });
  });
  describe('/removeTask', () => {
    it('Should remove the given work/task form the given todo', done => {
      request(app)
        .post('/removeTask')
        .set('Accept', '*/*')
        .set('Content-Type', 'application/json')
        .send('{ "todoId":"3", "taskId":"7" }')
        .expect(200)
        .expect('content-Type', 'application/json')
        .expect('content-Length', '559', done);
    });
  });
  describe('/toggleTaskCompletion', () => {
    it('Should make toggle the isCompletion of given work/task from false to true', done => {
      request(app)
        .post('/toggleTaskCompletion')
        .set('Accept', '*/*')
        .set('Content-Type', 'application/json')
        .send('{ "todoId":"3", "taskId":"6" }')
        .expect(200)
        .expect('content-Type', 'application/json')
        .expect('content-Length', '558', done);
    });
    it('Should make toggle the isCompletion of given work/task from true to false', done => {
      request(app)
        .post('/toggleTaskCompletion')
        .set('Accept', '*/*')
        .set('Content-Type', 'application/json')
        .send('{ "todoId":"3", "taskId":"6" }')
        .expect(200)
        .expect('content-Type', 'application/json')
        .expect('content-Length', '559', done);
    });
  });
  describe('/editTitle', () => {
    it('Should modify the title of given todo with given new title', done => {
      request(app)
        .post('/editTitle')
        .set('Accept', '*/*')
        .set('Content-Type', 'application/json')
        .send('{ "newTitle":"Naveen", "todoId":"3" }')
        .expect(200)
        .expect('content-Type', 'application/json')
        .expect('content-Length', '553', done);
    });
  });
  describe('/editTask', () => {
    it('Should modify the task/work of given todo with given new task/work', done => {
      request(app)
        .post('/editTask')
        .set('Accept', '*/*')
        .set('Content-Type', 'application/json')
        .send('{ "newWork":"reading", "todoId":"3", "taskId":"1"}')
        .expect(200)
        .expect('content-Type', 'application/json')
        .expect('content-Length', '550', done);
    });
  });
});

describe('METHOD NOT ALLOWED', () => {
  it('Should should give method not allowed for put method ', done => {
    request(app)
      .put('/')
      .set('Accept', '*/*')
      .expect(404)
      .expect('Content-Type', /html/)
      .expect('Content-Length', '139')
      .expect(/Cannot PUT/, done);
  });
  it('Should should give method not allowed for delete method ', done => {
    request(app)
      .delete('/')
      .set('Accept', '*/*')
      .expect(404)
      .expect('Content-Type', /html/)
      .expect('Content-Length', '142')
      .expect(/Cannot DELETE/, done);
  });
});
