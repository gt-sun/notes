

// ===========fs.watchFile() 监视文件===========
var fs = require('fs')
var files = fs.readdirSync(process.cwd())
files.forEach(function(file) {
  if (/\.js$/.test(file)) {
    fs.watchFile(process.cwd() + '/' + file, function(curr,prev) {
      console.log('  - ' + file + ' changed! ')
      console.log(`curr.mtime: ${curr.mtime}`)
      console.log(`prev.mtime: ${prev.mtime}`)
      
    })
  }
})