
var domready = require('domready')
  , drag = require('drag-stream')
  , through = require('through')

domready(function(){
  var element = document.getElementById('drag')

  drag(element).pipe(through(write))

  function write(data){
    console.log('data', data)
  }
})
