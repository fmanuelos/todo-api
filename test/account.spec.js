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


describe('Autentication', function() {

  before(function (done) {
    db.clearDb(done);
  });

  describe('POST /account/', function() {
    it('should signup a user', function(done) {

      var user = {
        "email": "admin@email.com",
        "password": "123abc",
      };

      var token;

      request(app)
        .post('/account')
        .set('Accept', 'application/json')
        .send(user)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      .then(function (res) {
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('token');

        token = res.body.token;

        return request(app)
          .get('/account/me')
          .set({'Authorization': 'Bearer ' + token, 'Accept': 'application/json'})
          .send()
          .expect(200)
          .expect('Content-Type', /application\/json/);
        }, done)

      .then(function (res) {
        expect(res.body).to.be.an('object');
        expect(res.body.email).to.equal(user.email);

        return request(app)
          .delete('/account/remove')
          .set({'Authorization': 'Bearer ' + token, 'Accept': 'application/json'})
          .send()
          .expect(204);
        }, done)

      .then( function (res){
        expect(res.body).to.be.empty;
        done();
      }, done);
    });

    it('should refuse invalid emails', function(done) {

      var user = {
        "email": "admin&email,com",
        "password": "123abc",
      };

      request(app)
        .post('/account')
        .set('Accept', 'application/json')
        .send(user)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      .then(function (res) {
        expect(res.body).to.be.an('array').and.to.have.length.of.at.least(1);
        expect(res.body).to.have.deep.property('[0].msg', 'Email is not valid');
        done();
      }, done);
    });

    it('should refuse short passwords', function(done) {

      var user = {
        "email": "admin@email.com",
        "password": "12345",
      };

      request(app)
        .post('/account')
        .set('Accept', 'application/json')
        .send(user)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      .then(function (res) {
        expect(res.body).to.be.an('array').and.to.have.length.of.at.least(1);
        expect(res.body).to.have.deep.property('[0].msg', 'Password must be at least 6 characters long');
        done();
      }, done);
    });

    it('should refuse email duplicate', function(done) {

      var user1 = {
        "email": "admin@email.com",
        "password": "123abc",
      };

      var user2 = {
        "email": "admin@email.com",
        "password": "cba321",
      };

      request(app)
        .post('/account')
        .set('Accept', 'application/json')
        .send(user1)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      .then(function (res) {
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('token');

        return request(app)
          .post('/account')
          .set('Accept', 'application/json')
          .send(user2)
          .expect(400)
          .expect('Content-Type', /application\/json/);
        }, done)

      .then(function (res) {
        expect(res.body).to.be.an('array').and.to.have.length.of.at.least(1);
        expect(res.body).to.have.deep.property('[0].msg', 'Account with that email address already exists.');
        done();
      }, done);
    });
  });

  describe('POST /account/token', function() {
    it('should refuse invalid tokens', function(done) {

      var token = '123456789';

      request(app)
        .get('/account/me')
        .set({'Authorization': 'Bearer ' + token, 'Accept': 'application/json'})
        .send()
        .expect(401)

      .then(function (res) {
        expect(res.body).to.be.empty;
        expect(res.text).to.equal('Unauthorized');
        done();
      }, done);
    });
  });

  after(function (done) {
    db.disconnect(done);
  });

});
