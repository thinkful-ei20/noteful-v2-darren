'use strict';

/**
 * DISCLAIMER:
 * The examples shown below are superficial tests which only check the API responses.
 * They do not verify the responses against the data in the database. We will learn
 * how to crosscheck the API responses against the database in a later exercise.
 */
const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const knex = require('../knex');
const seedData = require('../db/seedData');
const expect = chai.expect;
chai.config.includeStack = true;

chai.use(chaiHttp);

describe('Reality check', function () {

  it('true should be true', function () {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', function () {
    expect(2 + 2).to.equal(4);
  });

});

describe('Environment', () => {

  it('NODE_ENV should be "test"', () => {
    expect(process.env.NODE_ENV).to.equal('test');
  });

  it('connection should be test database', () => {
    expect(knex.client.connectionSettings.database).to.equal('noteful-test');
  });

});

describe('Noteful App', function () {

  beforeEach(function () {
    return seedData('./db/noteful.sql');
  });

  after(function () {
    return knex.destroy(); // destroy the connection
  });

  describe('Static app', function () {

    it('GET request "/" should return the index page', function () {
      return chai.request(app)
        .get('/')
        .then(function (res) {
          expect(res).to.exist;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
        });
    });

  });

  describe('404 handler', function () {

    it('should respond with 404 when given a bad path', function () {
      return chai.request(app)
        .get('/bad/path')
        .then(res => {
          expect(res).to.have.status(404);
        });
    });

  });

  describe('GET /api/notes', function () {

    it('should return the default of 10 Notes ', function () {
      let count;
      return knex.count()
        .from('notes')
        .then(([result]) => {
          count = Number(result.count);
          return chai.request(app).get('/api/notes');
        })
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(count);
        });
    });

    it('should return a list with the correct right fields', function () {
      let res;
      return chai.request(app).get('/api/notes')
        .then(function (_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(10);
          res.body.forEach(function (item) {
            expect(item).to.be.a('object');
            expect(item).to.include.keys('id', 'title', 'content');
          });
          return knex.select().from('notes');
        })
        .then(data => {
          data.forEach(function(note,index) {
            expect(note).to.be.a('object');
            expect(note).to.include.keys('id', 'title', 'content');
            expect(note.id).to.equal(res.body[index].id);
            expect(note.title).to.equal(res.body[index].title);
            expect(note.content).to.equal(res.body[index].content);
          });  
        });
    });   

    it('should return correct search results for a valid query', function () {
      let res;
      return chai.request(app).get('/api/notes?searchTerm=gaga')
        .then(function (_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(1);
          expect(res.body[0]).to.be.an('object');
          return knex.select().from('notes').where('title', 'like', '%gaga%');
        })
        .then(data => {
          expect(res.body[0].id).to.equal(data[0].id);
        });
    });

    //myupdate on return empty array for an incorrect query:
    it('should return an empty array for an incorrect query', function () {
      let res;
      return chai.request(app).get('/api/notes?searchTerm=Not%20a%20Valid%20Search')
        .then(function (_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(0);
          return knex.select().from('notes').where({title : 'Trash title does not exist'});
        })
        .then(data => {
          expect(data).to.be.a('array');
          expect(data).to.have.length(0);
          expect(data[0]).to.equal(undefined);
        });
    });
    
  });

  describe('GET /api/notes/:id', function () {

    it('should return correct notes', function () {

      const dataPromise = knex.first()
        .from('notes')
        .where('id', 1001);

      const apiPromise = chai.request(app)
        .get('/api/notes/1001');

      return Promise.all([dataPromise, apiPromise])
        .then(function ([data, res]) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.include.keys('id', 'title', 'content');
          expect(res.body.id).to.equal(1001);
          expect(res.body.title).to.equal(data.title);
        });
    });

    
    it('should respond with a 404 for an invalid id', function () {
      return chai.request(app)
        .get('/DOES/NOT/EXIST')
        .then(res => {
          expect(res).to.have.status(404);
          return knex.select().from('notes').where({id: 9999});
        })
        .then(data => {
          expect(data).to.be.a('array');
          expect(data).to.have.length(0);
        });
    });

  });

  describe('POST /api/notes', function () {

    it('should create and return a new item when provided valid data', function () {
      const newItem = {
        'title': 'The best article about cats ever!',
        'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...',
        'tags': []
      };
      let body;
      return chai.request(app)
        .post('/api/notes')
        .send(newItem)
        .then(function (res) {
          body = res.body;
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(body).to.be.a('object');
          expect(body).to.include.keys('id', 'title', 'content');
          return knex.select().from('notes').where('id', body.id);
        })
        .then(([data]) => {
          expect(body.title).to.equal(data.title);
          expect(body.content).to.equal(data.content);
        });
    });

    it('should return an error when missing "title" field', function () {
      const newItem = {
        'foo': 'bar'
      };
      return chai.request(app)
        .post('/api/notes')
        .send(newItem)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Missing `title` in request body');
          return knex.select().from('notes').where({id : 1012});
        })
        .then(data => {
          expect(data).to.be.a('array');
          expect(data).to.have.length(0);
        });
    });

  });

  describe('PUT /api/notes/:id', function () {

    it('should update the note', function () {
      const updateItem = {
        'title': 'What about dogs?!',
        'content': 'woof woof'
      };
      // let body;
      let res;
      return chai.request(app)
        .put('/api/notes/1005')
        .send(updateItem)
        .then(function (_res) {
          res = _res;
          // body = res.body;
          // console.log(res.body.id);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys('id', 'title', 'content');

          expect(res.body.id).to.equal(1005);
          expect(res.body.title).to.equal(updateItem.title);
          expect(res.body.content).to.equal(updateItem.content);
          return knex.select().from('notes').where('id', res.body.id );
        })
        .then(data => {
          expect(data).to.be.a('array');
          expect(data.title).to.equal(res.title);  
          expect(data.content).to.equal(res.content); 
        });
    });

    it('should respond with a 404 for an invalid id', function () {
      const updateItem = {
        'title': 'What about dogs?!',
        'content': 'woof woof'
      };
      return chai.request(app)
        .put('/DOES/NOT/EXIST')
        .send(updateItem)
        .then(res => {
          expect(res).to.have.status(404);
        });
    });

    it('should return an error when missing "title" field', function () {
      const updateItem = {
        'foo': 'bar'
      };
      return chai.request(app)
        .put('/api/notes/1005')
        .send(updateItem)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Missing `title` in request body');
        });
    });

  });

  describe('DELETE  /api/notes/:id', function () {
    let deleteId = 1005;

    it('should delete an item by id', function () {
      return chai.request(app)
        .delete(`/api/notes/${deleteId}`)
        .then(function (res) {
          expect(res).to.have.status(204);
          return knex.select().from('notes').where('id', deleteId);
        })
        .then(data => {
          expect(data).to.be.a('array');
          expect(data).to.have.length(0);         
        });
    });

  });

  // ---FOLDERS---

  describe('GET /api/folders', function () {

    it('should return the folders ', function () {
      let count;
      return knex.count()
        .from('folders')
        .then(([result]) => {
          count = Number(result.count);
          return chai.request(app).get('/api/folders');
        })
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(count);
        });
    });
  });
  
  it('should return a list with the correct folder fields', function () {
    let res;
    return chai.request(app).get('/api/folders')
      .then(function (_res) {
        res = _res;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(4);
        res.body.forEach(function (item) {
          expect(item).to.be.a('object');
          expect(item).to.include.keys('id', 'name');
        });
        return knex.select().from('folders');
      })
      .then(data => {
        data.forEach(function(folder,index) {
          expect(folder).to.be.a('object');
          expect(folder).to.include.keys('id', 'name');
          expect(folder.id).to.equal(res.body[index].id);
          expect(folder.name).to.equal(res.body[index].name);
        });  
      });
  });   
  


});