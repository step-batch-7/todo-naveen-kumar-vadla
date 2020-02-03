'use strict';
const request = require('supertest');

let app = require('../lib/handlers');
app = app.handleRequests.bind(app);

describe('GET', () => {
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
