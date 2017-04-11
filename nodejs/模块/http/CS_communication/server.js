var http = require('http')
var qs = require('querystring')

var server = http.createServer(function(req,res){
  var body = ''
  req.on('data',(chunk)=>{
    body += chunk
  })
  req.on('end',()=>{
    res.writeHead(200)
    res.end()
    console.log('Got name: ' + qs.parse(body).name)
  })
})

server.listen(3000)