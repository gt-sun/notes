[TOC]

---

## 对chan使用`for-range`的场景

*代码1*

http://stackoverflow.com/questions/12398359/throw-all-goroutines-are-asleep-deadlock

这里是不带缓存的同步chan，需手动close。


```go
package main

import "fmt"

func main() {
    var ch = make(chan int)
    var rch = make(chan int)

    go do(ch, rch)

    ch <- 1
    ch <- 3
    close(ch)

    fmt.Println(<-rch)
}

func do(ch chan int, rch chan int) {
    res := 0
    for v := range ch { //用在同步chan，等同于取值
        res += v
    }

    rch <- res
}

```

*代码2*

这里是带缓存的异步chan，此处不能使用`for-range`。

问题：如何不使用`for`循环实现？

```go
func main() {
  runtime.GOMAXPROCS(runtime.NumCPU())
  c := make(chan bool, 10)
  for i := 0; i < 10; i++ {
    go Go(c, i)
  }
  for i := 0; i < 10; i++ { //如何不使用`for`循环实现？
    <-c
  }
}

func Go(c chan bool, index int) {
  a := 0
  for i := 0; i < 10000000; i++ {
    a += i
  }
  fmt.Println(index, a)

  c <- true
}
```