[TOC]



## Defer 函数调用参数的求值

被defer的函数的参数会在defer声明时求值（而不是在函数实际执行时）。

```
package main
import "fmt"
func main() {  
    var i int = 1
    defer fmt.Println("result =>",func() int { return i * 2 }())
    i++
    //prints: result => 2 (not ok if you expected 4)
}
```


## 看看几个例子

例 1：

```go
func f() (result int) {
    defer func() {
        result++
    }()
    return 0
}
```

例 2：

```go
func f() (r int) {
     t := 5
     defer func() {
       t = t + 5
     }()
     return t
}
```

例 3：

```go
func f() (r int) {
    defer func(r int) {
          r = r + 5
    }(r)
    return 1
}
```


要使用 defer 时不踩坑，最重要的一点就是要明白， **return xxx 这一条语句并不是一条原子指令!**

其实使用 defer 时，用一个简单的转换规则改写一下，就不会迷糊了。改写规则是将 return 语句拆成两句写，return xxx 会被改写成:

```
返回值 = xxx
调用defer函数
空的return
```


先看例 1，它可以改写成这样：

```go
func f() (result int) {
     result = 0  //return语句不是一条原子调用，return xxx其实是赋值＋ret指令
     func() { //defer被插入到return之前执行，也就是赋返回值和ret指令之间
         result++
     }()
     return
}
```

所以这个返回值是 1。
再看例 2，它可以改写成这样：

```go
func f() (r int) {
     t := 5
     r = t //赋值指令
     func() {        //defer被插入到赋值与返回之间执行，这个例子中返回值r没被修改过
         t = t + 5
     }
     return        //空的return指令
}
```

所以这个的结果是 5。

最后看例 3，它改写后变成：

```go
func f() (r int) {
     r = 1  //给返回值赋值
     func(r int) {        //这里改的r是传值传进去的r，不会改变要返回的那个r值
          r = r + 5
     }(r)
     return        //空的return
}
```

所以这个例子的结果是 1。


defer 确实是在 return 之前调用的。但表现形式上却可能不像。本质原因是 return xxx 语句并不是一条原子指令，defer 被插入到了赋值 与 ret 之间，因此可能有机会改变最终的返回值。