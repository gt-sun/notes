[TOC]

# 技巧

## Set 和 Map

- 去除数组重复元素

```
> const t = [1,1,1,1,3,4,5,6]
undefined
> [...new Set(t)]
[ 1, 3, 4, 5, 6 ]
```


# 标准库

## 基础类型与引用类型

共有 6 种基本数据类型：Undefined、Null、Boolean、Number、String、Symbol (new in ES 6) ！

除过上面的 6 种基本数据类型外，剩下的就是引用类型了，统称为 Object 类型。细分的话，有：Object 类型、Array 类型、Date 类型、RegExp 类型、Function 类型 等。

基本类型值：指的是保存在栈内存中的简单数据段；
引用类型值：指的是那些保存在堆内存中的对象，意思是，变量中保存的实际上只是一个指针，这个指针执行内存中的另一个位置，由该位置保存对象；

*访问方式*

基本类型值：按值访问，操作的是他们实际保存的值；
引用类型值：按引用访问，当查询时，我们需要先从栈中读取内存地址，然后再顺藤摸瓜地找到保存在堆内存中的值；引用类型的值保存在内存中，由于 js 不允许直接访问内存，在操作的时候，其实操作的是对象的引用


*类型复制*

基本类型变量的复制：从一个变量向另一个变量复制时，会在栈中创建一个新值，然后把值复制到为新变量分配的位置上；

引用类型变量的复制：复制的是存储在栈的指针，将指针复制到为新变量分配的位置上，而这个指针副本与原指针执行的是存储在堆中的对象。复制结束后，两个变量指向的是同一个对象，因此操作其中的任何一个将会影响另一个；


*变量类型检测*

- typeof 操作符是检测基本类型的最佳工具;
- instanceof 操作符用于检测引用类型，可以检测它到底是什么类型的实例;

## 原型

[[Prototype]] 引用有什么用呢？当你试图引用对象的属性时会触发[[Get]] 操作，比如 `myObject.a` 。对于默认的 [[Get]] 操作来说，第一步是检查对象本身是否有这个属性，如果有的话就使用它。
但是如果 a 不在 myObject 中，就需要使用对象的 [[Prototype]] 链了。

```js
var anotherObject = {
    a:2
};
// 创建一个关联到 anotherObject 的对象
var myObject = Object.create( anotherObject );
myObject.a; // 2
```

>  Object.create(..) 的原理，现在只需要知道它会创建一个对象并把这个对象的 [[Prototype]] 关联到指定的对象。

思考下面的代码：

```js
var anotherObj = {
    a:2
}

var myObj = Object.create(anotherObj)

console.log(anotherObj.a)
console.log(myObj.a)

console.log(anotherObj.hasOwnProperty('a')) //true
console.log(myObj.hasOwnProperty('a')) //false

myObj.a++

console.log(anotherObj.a) //2
console.log(myObj.a) //3
```

尽管 `myObject.a++` 看起来应该（通过委托）查找并增加 `anotherObject.a `属性，但是别忘
了 `++` 操作相当于 `myObject.a = myObject.a + 1` 。因此 `++` 操作首先会通过 [[Prototype]]
查找属性 `a` 并从 `anotherObject.a` 获取当前属性值 2，然后给这个值加 1，接着用 [[Put]]
将值 3 赋给 myObject 中新建的屏蔽属性 `a` ，天呐！
修改委托属性时一定要小心。如果想让 `anotherObject.a` 的值增加，唯一的办法是
`anotherObject.a++` 。


*继承*意味着复制操作，JavaScript（默认）并不会复制对象属性。相反，JavaScript 会在两个对象之间创建一个关联，这样一个对象就可以通过委托访问另一个对象的属性和函数。*委托*这个术语可以更加准确地描述 JavaScript 中对象的关联机制。


