

## asynchronous-flow-control

promise部分请看promise.md.

### yieldable

```js
function* hello(){
  console.log(1)
  yield
  console.log(2)
}

var s = hello()

s.next()
s.next()
```

### Async函数

async 可以声明一个异步函数，此函数需要返回一个 Promise 对象。await 可以等待一个 Promise 对象 resolve，并拿到结果。

另外，await / async 会不可避免地用到 try..catch，而 try..catch 内的代码是不会被 JavaScript 引擎所优化的。所以在这时用 Promise 的 reject 来代为处理也比较合适。

```js
async function a1() {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 1000);
  })
}

async function a2() {
  await a1();
  console.log("2333");
}

a2()
```

*并行运行*

时间花费在2s

```js
let sleep = function(time,info){
  return new Promise((resolve)=>{
    setTimeout(()=>{
      console.log(info)
      resolve('this is ' + info)
    },time)
  })
}

var winner = sleep(1000,'winner')
var loser = sleep(2000,'loser')

async function main(){
  await Promise.all([winner,loser]).then(value =>{
    console.log('IS BINGXING ' + value)
  })
  console.log('Begin~')
}

main()

/*
winner
loser
IS BINGXING this is winner,this is loser
Begin~
*/
```

Node.js 里关于异常处理有一个约定，即同步代码采用 try/catch，非同步代码采用 error-first 方式。对于 async 函数俩说，它的 await 语句是同步执行的，所以最正常的流程处理是采用 try/catch 语句捕获。

```js
try {
  console.log(await asyncFn());
} catch (err) {
  console.error(err);
}
```

这是通用性的做法，很多时候，我们需要把异常做的更细致一些，这时只要把 Promise 的异常处理好就好了。