
var request = require('supertest')
  , server = require('../lib/server')
  , assert = require('assert')

describe('GET /bundle.js', function(){
  before(function(){
    server.logger.level('fatal')
  })

  it('responds successfully', function(done){
    request(server)
    .get('/bundle.js')
    .expect('content-type', 'application/javascript')
    .expect(200, done)
  })

  it('supports gzip compression', function(done){
    request(server)
    .get('/bundle.js')
    .set('accept-encoding', 'gzip')
    .expect('content-encoding', 'gzip')
    .end(done)
  })
})
