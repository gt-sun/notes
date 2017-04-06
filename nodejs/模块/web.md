[TOC]

## url解析

*解析字符串*

```js
const url = require('url')
const u = 'http://www.qq.com/foo/bar/?name=sun'

var urlParse = url.parse(u)

console.log(urlParse.protocol)
console.log(urlParse.hostname)
console.log(urlParse.pathname)
console.log(urlParse.search)
console.log(urlParse.query)

/*
http:
www.qq.com
/foo/bar/
?name=sun
name=sun
*/
```


*使用class:URL*

```js
const URL = require('url').URL;
const myURL = new URL('https://example.org/?abc=123');
console.log(myURL.searchParams.get('abc'));
  // Prints 123

myURL.searchParams.append('abc', 'xyz');
console.log(myURL.href);
  // Prints https://example.org/?abc=123&abc=xyz

myURL.searchParams.delete('abc');
myURL.searchParams.set('a', 'b');
console.log(myURL.href);
  // Prints https://example.org/?a=b
```

*urlSearchParams.forEach(fn[, thisArg])*

```js
const URL = require('url').URL;
const myURL = new URL('https://example.org/?a=b&c=d');
myURL.searchParams.forEach((value, name, searchParams) => {
  console.log(name, value, myURL.searchParams === searchParams);
});
  // Prints:
  // a b true
  // c d true
```

## http 客户端模式

### http.get()

*解析返回的JSON数据*

```js
var http = require('http')

http.get('http://httpbin.org/get', (res) => {
  const statusCode = res.statusCode
  const contentType = res.headers['content-type']

  //判断statusCode
  let error
  if (statusCode !== 200) {
    error = new Error(`Request Faild.\n` +
      `Status Code: ${statusCode}`)
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error(`Invalid content-type\n` +
      `Expected application/json but received ${contentType}`)
  }

  if (error) {
    console.log(error)
    res.consume()
    return
  }

  // 返回数据
  res.setEncoding('utf8')
  let rawData = ''
  res.on('data', (chunk) => {
    rawData += chunk
  })

  res.on('end', () => {
    try {
      let parseData = JSON.parse(rawData)
      console.log(parseData['url'])
    } catch (e) {
      console.log(e)
    }
  }).on('error', (e) => {
    console.log(`Got error:${e}`)
  })
})

/*打印：
{ args: {},
  headers: { Connection: 'close', Host: 'httpbin.org' },
  origin: '116.226.84.28',
  url: 'http://httpbin.org/get' }
*/
```


### http.request() POST请求

*http.request() 发送POST请求*

```js
var querystring = require('querystring')
var http = require('http')

var postData = querystring.stringify({
  'msg': 'Hello World!'
});

var options = {
  hostname: 'httpbin.org',
  port: 80,
  path: '/post',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData)
  }
};

var req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.log(`problem with request: ${e.message}`);
});

// write data to request body
req.write(postData);
req.end();

/*打印
STATUS: 200
HEADERS: {"connection":"close","server":"gunicorn/19.7.1","date":"Thu, 06 Apr 2017 09:11:27 GMT","content-type":"application/json","access-control-allow-origin":"*","access-control-allow-credentials":"true","content-length":"338","via":"1.1 vegur"}
BODY: {
  "args": {}, 
  "data": "", 
  "files": {}, 
  "form": {
    "msg": "Hello World!"
  }, 
  "headers": {
    "Connection": "close", 
    "Content-Length": "18", 
    "Content-Type": "application/x-www-form-urlencoded", 
    "Host": "httpbin.org"
  }, 
  "json": null, 
  "origin": "116.226.84.28", 
  "url": "http://httpbin.org/post"
}

No more data in response.
*/

```

## http 服务端模式

*实例1*

```js
var http = require('http');
var querystring = require('querystring');
 
var postHTML = 
  '<html><head><meta charset="utf-8"><title > 菜鸟教程 Node.js 实例 </title></head>' +
  '<body>' +
  '<form method="post">' +
  '网站名： <input name="name"><br>' +
  '网站 URL： <input name="url"><br>' +
  '<input type="submit">' +
  '</form>' +
  '</body></html>';
 
http.createServer(function (req, res) {
  var body = "";
  req.on('data', function (chunk) {
    body += chunk;
  });
  req.on('end', function () {
    // 解析参数
     body = querystring.parse(body);
    // 设置响应头部信息及编码
     res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
 
    if(body.name && body.url) { // 输出提交的数据
         res.write(" 网站名：" + body.name);
        res.write("<br>");
        res.write(" 网站 URL：" + body.url);
    } else {  // 输出表单
         res.write(postHTML);
    }
    res.end();
  });
}).listen(3000);
```

*实例2*

```js
http.createServer(function (request, response) {
    var body = [];

    console.log(request.method);
    console.log(request.headers);

    request.on('data', function (chunk) {
        body.push(chunk);
    });

    request.on('end', function () {
        body = Buffer.concat(body);
        console.log(body.toString());
    });
}).listen(8000);

/* curl --data 'Hello World' 127.0.0.1:8000
POST
{ 'user-agent': 'curl/7.26.0',
  host: '127.0.0.1',
  accept: '*/*',
  'content-length': '11',
  'content-type': 'application/x-www-form-urlencoded' }
Hello World
*/
```