'use strict';
const request = require('supertest');
const fs = require('fs');
const sinon = require('sinon');

const app = require('../lib/app');

describe('GET', () => {
  beforeEach(() => {
    sinon.replace(fs, 'writeFileSync', () => {});
  });
  afterEach(() => {
    sinon.restore();
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
  describe('Static Requests', () => {
    it('should get the path / or index.html', done => {
      request(app)
        .get('/')
        .set('Accept', '*/*')
        .expect(200)
        .expect('Content-Type', /html/)
        .expect(/<title>Todo<\/title>/, done);
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
  describe('/user/tasks', () => {
    it('Should give the tasks as stringified array of objects', done => {
      request(app)
        .get('/user/tasks')
        .set('Accept', '*/*')
        .set('Cookie', 'sessionId=1')
        .expect(200)
        .expect('content-Type', 'application/json')
        .expect('content-Length', '977', done);
    });
  });
  describe('/logout', () => {
    it('Should logout the given user and redirect to /', done => {
      request(app)
        .get('/logout')
        .set('Accept', '*/*')
        .set('Cookie', 'sessionId=1')
        .expect(302)
        .expect('Location', '/', done);
    });
  });
  describe('/', () => {
    it('Should should redirect to /user/ if iam already logged in', done => {
      request(app)
        .get('/')
        .set('Accept', '*/*')
        .set('Cookie', 'sessionId=1')
        .expect(302)
        .expect('Location', '/user/', done);
    });
    it('Should give me / if have not logged in', done => {
      request(app)
        .get('/')
        .set('Accept', '*/*')
        .expect(200)
        .expect('Content-Type', /html/)
        .expect(/<title>Todo<\/title>/, done);
    });
  });
  describe('/user/homePage.html', () => {
    it('Should should give me /user/homePage.html if iam already logged in', done => {
      request(app)
        .get('/user/homePage.html')
        .set('Accept', '*/*')
        .set('Cookie', 'sessionId=1')
        .expect(200)
        .expect('Content-Type', /html/)
        .expect(/<title>Todo<\/title>/, done);
    });
    it('Should redirect me to / if i am not logged in', done => {
      request(app)
        .get('/user/homePage.html')
        .set('Accept', '*/*')
        .expect(302)
        .expect('Location', '/', done);
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
  describe('TodoPage', () => {
    describe('/user/createTodo', () => {
      it('Should create the new todo with given title', done => {
        request(app)
          .post('/user/createTodo')
          .set('Accept', '*/*')
          .set('Cookie', 'sessionId=1')
          .send({ title: 'English' })
          .expect(200)
          .expect('content-Type', 'application/json')
          .expect('content-Length', '1015', done);
      });
    });
    describe('/user/removeTodo', () => {
      it('Should remove the todo with given id', done => {
        request(app)
          .post('/user/removeTodo')
          .set('Accept', '*/*')
          .set('Cookie', 'sessionId=1')
          .send({ todoId: '4' })
          .expect(200)
          .expect('content-Type', 'application/json')
          .expect('content-Length', '977', done);
      });
    });
    describe('/user/addTask', () => {
      it('Should add the given work/task to the given todo', done => {
        request(app)
          .post('/user/addTask')
          .set('Accept', '*/*')
          .set('Content-Type', 'application/json')
          .set('Cookie', 'sessionId=1')
          .send({ todoId: '3', work: 'reading books' })
          .expect(200)
          .expect('content-Type', 'application/json')
          .expect('content-Length', '1029', done);
      });
    });
    describe('/user/removeTask', () => {
      it('Should remove the given work/task form the given todo', done => {
        request(app)
          .post('/user/removeTask')
          .set('Accept', '*/*')
          .set('Content-Type', 'application/json')
          .set('Cookie', 'sessionId=1')
          .send({ todoId: '3', taskId: '7' })
          .expect(200)
          .expect('content-Type', 'application/json')
          .expect('content-Length', '977', done);
      });
    });
    describe('/user/toggleTaskCompletion', () => {
      it('Should make toggle the isCompletion of given work/task from false to true', done => {
        request(app)
          .post('/user/toggleTaskCompletion')
          .set('Accept', '*/*')
          .set('Content-Type', 'application/json')
          .set('Cookie', 'sessionId=1')
          .send({ todoId: '3', taskId: '6' })
          .expect(200)
          .expect('content-Type', 'application/json')
          .expect('content-Length', '976', done);
      });
      it('Should make toggle the isCompletion of given work/task from true to false', done => {
        request(app)
          .post('/user/toggleTaskCompletion')
          .set('Accept', '*/*')
          .set('Content-Type', 'application/json')
          .set('Cookie', 'sessionId=1')
          .send({ todoId: '3', taskId: '6' })
          .expect(200)
          .expect('content-Type', 'application/json')
          .expect('content-Length', '977', done);
      });
    });
    describe('/user/editTitle', () => {
      it('Should modify the title of given todo with given new title', done => {
        request(app)
          .post('/user/editTitle')
          .set('Accept', '*/*')
          .set('Content-Type', 'application/json')
          .set('Cookie', 'sessionId=1')
          .send({ newTitle: 'Naveen', todoId: '3' })
          .expect(200)
          .expect('content-Type', 'application/json')
          .expect('content-Length', '971', done);
      });
    });
    describe('/user/editTask', () => {
      it('Should modify the task/work of given todo with given new task/work', done => {
        request(app)
          .post('/user/editTask')
          .set('Accept', '*/*')
          .set('Content-Type', 'application/json')
          .set('Cookie', 'sessionId=1')
          .send({ newWork: 'reading', todoId: '3', taskId: '1' })
          .expect(200)
          .expect('content-Type', 'application/json')
          .expect('content-Length', '968', done);
      });
    });
  });
  describe('/signUp', () => {
    const userData = {
      fullName: 'naveen',
      mail: 'naveen@naveen.naveen',
      userName: 'naveenKumar',
      password: 'naveen'
    };
    it('Should signUp the given user with given data', done => {
      request(app)
        .post('/signUp')
        .set('Accept', '*/*')
        .send(userData)
        .expect(302)
        .expect('Location', '/', done);
    });
    it('Should say useName Already in use if you give already exists userName', done => {
      request(app)
        .post('/signUp')
        .set('Accept', '*/*')
        .send(userData)
        .expect(200)
        .expect('User Name naveenKumar Already in use', done);
    });
  });
  describe('/login', () => {
    it('Should should login the existing user', done => {
      const userData = {
        userName: 'naveenKumar',
        password: 'naveen'
      };
      request(app)
        .post('/login')
        .set('Accept', '*/*')
        .send(userData)
        .expect(302)
        .expect('Location', '/user/')
        .expect('set-Cookie', /sessionId=2/, done);
    });
    it('Should redirect to the / if userName or password is incorrect', done => {
      const userData = {
        userName: 'naveenKumarVadla',
        password: 'naveenKumar'
      };
      request(app)
        .post('/login')
        .set('Accept', '*/*')
        .send(userData)
        .expect(302)
        .expect('Location', '/', done);
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
describe('hasFields', () => {
  it('Should call next if all fields are present', done => {
    request(app)
      .post('/login')
      .set('Accept', '*/*')
      .send({ userName: 'naveenKumar', password: 'naveen' })
      .expect(302)
      .expect('Location', '/user/')
      .expect('set-Cookie', /sessionId=2/, done);
  });
  it('Should call give 400 BadRequest if all fields are not present', done => {
    request(app)
      .post('/login')
      .set('Accept', '*/*')
      .send({ userName: 'naveenKumar' })
      .expect(400)
      .expect(/Bad Request/, done);
  });
});
