'use strict';
const request = require('supertest');
const fs = require('fs');
const sinon = require('sinon');

let app = require('../lib/handlers');
app = app.handleRequests.bind(app);

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
        .expect('Content-Type', 'text/html', done);
    });
    it('should get the path /css/homePage.css', done => {
      request(app)
        .get('/css/homePage.css')
        .set('Accept', '*/*')
        .expect(200)
        .expect('Content-Type', 'text/css', done);
    });
    it('should get the path /js/homePage.js', done => {
      request(app)
        .get('/js/homePage.js')
        .set('Accept', '*/*')
        .expect(200)
        .expect('Content-Type', 'application/javascript', done);
    });
    it('should get the path /js/eventHandlers.js', done => {
      request(app)
        .get('/js/eventHandlers.js')
        .set('Accept', '*/*')
        .expect(200)
        .expect('Content-Type', 'application/javascript', done);
    });
    it('should get the path /images/create.svg', done => {
      request(app)
        .get('/images/create.svg')
        .set('Accept', '*/*')
        .expect(200)
        .expect('Content-Type', 'image/svg+xml', done);
    });
    it('should get the path /images/edit.svg', done => {
      request(app)
        .get('/images/edit.svg')
        .set('Accept', '*/*')
        .expect(200)
        .expect('Content-Type', 'image/svg+xml', done);
    });
    it('should get the path /images/delete.svg', done => {
      request(app)
        .get('/images/delete.svg')
        .set('Accept', '*/*')
        .expect(200)
        .expect('Content-Type', 'image/svg+xml', done);
    });
    it('should get the path /images/tick.svg', done => {
      request(app)
        .get('/images/tick.svg')
        .set('Accept', '*/*')
        .expect(200)
        .expect('Content-Type', 'image/svg+xml', done);
    });
    it('should get the path /images/editTask.svg', done => {
      request(app)
        .get('/images/editTask.svg')
        .set('Accept', '*/*')
        .expect(200)
        .expect('Content-Type', 'image/svg+xml', done);
    });
    it('should get the path /images/remove.svg', done => {
      request(app)
        .get('/images/remove.svg')
        .set('Accept', '*/*')
        .expect(200)
        .expect('Content-Type', 'image/svg+xml', done);
    });
  });

  describe('/tasks', () => {
    it('Should give the tasks as stringified array of objects', done => {
      request(app)
        .get('/tasks')
        .set('Accept', '*/*')
        .expect(200)
        .expect('content-Length', '977', done);
    });
  });

  describe('FILE NOT FOUND', () => {
    it('Should give file not found if file not exist', done => {
      request(app)
        .get('/badFile')
        .set('Accept', '*/*')
        .expect(404)
        .expect('Content-Type', 'text/plain')
        .expect('Content-Length', '18')
        .expect('404 File Not Found', done);
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
        .send('name=raja&comment=wonderful+site')
        .expect(404)
        .expect('Content-Type', 'text/plain')
        .expect('Content-Length', '18')
        .expect('404 File Not Found', done);
    });
  });
});

describe('METHOD NOT ALLOWED', () => {
  it('Should should give method not allowed for put method ', done => {
    request(app)
      .put('/')
      .set('Accept', '*/*')
      .expect(400)
      .expect('Content-Type', 'text/plain')
      .expect('Content-Length', '22')
      .expect('400 Method Not Allowed', done);
  });
  it('Should should give method not allowed for delete method ', done => {
    request(app)
      .delete('/')
      .set('Accept', '*/*')
      .expect(400)
      .expect('Content-Type', 'text/plain')
      .expect('Content-Length', '22')
      .expect('400 Method Not Allowed', done);
  });
});
