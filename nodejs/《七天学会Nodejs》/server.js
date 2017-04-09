var fs = require('fs')
var path = require('path')

var http = require('http')

var MIME = {
  '.css': 'text/plain',
  '.js': 'application/javascript'
}

function main(argv) {
  console.log('Starting...')
  var config = JSON.parse(fs.readFileSync(argv[0]))
  var root = config.root || '.'
  var port = config.port || 3000
  var server



  server = http.createServer(function(req, res) {
    var urlInfo = parseUrl(root, req.url)
    validateFile(urlInfo.pathnames, function(err, pathnames) {
      if (err) {
        res.writeHead(404)
        res.end(err.message)
      } else {
        res.writeHead(200, {
          'Content-Type': urlInfo.mime
        })
        outFiles(pathnames, res)

      }
    })

  }).listen(port)

  process.on('SIGTERM',function(){
    server.close(function(){
      process.exit(0)
    })
  })

}

function parseUrl(root, url) {
  var pathnames, base, parts

  if (url.indexOf('??') === -1) {
    url = url.replace('/', '/??')
  }

  parts = url.split('??')
  base = parts[0]
  pathnames = parts[1].split(',').map(function(value) {
    return path.join(root, base, value)
  })


  return {
    mime: MIME[path.extname(pathnames[0])] || 'text/plain',
    pathnames: pathnames
  }
}

function validateFile(pathnames, callback) {
  (function next(i, len) {
    if (i < len) {
      fs.stat(pathnames[i], function(err, stats) {
        if (err) {
          callback(err)
        } else if (!stats.isFile()) {
          callback(new Error(pathnames[i] + 'Not file'))
        } else {
          next(i + 1, len)
        }
      })
    } else {
      callback(null, pathnames)
    }
  }(0, pathnames.length))

}

function outFiles(pathnames, writer) {
  (function next(i, len) {
    if (i < len) {
      var reader = fs.createReadStream(pathnames[i])
      reader.pipe(writer, {
        end: false
      })
      reader.on('end', function() {
        next(i + 1, len)
      })
    } else {
      writer.end()
    }
  }(0, pathnames.length))
}


main(process.argv.slice(2))