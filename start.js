
var server = require('./server')
  , port = process.env.PORT || 8080
  , host = process.env.HOST

server.listen(port, host)
