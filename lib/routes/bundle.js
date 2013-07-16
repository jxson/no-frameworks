
module.exports = function(req, res){
  // while we are dynamically rendering this stuff they are effectivley static
  // assets and should be handled appropriately
  res.removeHeader('set-cookie')
  res.setHeader('cache-control', 'max-age=86400')

  if (req.method !== 'GET') return res.error(405)

  // Lets query params slip through
  var url = require('url')
    , pathname = url.parse(req.url).pathname

  switch (pathname) {
    case '/bundle.js': return js(req, res)
    case '/bundle.css': return css(req, res)
    default: return res.error(404)
  }
}

function js(req, res){
  var browserify = require('browserify')
    , oppressor = require('oppressor')
    , path = require('path')
    , bundle

  res.setHeader('content-type', 'application/javascript')

  bundle = browserify()
  .add(path.resolve(__dirname, '../../browser/index.js'))
  .bundle()
  .pipe(oppressor(req))
  .pipe(res)

}

function css(req, res){
  var rework = require('rework')
    , path = require('path')
    , fs = require('fs')
    , file = path.resolve(__dirname, '../../stylesheets/index.css')

  fs.readFile(file, 'utf8', function(err, data){
    if (err) return res.error(err)

    var css = rework(data)
        .vendors(['-webkit-', '-moz-'])
        .use(rework.keyframes())
        .use(rework.prefix('border-radius'))
        .toString()

    res.send(css, 200, { 'content-type': 'text/css' })
  })
}

