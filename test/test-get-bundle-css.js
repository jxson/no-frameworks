
var request = require('supertest')
  , server = require('../lib/server')
  , assert = require('assert')

describe('GET /bundle.css', function(){
  before(function(){
    server.logger.level('fatal')
  })

  it('responds successfully', function(done){
    request(server)
    .get('/bundle.css')
    .expect('content-type', 'text/css')
    .expect(200, done)
  })
})
