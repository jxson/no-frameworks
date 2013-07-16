
// http://dshaw.github.io/2012-09-lxjs/
// this is a good idea for a bunch of reasons
// use a service like monit and statuspage.io
// sometimes a process looks good but the network might be hosed
// exposing this endpoint makes it easy to check using http
module.exports = function(req, res){
  res.json({ pid: process.pid
  , memory: process.memoryUsage()
  , uptime: process.uptime()
  , connections: req.client.server.connections
  })
}

