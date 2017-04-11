var http = require('http')
var qs = require('querystring')

function send(theName){
  http.request({
    host:'127.0.0.1'
    ,port:3000
    ,method:'POST'
    ,url:'/'
  },function(res){
      console.log('request complete!\r\n')
      process.stdout.write('your name:')
    // res.setEncoding('utf8')
    // res.on('end',function(){
    // })
  }).end(qs.stringify({name:theName}))

}

process.stdout.write('\r\nyour name:')
process.stdin.resume()
process.stdin.on('data',function(name){
  send(name.toString().replace('\r\n', ''))
})