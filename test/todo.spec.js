'use strict';

//to change behavior to testing
process.env.NODE_ENV = 'test';

var app            = require('../server.js');
var db             = require('./helper');
var request        = require('supertest-as-promised');
var chai           = require("chai");
var chaiAsPromised = require("chai-as-promised");
var expect         = chai.expect

chai.use(chaiAsPromised);

var user, token;

describe('Create Todo', function() {

  before(function (done) {
    db.clearDb(done);
  });

  beforeEach(function (done) {

    user = {
      "email": "admin@email.com",
      "password": "123abc",
    };

    request(app)
      .post('/account')
      .set('Accept', 'application/json')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    .then(function (res) {
      expect(res.body).to.have.property('token');

      token = res.body.token;
      done();

    }, done);
  });

  describe('POST /todo', function() {
    it('should create a todo', function(done) {

      var id;
      var todo = { "text": "Text to todo for test" };

      request(app)
          .post('/todo')
          .set({'Authorization': 'Bearer ' + token, 'Accept': 'application/json'})
          .send(todo)
          .expect(201)
          .expect('Content-Type', /application\/json/)

      .then(function (res) {
        expect(res.body).to.be.an('object');
        expect(res.body.text).to.equal(todo.text);

        id = res.body._id;

        return request(app)
          .delete('/todo/' + id)
          .set({'Authorization': 'Bearer ' + token, 'Accept': 'application/json'})
          .send()
          .expect(204);
      }, done)

      .then(function (res) {
        expect(res.body).to.be.empty;
        done();
      }, done);
    });
  });

  describe('GET /todos/:id', function() {
    it('should get a todo', function(done) {

      var id;
      var todo = { "text": "Text to todo for test" };

      request(app)
          .post('/todo')
          .set({'Authorization': 'Bearer ' + token, 'Accept': 'application/json'})
          .send(todo)
          .expect(201)
          .expect('Content-Type', /application\/json/)

      .then(function (res) {
        expect(res.body).to.be.an('object');
        expect(res.body.text).to.equal(todo.text);

        id = res.body._id;

        return request(app)
          .get('/todo/' + id)
          .set({'Authorization': 'Bearer ' + token, 'Accept': 'application/json'})
          .send()
          .expect(200)
          .expect('Content-Type', /application\/json/);
      }, done)


      .then(function (res) {
        expect(res.body).to.be.an('object');
        expect(res.body._id).to.equal(id);
        expect(res.body.text).to.equal(todo.text);

        return request(app)
          .delete('/todo/' + id)
          .set({'Authorization': 'Bearer ' + token, 'Accept': 'application/json'})
          .send()
          .expect(204);
      }, done)

      .then(function (res) {
        expect(res.body).to.be.empty;
        done();
      }, done);
    });
  });

  describe('PUT /todo/:id', function() {
    it('should put a todo', function(done) {

      var id;
      var todo = { "text": "Text to todo for test" };
      var update = { "text": "Text to todo for test update" };

      request(app)
          .post('/todo')
          .set({'Authorization': 'Bearer ' + token, 'Accept': 'application/json'})
          .send(todo)
          .expect(201)
          .expect('Content-Type', /application\/json/)

      .then(function (res) {
        expect(res.body).to.be.an('object');
        expect(res.body.text).to.equal(todo.text);

        id = res.body._id;

        return request(app)
          .put('/todo/' + id)
          .set({'Authorization': 'Bearer ' + token, 'Accept': 'application/json'})
          .send(update)
          .expect(200)
          .expect('Content-Type', /application\/json/);
      }, done)

      .then(function (res) {
        expect(res.body).to.be.an('object');
        expect(res.body._id).to.equal(id);
        expect(res.body.text).to.equal(update.text);

        return request(app)
          .delete('/todo/' + id)
          .set({'Authorization': 'Bearer ' + token, 'Accept': 'application/json'})
          .send()
          .expect(204);
      }, done)

      .then(function (res) {
        expect(res.body).to.be.empty;
        done();
      }, done);
    });
  });


  describe('DELETE /api/todos/:id', function() {
    it('should delete a todo', function(done) {

      var id;
      var todo = { "text": "Text to todo for test" };

      request(app)
          .post('/todo')
          .set({'Authorization': 'Bearer ' + token, 'Accept': 'application/json'})
          .send(todo)
          .expect(201)
          .expect('Content-Type', /application\/json/)

      .then(function (res) {
        expect(res.body).to.be.an('object');
        expect(res.body.text).to.equal(todo.text);

        id = res.body._id;

        return request(app)
          .delete('/todo/' + id)
          .set({'Authorization': 'Bearer ' + token, 'Accept': 'application/json'})
          .send()
          .expect(204);
      }, done)

      .then(function (res) {
        expect(res.body).to.be.empty;

        return request(app)
          .get('/todo/' + id)
          .set({'Authorization': 'Bearer ' + token, 'Accept': 'application/json'})
          .send()
          .expect(404);
      }, done)

      .then(function (res) {
        expect(res.body).to.be.empty;
        expect(res.text).to.equal('Not Found');
        done();
      }, done);
    });
  });

  describe('GET /api/todos/', function() {
    it('should get all todos', function(done) {

      var id1, id2;
      var todo1 = { "text": "Text to todo for test" };
      var todo2 = { "text": "Text to todo for test 2" };

      request(app)
          .post('/todo')
          .set({'Authorization': 'Bearer ' + token, 'Accept': 'application/json'})
          .send(todo1)
          .expect(201)
          .expect('Content-Type', /application\/json/)

      .then(function (res) {
        expect(res.body).to.be.an('object');
        expect(res.body.text).to.equal(todo1.text);

        id1 = res.body._id;

        return request(app)
          .post('/todo')
          .set({'Authorization': 'Bearer ' + token, 'Accept': 'application/json'})
          .send(todo2)
          .expect(201)
          .expect('Content-Type', /application\/json/);
      }, done)

      .then(function (res) {
        expect(res.body).to.be.an('object');
        expect(res.body.text).to.equal(todo2.text);

        id2 = res.body._id;

        return request(app)
          .get('/todo')
          .set({'Authorization': 'Bearer ' + token, 'Accept': 'application/json'})
          .send()
          .expect(200)
          .expect('Content-Type', /application\/json/);
      }, done)

      .then(function (res) {
        expect(res.body).to.be.an('array').and.to.have.length.of.at.least(2);
        expect(res.body).to.have.deep.property('[0]._id', id1);
        expect(res.body).to.have.deep.property('[0].text', todo1.text);
        expect(res.body).to.have.deep.property('[1]._id', id2);
        expect(res.body).to.have.deep.property('[1].text', todo2.text);

        return request(app)
          .delete('/todo/' + id1)
          .set({'Authorization': 'Bearer ' + token, 'Accept': 'application/json'})
          .send()
          .expect(204);
      }, done)

      .then(function (res) {
        expect(res.body).to.be.empty;

        return request(app)
          .delete('/todo/' + id2)
          .set({'Authorization': 'Bearer ' + token, 'Accept': 'application/json'})
          .send()
          .expect(204);
      }, done)

      .then(function (res) {
        expect(res.body).to.be.empty;
        done();
      }, done);
    });
  });

  afterEach(function (done) {

    request(app)
      .delete('/account/remove')
      .set({'Authorization': 'Bearer ' + token, 'Accept': 'application/json'})
      .send(user)
      .expect(204)

    .then(function (res){
      expect(res.body).to.be.empty;
      done();
    }, done);
  });

  after(function (done) {
    db.disconnect(done);
  });
});
