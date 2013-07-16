
var http = require('http')
  , listener = require('./request-listener')
  , domain = require('domain')
  , bunyan = require('bunyan')
  , options = { name: 'no-frameworks'
    , level: process.env.LOG_LEVEL || 'info'
    , serializers: bunyan.stdSerializers
    }
  , logger = bunyan.createLogger(options)

// creates the server, adds a domain to the req, res then passes them the the
// req-listener
server = http.createServer(function(req, res){
  var d = domain.create()
    , server = this

  d.on('error', function(err){
    // this is a good place to log uncaught errors to a service like sentry or
    // bugsense
    throw err
  })

  d.add(req)
  d.add(res)

  d.run(function(){
    // makes sure the listener this is scoped to the server
    listener.call(server, req, res)
    // throw new Error('WTF')
  })
})

// decorates the server with the logger this makes it easy to adjust log
// levels dynamically from other modules (like in the tests)
server.logger = logger

module.exports = server
