[TOC]

---


## 使用说明

### [channel需要关闭吗](http://stackoverflow.com/questions/8593645/is-it-ok-to-leave-a-channel-open)


It's OK to leave a Go channel open forever and never close it. When the channel is no longer used, it will be garbage collected.

Note that it is only necessary to close a channel if the receiver is looking for a close. Closing the channel is a control signal on the channel indicating that no more data follows.

## 判断channel是否关闭

下面代码会死循环：

```go
func main() {
    c := make(chan int, 10)
    c <- 1
    c <- 2
    c <- 3
    close(c)

    for {
        fmt.Println(<-c)
    }
}
```

判断chan是否关闭：

```go
func main() {
    c := make(chan int, 10)
    c <- 1
    c <- 2
    c <- 3
    close(c)

    for {
        if v, ok := <-c; ok {
            fmt.Println(v)
        } else {
            fmt.Println("Closed!")
            break
        }
    }
}
```


## 重新理解



**同步阻塞(较少使用)**

以下代码是错的！！！

```go
func main() {
    c := make(chan int)
    go func() {
        fmt.Println(<-c)
    }()
    c <- 10
}

//如果接收先执行，则没有输出；可以想象成取出还在很久后，main()是不会等待的，所以同步chan需先进行取出语句。
//如果取出先执行，则正常输出；因为goroutine需等待main()函数结束才结束，所以会等到接收到值。
```

我们知道，send 被执行前,通讯一直被阻塞着。无缓存的 channel 只有在 receiver 准备好后 send 才被执行。所以类似上面的代码可以修改为：

```go
//总的思路：发送语句放在goroutine里，main()函数进行取出。
func main() {
    c := make(chan int)
    go func() {
        for i := 0; i < 5; i++ {
            c <- i
        }
        close(c)
    }()
    for {
        if v, ok := <-c; ok {
            fmt.Println(v)
        } else {
            break
        }
    }
}
```

---

```go
func main() {
    c := make(chan int)
    c <- 10
    fmt.Println(<-c)

}

// 这是错误的！因为同步chan必须先有取值的需求才可以接收值！改成c := make(chan int, 1)就对了。
```

```go
func main() {
    c := make(chan int)

    fmt.Println(<-c)
    go func() {
        c <- 10
    }()

}

// 这是错误的！因为<-c就阻塞了，不会执行下面的goroutine语句。
```

```go
package main

func main() {
    c := make(chan int)
    go func() {
        c <- 1
    }()
    <-c
}

//先有goroutine 后配合chan使用，<-c取出语句需放在goroutine下面。
```

```go
// 单缓存chan，与无缓存相同，无法实现异步
func main() {
    c := make(chan bool, 1)
    go func() {
        c <- true
    }()

    fmt.Println(<-c)
}
```

**多缓存异步chan(提高性能)**


```go
//多缓存异步运算
func main() {
    c := make(chan int, 3)
    for i := 0; i < 3; i++ {
        go func(i int) {
            c <- i * 10

        }(i)
    }

    for i := 0; i < 3; i++ {
        fmt.Println(<-c)
    }
}
```



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
    for v := range ch { //同步chan可以使用for-range，因为取值会阻塞！
        res += v
    }

    rch <- res
}

```

以下实例使用缓存chan，但是无意义，因为没涉及到异步计算！

```go
package main

import "fmt"

var ch = make(chan int, 3)
var rch = make(chan int)

func main() {
    for i := 0; i < 3; i++ {
        ch <- i
    }

    go do(ch, rch)

    fmt.Println(<-rch)

}

func do(ch chan int, rch chan int) {
    res := 0
    // for v := range ch {
    //  res += v
    // }
    for i := 0; i < 3; i++ {
        res += <-ch
    }
    rch <- res
    close(rch)
}

```

*代码2*

这里是带缓存的异步chan，此处不能使用`for-range`。

问题：为何不能使用`for-range`循环实现？
A：for-range 的对象必须是确定长度的，而这里异步 没法确定chan的长度！

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

下面是利用slice实现的版本，没有利用缓存的容量大小
来循环：

```go
func main() {
    runtime.GOMAXPROCS(runtime.NumCPU())
    cs := make([]chan bool, 10)
    for i := 0; i < 10; i++ {
        cs[i] = make(chan bool, 1)
        go Go(cs[i], i)
    }

    for _, c := range cs {
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

缓存异步chan不能使用`for-range`，因为需要配合close使用，但基本上异步chan没法去close，因为是为了开启它提高性能才使用异步goroutine的，又要关闭它岂不是笑话？！
当然，非要写出这样的代码也是可以的，等于放弃了使用异步：

```go
func main() {
    c := make(chan int, 3)
    c <- 1
    c <- 2
    c <- 3
    close(c)

    for v := range c {
        fmt.Println(v)
    }
}
```