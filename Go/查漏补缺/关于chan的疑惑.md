[TOC]

---


**没有缓存和缓存为1的区别**

`ch := make(chan interface{})` 和 `ch := make(chan interface{},1)`是不一样的

无缓冲的 不仅仅是只能向 ch 通道放 一个值 而是一直要有人接收，那么ch <- elem才会继续下去，要不然就一直阻塞着，也就是说有接收者才去放，没有接收者就阻塞。

而缓冲为1则即使没有接收者也不会阻塞，因为缓冲大小是1只有当 放第二个值的时候 第一个还没被人拿走，这时候才会阻塞

## 使用说明

- 特点
 
    - 在同一时刻，仅有一个Goroutine能向一个通道发送数据，也仅有一个Goroutine能从通道接收数据。
    - 最早被发送至通道的值会最早被接收，相当于一个FIFO先进先出的队列。
    - 不应该在接收端关闭通道；在发送端关闭通道不会对已发送的值产生影响；
    - 通道中元素的值具有不变形，如下：
```go
type Person struct {
    Name    string
    Age     int
    Address Addr
}

type Addr struct {
    city     string
    district string
}

func main() {
    c := make(chan Person, 1)
    p := Person{"sun", 12, Addr{"beijng", "haidiam"}}
    c <- p
    p.Address.city = "tianjin"
    fmt.Println(<-c) //{sun 12 {beijng haidiam}}
}
```

- 类型转换

`<-chan int(v)` 和 `(<-chan int)(v)`

前者：将v转换为chan int 类型并且取出值，等价于`<-(chan int(v))`
后者：将v转换为取出类型的chan int

- [sync.Mutex VS channel VS WaitGroup ](https://github.com/golang/go/wiki/MutexOrChannel)

- [channel需要关闭吗](http://stackoverflow.com/questions/8593645/is-it-ok-to-leave-a-channel-open)


It's OK to leave a Go channel open forever and never close it. When the channel is no longer used, it will be garbage collected.

Note that it is only necessary to close a channel if the receiver is looking for a close. Closing the channel is a control signal on the channel indicating that no more data follows.

## 对Goroutine的解释

**证明并发性**

```go
func main() {
    name := "Sun"
    go func() {
        print("hello,", name)
    }()
    name = "QQ"
    time.Sleep(1e2)
}
```

**使用for-range + go语句属于同步的范畴**

输出顺序一致

```go
func main() {
    names := []string{"A", "B", "C", "D"}
    for _, name := range names {
        go func(n string) {
            print(n)
        }(name)
        runtime.Gosched() // 保证获得执行机会
    }
}
```

**同步channel使用for-range**

注意：必须要有close

```go
func main() {
    var c = make(chan int)
    var done = make(chan bool)

    go func() {
        for i := range c {
            fmt.Println(i)
        }
        fmt.Println("revr done")
        done <- true
    }()

    c <- 1
    c <- 2
    c <- 3
    close(c)

    <-done
    fmt.Println("send done!")

}
```


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


总结一下 channel 关闭后 sender 的 receiver 操作。
如果 channel c 已经被关闭, 继续往它发送数据会导致panic: `send on closed channel`:

```go
import "time"
func main() {
    go func() {
        time.Sleep(time.Hour)
    }()
    c := make(chan int, 10)
    c <- 1
    c <- 2
    close(c)
    c <- 3
}
```

但是从这个关闭的 channel 中不但可以读取出已发送的数据，还可以不断的读取零值:

```go
c := make(chan int, 10)
c <- 1
c <- 2
close(c)
fmt.Println(<-c) //1
fmt.Println(<-c) //2
fmt.Println(<-c) //0
fmt.Println(<-c) //0
```

但是如果通过range读取，channel 关闭后 for 循环会跳出：

```go
c := make(chan int, 10)
c <- 1
c <- 2
close(c)
for i := range c {
    fmt.Println(i)
}
```

## 重新理解



**同步阻塞(较少使用)**


```go
func main() {
    c := make(chan int)
    go func() { //1
        time.Sleep(1e8) //2
        fmt.Println(<-c) //4
    }()
    c <- 10 //2 阻塞，等待4
}

//两处2 都有可能先执行到，但不影响。

-----

//可能有输出，可能无输出。主函数没有阻塞后，会立即结束。
func main() {
    c := make(chan int)
    go func() { 
        fmt.Println(<-c) //1
        time.Sleep(1e9) //永远不会执行到。·
    }()
    c <- 10 //2
}


//肯定有输出
func main() {
    c := make(chan int)
    go func() {
        c <- 1
    }()

    fmt.Println(<-c)
}
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

// 报错。发送导致阻塞，执行不到<-c
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
    for v := range ch { //同步chan配合close，可以使用for-range
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
package main

import "fmt"

func main() {
    chanSlice := make([]chan int, 10)

    for i := 0; i < len(chanSlice); i++ {
        chanSlice[i] = make(chan int, 1)
        go foo(chanSlice[i])
    }

    for i, value := range chanSlice {
        fmt.Println(i, " : ", <-value)
    }
    fmt.Println("Done~~")
}

func foo(c chan int) {
    tmp := 0
    for u := 0; u < 1000000; u++ {
        tmp += u
    }
    c <- tmp
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


## time包与channel

### time.NewTimer定时器 和 time.After

```go
t := time.NewTimer(1e9)
<-t.C
print("Done")
```

等价：

```go
<-time.After(1e9)
```