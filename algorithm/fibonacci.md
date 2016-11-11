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
