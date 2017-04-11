
/*
Stream 是一个抽象接口，Node 中有很多对象实现了这个接口。例如，对 http 服务器发起请求的 request 对象就是一个 Stream，还有 stdout（标准输出）。
Node.js，Stream 有四种流类型：
Readable - 可读操作。
Writable - 可写操作。
Duplex - 可读可写操作.
Transform - 操作被写入数据，然后读出结果。

所有的 Stream 对象都是 EventEmitter 的实例。常用的事件有：
data - 当有数据可读时触发。
end - 没有更多的数据可读时触发。
error - 在接收和写入过程中发生错误时触发。
finish - 所有数据已被写入到底层系统时触发。
*/


// ===========从流中读取数据================
var fs = require('fs');
var readerStream = fs.createReadStream('c2.js');
var data = '';

readerStream.setEncoding('utf8');

readerStream.on('data',function(chunk){
	data += chunk;
});

readerStream.on('end', function(){
	console.log(data);
});

readerStream.on('error', function(error){
	console.log(error.stack);
});


// =============写入流==============
var fs = require('fs');
var writeStream = fs.createWriteStream('c3.js');

var data = 'dforf dskfjer';

writeStream.write(data,'utf8');
writeStream.end();

writeStream.on('finish', function(){
	console.log('Done!');
})

writeStream.on('error',function(){
	console.log(error.stack);
})

console.log('Begin');


// ============管道流============
var fs = require('fs');
var writeStream = fs.createWriteStream('c3.js');
var readStream = fs.createReadStream('c2.js');

readStream.pipe(writeStream);


// ==================链式流-压缩===================
var fs = require('fs');
var zlib = require('zlib');

fs.createReadStream('t').pipe(zlib.createGzip()).pipe(fs.createWriteStream('t.gz'));


// =================链式流-解压==================
var fs = require('fs');
var zlib = require('zlib');

fs.createReadStream('t.gz').pipe(zlib.createGunzip()).pipe(fs.createWriteStream('t2'));





