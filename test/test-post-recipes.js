var request = require('supertest')
  , server = require('../lib/server')
  , assert = require('assert')

describe('POST /recipes', function(){
  before(function(){
    server.logger.level('fatal')
  })

  it('successfully handles json', function(done){
    request(server)
    .post('/recipes')
    .send({ title: 'Tamales' })
    .type('json')
    .expect('content-type', /json/)
    .expect(201, done)
  })

  it('successfully handles form data', function(done){
    request(server)
    .post('/recipes')
    .send({ title: 'Tamales' })
    .type('application/x-www-form-urlencoded')
    .expect(201, done)
  })
})