首先，你可能会认为 ES6 的 class 语法是向 JavaScript 中引入了一种新的“类”机制，其实不是这样。 class 基本上只是现有 [[Prototype]] （委托！）机制的一种语法糖。
也就是说， class 并不会像传统面向类的语言一样在声明时静态复制所有行为。如果你
（有意或无意）修改或者替换了父“类”中的一个方法，那子“类”和所有实例都会受到
影响，因为它们在定义时并没有进行复制，只是使用基于 [[Prototype]] 的实时委托。
例子：

```js
class C{
    constructor(){
        this.num = Math.random()
    }

    rand(){
        console.log("Random: " + this.num)
    }
}

var c1 = new C()
c1.rand() //Random: 0.4566235787611743

C.prototype.rand = function(){
    console.log("Random: " + Math.round(this.num * 1000))
}

var c2 = new C()
c2.rand() //Random: 11
c1.rand() //Random: 457  也扩大了1000倍
```





## 对象

原始值 "I am a string" 并不是一个对象，它只是一个字面量，并且是一个不可变的值。
如果要在这个字面量上执行一些操作，比如获取长度、访问其中某个字符等，那需要将其
转换为 String 对象。
幸好，在必要时语言会自动把字符串字面量转换成一个 String 对象，也就是说你并不需要显式创建一个对象。


对于 Object 、 Array 、 Function 和 RegExp （正则表达式）来说，无论使用文字形式还是构造形式，它们都是对象，不是字面量。

## JSON



每个 JSON 对象，就是一个值。要么是简单类型的值，要么是复合类型的值，但是只能是一个值，不能是两个或更多的值。这就是说，每个 JSON 文档只能包含一个值。

JSON 对值的类型和格式有严格的规定。
>
- 复合类型的值只能是数组或对象，不能是函数、正则表达式对象、日期对象。
- 简单类型的值只有四种：字符串、数值（必须以十进制表示）、布尔值和null（不能使用NaN, Infinity, -Infinity和undefined）。
- 字符串必须使用双引号表示，不能使用单引号。
- 对象的键名必须放在双引号里面。
- 数组或对象最后一个成员的后面，不能加逗号。

# 语法

## 转换


*String()*

使用String函数，可以将任意类型的值转化成字符串。转换规则如下。

（1）原始类型值的转换规则

数值：转为相应的字符串。
字符串：转换后还是原来的值。
布尔值：true转为"true"，false转为"false"。
undefined：转为"undefined"。
null：转为"null"。

```js
String(123) // "123"
String('abc') // "abc"
String(true) // "true"
String(undefined) // "undefined"
String(null) // "null"
```

（2）对象的转换规则

String方法的参数如果是对象，返回一个类型字符串；如果是数组，返回该数组的字符串形式。

```js
String({a: 1}) // "[object Object]"
String([1, 2, 3]) // "1,2,3"
```


*Number()*

Number函数将字符串转为数值，要比parseInt函数严格很多。基本上，只要有一个字符无法转成数值，整个字符串就会被转为`NaN`。

```js
parseInt('42 cats') // 42
Number('42 cats') // NaN
```

简单的规则是，Number方法的参数是对象时，将返回`NaN`，除非是包含单个数值的数值。

```js
Number({a: 1}) // NaN
Number([1, 2, 3]) // NaN
Number([5]) // 5
```


## 数组

JavaScript 使用一个 32 位整数，保存数组的元素个数。这意味着，数组成员最多只有 4294967295 个（232 - 1）个，也就是说length属性的最大值就是 4294967295。

length属性是可写的。如果人为设置一个小于当前成员个数的值，该数组的成员会自动减少到length设置的值。

```js
var arr = [ 'a', 'b', 'c' ];
arr.length // 3

arr.length = 2;
arr // ["a", "b"]
```

**将数组清空的一个有效方法，就是将length属性设为 0。**


## object

对象的生成方法，通常有三种方法。

```js
var o1 = {};
var o2 = new Object();
var o3 = Object.create(Object.prototype);
```

