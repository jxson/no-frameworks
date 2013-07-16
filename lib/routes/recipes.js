
module.exports = function(req, res){
  switch (req.method) {
    // case 'GET'    : return show(req, res)
    case 'POST'   : return create(req, res)
    // case 'PATCH'   : return edit(req, res)
    // case 'DELETE' : return destroy(req, res)
    default       : return res.error(405)
  }
}

function create(req, res){
  req.on('json', function(data){
    res.json(data, 201)
  })
}
