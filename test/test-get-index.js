
var request = require('supertest')
  , server = require('../lib/server')
  , cheerio = require('cheerio')
  , assert = require('assert')

describe('GET /', function(){
  before(function(){
    server.logger.level('fatal')
  })

  it('responds with html', function(done){
    request(server)
    .get('/')
    .set('accept', 'text/html')
    .expect('content-type', 'text/html')
    .expect(200)
    .end(function(err, res){
      if (err) return done(err)

      // should make this a plugin for supertest
      var $ = cheerio.load(res.text)

      assert.equal($('h1').length, 1)
      assert.equal($('p').length, 1)

      done()
    })
  })

  it('responds with json', function(done){
    request(server)
    .get('/')
    .set('accept', 'application/json')
    .expect('content-type', 'application/json')
    .expect(200, done)
  })
})
