
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
      , '*': error
      , log: function(){} // the error-page logger is kinda useless, noop it.
      }

  res.error = EP(req, res, erropts)

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

    for (var key in Object.keys(headers)) { res.setHeader(key, headers[key]) }

    res.setHeader('content-length', data.length)
    res.end(data)
  }

  // res.end('YEYA')
  // res.error(new Error('AHHHHH'))
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
