
var methods = [ 'GET', 'PATCH' ]

module.exports = function(req, res){
  // only allow get head and profile
  if (! req.method in methods) return res.error(405)

  var data = { foo: 'bar' }

  if (req.wants('html')) return res.template('index', data)
  if (req.wants('json')) return res.json(data)

  // made it this far?
  // the client is asking for a media type I don't want to deal with
  res.error(415)
}
