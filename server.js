
// uncaught error stuff

var http = require('http')
  , listener = require('./request-listener')
  , server = http.createServer(listener)
  , bunyan = require('bunyan')

// decorates the server with the buyan logger
// this makes it nice to adjust log levels dynamically like in the tests
server.logger = bunyan.createLogger({ name: 'no-frameworks'
, level: process.env.LOG_LEVEL || 'info'
, serializers: { req: bunyan.stdSerializers.req
  , res: bunyan.stdSerializers.res
  , err: bunyan.stdSerializers.err
  , error: bunyan.stdSerializers.err
  }
})

module.exports = server
