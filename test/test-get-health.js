
var request = require('supertest')
  , server = require('../server')
  , assert = require('assert')

describe('GET /health', function(){
  before(function(){
    // stop log output from spilling to stdout and messing up the test
    // reporter's output
    server.logger.level('fatal')
  })

  it('responds with health info', function(done){
    request(server)
    .get('/health')
    .expect('content-type', 'application/json')
    .expect(200)
    .end(function(err, res){
      if (err) return done(err)

      assert.ok(res.body.pid, 'Should have ket for pid')
      assert.ok(res.body.memory, 'Should have ket for memory')
      assert.ok(res.body.connections, 'Should have ket for connections')

      done()
    })
  })
})
