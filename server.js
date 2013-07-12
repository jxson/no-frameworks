
var http = require('http')

module.exports = http.createServer(handler)

function handler(req, res){
  res.end('HI')
}
