


- 学习 this 的第一步是明白 this 不指向函数自身也不指向函数的词法作用域，你也许被这样的解释误导过，但其实它们都是错误的。this 实际上是在函数被调用时发生的绑定，它指向什么完全取决于函数在哪里被调用。

*困惑*

```js
function foo(num) {
    console.log('foo: ' + num)
    this.count += 1
}

foo.count = 0

var a
for (a = 0; a < 10; a += 1) {
    if (a > 5) {
        foo(a)
    }
}

console.log(foo.count) //0   为何是0？？

```

执行 `foo.count = 0` 时，的确向函数对象 foo 添加了一个属性 count 。但是函数内部代码
`this.count` 中的 this 并不是指向那个函数对象，所以虽然属性名相同，根对象却并不相
同，困惑随之产生。

其实无意中创建了一个全局变量 count。


*回避法：不用this*

```js
function foo(num) {
    console.log('foo: ' + num)
    foo.count += 1
}

foo.count = 0

var a
for (a = 0; a < 10; a += 1) {
    if (a > 5) {
        foo(a)
    }
}

console.log(foo.count) //4
```


*判断 this*

现在我们可以根据优先级来判断函数在某个调用位置应用的是哪条规则。可以按照下面的
顺序来进行判断：

1. 函数是否在 new 中调用（ new 绑定）？如果是的话 this 绑定的是新创建的对象。
var bar = new foo()
2. 函数是否通过 call 、 apply （显式绑定）或者硬绑定调用？如果是的话， this 绑定的是
指定的对象。
var bar = foo.call(obj2)
3. 函数是否在某个上下文对象中调用（隐式绑定）？如果是的话， this 绑定的是那个上
下文对象。
var bar = obj1.foo()
4. 如果都不是的话，使用默认绑定。如果在严格模式下，就绑定到 undefined ，否则绑定到
全局对象。
var bar = foo()


*箭头函数*

箭头函数不使用 this 的四种标准规则，而是根据外层（函数或者全局）作用域来决
定 this 。

```js
function foo(){
    return (a)=>{
        //this继承自foo()
        console.log(this.a)
    }
}


var obj2 = {
    a:2
}

var obj3 = {
    a:3
}

var bar = foo.call(obj2)
bar.call(obj3) //2 不是3！
```

foo() 内部创建的箭头函数会捕获调用时 foo() 的 this 。由于 foo() 的 this 绑定到 obj1 ，
bar （引用箭头函数）的 this 也会绑定到 obj1 ，箭头函数的绑定无法被修改。（ new 也不
行！）

## call apply bind

它们的第一个参数是一个对象，它们会把这个对象绑定到this ，接着在调用函数时指定这个 this 。因为你可以直接指定 this 的绑定对象，因此我们称之为显式绑定。

```js
var foo = {
    value: 1
};

function bar() {
    console.log(this.value);
}

bar.call(foo); // 1
```

注意两点：

1. call 改变了 this 的指向，指向到 foo
2. bar 函数执行了


```js
//带参数
var obj = {
    value:22
}

function foo(name,age){
    console.log(name)
    console.log(age)
    console.log(this.value)
}

foo.call(obj,'Tim',28)
```


通过 `foo.call(..)` ，我们可以在调用 foo 时强制把它的 this 绑定到 obj 上。apply()方法效果一样，只是传参为Arrar-like，见下：

```js
var obj = {
    value:22
}


var arr = ['Tim',28]

function foo(name,age){
    console.log(name)
    console.log(age)
    console.log(this.value)
}

// foo.call(obj,arr)
foo.apply(obj,arr)
```


由于硬绑定是一种非常常用的模式，所以在 ES5 中提供了内置的方法 `Function.prototype.bind` ，一句话介绍 bind:

> bind() 方法会创建一个新函数。当这个新函数被调用时，bind() 的第一个参数将作为它运行时的 this, 之后的一序列参数将会在传递的实参前传入作为它的参数。(来自于 MDN)


它的用法如下：

```js
var obj = {
    value:22
}

function foo(name,age){
    console.log(name)
    console.log(age)
    console.log(this.value)
}

var bar = foo.bind(obj,'Tim',28)
bar()
```

bind(..) 会返回一个硬编码的新函数，它会把参数设置为 this 的上下文并调用原始函数。

还可以在执行返回的函数的时候，再传另一个参数，如下：

```js
var obj = {
    value:22
}

function foo(name,age){
    console.log(name)
    console.log(age)
    console.log(this.value)
}

var bar = foo.bind(obj,'Tim')
bar(28)
```


