var fs = require('fs')
var stdin = process.stdin
var stdout = process.stdout

var stats = []

fs.readdir('.', function(error, files) {
  function file(i) {
    var filename = files[i]
    fs.stat(__dirname + '/' + filename, function(error, stat) {
      stats[i] = stat
      if (stat.isDirectory()) {
        console.log('[DIR]\t' + i + '.' + filename)
      } else {
        console.log('[FILE]\t' + i + '.' + filename)
      }

      if (++i == files.length) {
        read()
      } else {
        file(i)
      }
    })

  }

  function read() {
    stdout.write('Enter your number :')
      stdin.read()
    // stdin.resume()
    stdin.on('data', callback)
  }

  function callback(data) {
    var data = Number(data)
    if (!files[data]) {
      stdout.write('Enter your number :')
    } else {
      stdin.pause() // 结束输入，立即退出
      if (stats[data].isDirectory()) {
        fs.readdir(files[data], (error, v) => {
          v.forEach((item) => {
            console.log('  - ' + item)
          })
        })
      } else {
        fs.readFile(files[data], (error, v) => {
          console.log(v.toString().replace(/(.*)/g, '    $1'))
        })
      }
    }
  }

  file(0)
})