**对象的所有键名都是字符串，所以加不加引号都可以。**
如果键名是数值，会被自动转为字符串。

对象的每一个 “键名” 又称为 “属性”（property），它的 “键值” 可以是任何数据类型。如果一个属性的值为函数，通常把这个属性称为 “方法”，它可以像函数那样调用。

```js
var o = {
  p: function (x) {
    return 2 * x;
  }
};

o.p(1)
// 2
```

对象的属性之间用逗号分隔，最后一个属性后面可以加逗号（trailing comma），也可以不加。

*表达式还是语句？*

对象采用大括号表示，这导致了一个问题：如果行首是一个大括号，它到底是表达式还是语句？

```
{ foo: 123 }
```

JavaScript 引擎读到上面这行代码，会发现可能有两种含义。第一种可能是，这是一个表达式，表示一个包含foo属性的对象；第二种可能是，这是一个语句，表示一个代码区块，里面有一个标签foo，指向表达式123。

为了避免这种歧义，JavaScript 规定，如果行首是大括号，一律解释为语句（即代码块）。如果要解释为表达式（即对象），必须在大括号前加上圆括号。

```
({ foo: 123})
```

这种差异在eval语句中反映得最明显。

```js
eval('{foo: 123}') // 123
eval('({foo: 123})') // {foo: 123}
```

上面代码中，如果没有圆括号，eval将其理解为一个代码块；加上圆括号以后，就理解成一个对象。

*查看所有属性*

查看一个对象本身的所有属性，可以使用`Object.keys`方法。

```js
var o = {
  key1: 1,
  key2: 2
};

Object.keys(o);
// ['key1', 'key2']
```


## string

如果长字符串必须分成多行，可以在每一行的尾部使用反斜杠。

```js
var longString = "Long \
long \
long \
string";

longString
// "Long long long string"
```


字符串可以被视为字符数组，因此可以使用数组的方括号运算符，用来返回某个位置的字符（位置编号从 0 开始）。

```js
var s = 'hello';
s[0] // "h"
s[1] // "e"
s[4] // "o"

// 直接对字符串使用方括号运算符
'hello'[1] // "e"
```


字符串无法直接使用数组的方法，必须通过call方法间接使用。

```js
var s = 'hello';

s.join(' ') // TypeError: s.join is not a function

Array.prototype.join.call(s, ' ') // "h e l l o"
```




## number

所有数字都是以 64 位浮点数形式储存，即使整数也是如此。所以，1与1.0是相同的，是同一个数。

## 布尔值

转换规则是除了下面六个值被转为false，其他值都视为true。

undefined
null
false
0
NaN
""或''（空字符串）

需要特别注意的是，空数组（[]）和空对象（{}）对应的布尔值，都是true。

## undefined 和 null, NaN 的区别


`undefined` 判断的是变量的类型，而其他两个判断是变量的值。
`undefined` 可以用来表示以下的状况：
1. 表示一个未声明的变量，
2. 已声明但没有赋值的变量，
3. 一个并不存在的对象属性

`null` 是一种特殊的 object , 表示空值，即该处的值现在为空。
`NaN` 是 JavaScript 的特殊值，表示 “非数字”（Not a Number），主要出现在将字符串解析成数字出错的场合。`NaN`不等于任何值，包括它本身。

比较符 (== 或 ===)
使用 `==` ，如果两边的类型不同, js 引擎会先把它们转成相同的类型在进行值的比较；
使用 `===`， 则不会进行类型转换，类型不同，肯定不相等。  

```js
> var j
undefined
> j == undefined
true
> j === undefined
true
> j == null
true
> j === null
false
> typeof(j)
'undefined'


> var k = null
undefined
> k == undefined
true
> k === undefined
false
> k == null
true
> k === null
true
> typeof(k)
'object'


> var u = ''
undefined
> u == undefined
false
> u === undefined
false
> u == null
false
> u === null
false
> typeof(u)
'string'
```

