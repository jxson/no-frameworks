
var http = require('http')
  , listener = require('./request-listener')
  , server = http.createServer(listener)
  , port = process.env.PORT || 8080
  , host = process.env.HOST

server.listen(port, host)
