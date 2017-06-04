



- 递归与尾递归

*一般递归*

```py
def normal_recursion(n):
    if n == 1:
        return 1
    else:
        return n + normal_recursion(n-1)

执行：
normal_recursion(5)
5 + normal_recursion(4)
5 + 4 + normal_recursion(3)
5 + 4 + 3 + normal_recursion(2)
5 + 4 + 3 + 2 + normal_recursion(1)
5 + 4 + 3 + 2 + 1
15
```

一般递归的效率是比较低的，因为在return n + normal_recursion(n-1)时需要 调用栈保存中间变量n的值，递归进行的越深入，需要调用的栈就越多，效率也就越低。

*尾递归*

如果可以将中间变量作为参数直接传递给递归调用函数，那么可以大大提高递归效率，这就是尾递归的实现：

```py
def tail_recursion(n, total=0):
    if n == 0:
        return total
    else:
        return tail_recursion(n-1, total+n)
执行：

tail_recursion(5)
tail_recursion(4, 5)
tail_recursion(3, 9)
tail_recursion(2, 12)
tail_recursion(1, 14)
tail_recursion(0, 15)
15
```


- 通过缓存之前的值提升性能

```go
package main

import (
    "fmt"
    // "log"
    // "runtime"
    // "strings"
    "time"
)

const (
    LTM = 70
)

var fibs [LTM]uint64

func main() {
    var result uint64 = 0
    start := time.Now()
    for i := 0; i < LTM; i++ {
        result = fib(i)
        fmt.Printf("fib(%d) is : %d\n", i, result)
    }
    end := time.Now()
    delta := end.Sub(start)
    fmt.Println("耗时：", delta)

}

func fib(n int) (res uint64) {
    if fibs[n] != 0 {
        res = fibs[n]
        return
    }
    if n <= 1 {
        res = 1
    } else {
        res = fib(n-1) + fib(n-2)
    }
    fibs[n] = res
    return
}

```
