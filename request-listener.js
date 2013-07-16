
module.exports = listener

function listener(req, res){
  var server = this
    , reqID = require('crypto').randomBytes(6).toString('hex')

  res.setHeader('x-request-id', reqID)

  // decorate req, res with the logger
  req.log = res.log = server.logger.child({ 'request-id': reqID })

  req.log.info({ req: req })

  // res is a writable stream and has a finish event, use to to log the res
  res.on('finish', function(){
    req.log.info({ res: res })
  })

  var EP = require('error-page')
    , erropts = { 404: 'not found'
      , 415: 'unsupported media type'
      , 402: 'https://vimeo.com/22053820'
      , '*': error
      , log: function(){} // the error-page logger is kinda useless, noop it.
      }

  res.error = EP(req, res, erropts)

  var path = require('path')
    , beardo = require('beardo')
    , beardopts = { directory: path.resolve(__dirname, 'templates') }

  res.template = beardo.handler(req, res, beardopts)

  req.is = function(type){
    // http://www.w3.org/Protocols/rfc2616/rfc2616.txt section 7.2.1
    var ct = req.headers['content-type'] || 'application/octet-stream'
      , mime = require('mime')
      , index = ct.indexOf(';')

    if (index > -1) ct = ct.substring(0, index)

    mime.define({
      'application/x-www-form-urlencoded': [ 'form' ]
    })

    return mime.lookup(type) === ct
  }

  req.wants = function(type){
    var Negotiator = require('negotiator')
      , mime = require('mime')
      , negotiator = new Negotiator(req)
      , types = negotiator.preferredMediaTypes() || []

    return types[0] === mime.lookup(type)
  }

  res.json = function(json, status, headers){
    var data = JSON.stringify(json)
      , headers = headers || {}

    headers['content-type'] = headers['content-type'] || 'application/json'

    res.send(data, status, headers)
  }

  var buffer = require('buffer').Buffer

  res.send = function(data, status, headers){
    var data = data || ''
      , status = status || res.statusCode
      , headers = headers || {}
      , data = Buffer.isBuffer(data) ? data : new Buffer(data)

    res.statusCode = status

    Object.keys(headers).forEach(function(key){
      res.setHeader(key, headers[key])
    })

    res.setHeader('content-length', data.length)
    res.end(data)
  }

  // the last thing is to send the decorated req, res objects to the proper
  //routes
  var url = require('url')
    , pathname = url.parse(req.url).pathname
    , router = require('./router')
    , route = router.match(pathname)

  // Merge the route's keys to the request object
  if (route) Object.keys(route).forEach(function(k){ req[k] = route[k] })

  // has route?
  if (!route) return res.error(404)
  else return route.fn(req, res)
}

// the default error handler passed to error-page
function error(req, res, data){
  if (data.code >= 500) {
    // something real bad happened here.
  }

  req.log.error({ err: data.error })

  var json = { mesage: data.error.message
      , status: data.code
      , 'request-id': res.getHeader('x-request-id')
      , url: req.url
      }

  res.json(json, data.code)
}
