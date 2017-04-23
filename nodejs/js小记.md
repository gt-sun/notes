

# 技巧

## Set 和 Map

- 去除数组重复元素

```
> const t = [1,1,1,1,3,4,5,6]
undefined
> [...new Set(t)]
[ 1, 3, 4, 5, 6 ]
```


# 语法

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

