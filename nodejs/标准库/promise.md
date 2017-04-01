https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise

Promise 对象用于异步技术中。Promise 意味着一个还没有完成的操作（许愿），但在未来会完成的（实现）。

```js
var myFirstPromise = new Promise(function(resolve, reject){
    //当异步代码执行成功时，我们才会调用resolve(...), 当异步代码失败时就会调用reject(...)
    //在本例中，我们使用setTimeout(...)来模拟异步代码，实际编码时可能是XHR请求或是HTML5的一些API方法.
    setTimeout(function(){
        resolve("Success"); //代码正常执行！
    }, 250);
});

myFirstPromise.then(function(successMessage){
    //successMessage的值是上面调用resolve(...)方法传入的值.
    //successMessage参数不一定非要是字符串类型，这里只是举个例子
    console.log("Yay! " + successMessage);
});
```




## asynchronous-flow-control

https://i5ting.github.io/asynchronous-flow-control/

js 流程控制的演进过程，分以下 6 部分:

同步代码
异步 JavaScript: callback hell
Thunk
Promise/a+
生成器 Generators/yield
Async 函数 / Await

- 异步

Node.js 里又为了性能而异步，即所谓的天生异步，每个 api 都是异步的。

以 Node.js 为例

- error-first callback（错误优先的回调机制）
- EventEmitter （事件发射机制）

总结，callback 是用的最多的，是绝大部分的 api 遵守的约定，而 EventEmitter 是辅助机制，通过继承 EventEmitter，来解耦业务逻辑。


- promise

> 为了让大家从回调的地狱中回到天堂，Promise 你值得拥有


Promise 是一种令代码异步行为更加优雅的抽象，有了它，我们就可以像写同步代码一样去写异步代码。它是从 Common JS 规范分裂出来的，目前主流是 Promose/A+ 规范。


- generator

generator 是 es6 的一个特性，本身是用于计算的，通过 generator 和 yield 写的代码看起来像同步的，主要是 yield 来处理同步的事儿，但 yield 又只能在 generator 里。

- async function

generator 执行的时候，需要先生成对象，然后 next 进行下一步。这样做起来还是比较麻烦，能不能不需要执行器啊？于是 async 函数就应运而生了。

async 函数 es7 stage-3 的特性，可惜差一点就进入到 es7 规范了。async 函数里使用 await 可以做到和 yield 类似的效果，但 await 只能接 promise 对象。


**重点介绍promise**

使用`bluebird`替代原生的，`cnpm install bluebird`，
只需添加一行代码：`var Promise = require('bluebird')`

一个 Promise 必须处在其中之一的状态：pending, fulfilled 或 rejected.

- pending: 初始状态, 非 fulfilled 或 rejected.
- fulfilled: 完成（成功）的操作.
- rejected: 拒绝（失败）的操作.

Promise 的最大优势是标准，各类异步工具库都认同，未来的 async/await 也基于它，用它封装 API 通用性强，用起来简单。

Promise 表示一个异步操作的最终结果。与 Promise 最主要的交互方法是通过将函数传入它的 then 方法从而获取得 Promise 最终的值或 Promise 最终最拒绝（reject）的原因。

- 递归，每个异步操作返回的都是 promise 对象
- 状态机：三种状态转换，只在 promise 对象内部可以控制，外部不能改变状态
- 全局异常处理

```js
var promise = new Promise(function(resolve, reject) {
  // do a thing, possibly async, then…

  if (/* everything turned out fine */) {
    resolve("Stuff worked!");
  }
  else {
    reject(Error("It broke"));
  }
});
```

*一个读取文件的实例*

使用普通api实现：

```js
var fs = require('fs')

fs.readFile('./c2.js',(error,data)=>{
  if (error){
    console.log(error.stack)

  }else{
    console.log(data.toString())
  }
})
```

使用promise实现：

```js
var fs = require('fs')

function hello(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (error, data) => {
      if (error) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  })
}

hello('c2.js').then((data) => {
  console.log(data.toString())

}).catch((error) => {
  console.log(error.stack)
})
```

> Promise 核心：将 callback 里的结果延后到 then 函数里处理或交给全局异常处理


- 每个函数的返回值都是 Promise 对象

为了简化编程复杂性，每个函数的返回值都是 Promise 对象，这样的约定可以大大的简化编程的复杂。

它可以理解为是递归的变种思想应用，只要是 Promise 对象，就可以控制状态，就可以支持 then 方法，参数还是 Promise 对象，这样就可以无限个 Promise 对象链接在一起。

实例：

```js
var fs = require('fs')

function hello(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (error, data) => {
      if (error) {
        reject(error)
      } else {
        resolve(data.toString())
      }
    })
  })
}

function log(data) {
  // body...  
  return new Promise((resolve, reject) => {
    console.log('promise result:' + data)
    resolve(data)
  })
}

hello('./c2.js').then(log).then(() => {
  return hello('node.js').then(log)
}).catch((error) => {
  console.log(error.stack)
})
```