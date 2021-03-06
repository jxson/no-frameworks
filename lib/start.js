
var server = require('./server')
  , port = process.env.PORT || 8080
  , host = process.env.HOST

server.on('close', function(){
  server.logger.warn('Server closing')
})

server.listen(port, host, function(){
  var url = require('url')
    , formatted = url.format({ protocol: 'http'
      , hostname: require('os').hostname()
      , port: server.address().port
      })

  server.logger.info('Server is running at: %s', formatted)
})
