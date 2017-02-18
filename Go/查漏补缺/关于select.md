[TOC]

---

## select

- 每个 case 都必须是一个通信；
- (重点)在系统开始执行select时，会先对所有的case中的表达式和通道表达式进行求值；
- 如果任意某个通信可以进行，它就执行；其他被忽略。
- 如果有多个 case 都可以运行，Select 会随机公平地选出一个执行。其他不会执行。否则：
    - 如果有 default 子句，则执行该语句。
    - 如果没有 default 字句，select 将阻塞，直到某个通信可以运行；Go 不会重新对 channel 或值进行求值。
- default 语句是可选的；fallthrough 是不允许的。在任何一个 case 中执行 break 或者 return，select 就结束了。

select 是 Go 中的一个控制结构，类似于用于通信的 switch 语句。每个 case 必须是一个通信操作，要么是发送要么是接收。一个默认的子句应该总是可运行的。

```go
func main() {

  c1, c2 := make(chan string), make(chan string)

  go func() {
    time.Sleep(1e9)
    c1 <- "c1 is ok now"
  }()

  go func() {
    time.Sleep(2 * 1e9)
    c2 <- "c2 is ok now"
  }()
  for i := 0; i < 2; i++ {
    select {
    case r1 := <-c1:
      fmt.Println("received c1", r1)
    case r2 := <-c2:
      fmt.Println("receiver c2", r2)
    }
  }

}

```


## 应用

### *select 实现timeout机制*

```go
func main() {

  timeout := make(chan bool, 1)
  go func() {
    time.Sleep(1e9)
    timeout <- true
  }()
  c := make(chan int, 1)
  // c <- 3
  select {
  case <-c:
    fmt.Println("c1")
  case <-timeout:
    fmt.Println("timeout")
  }

}
```

使用`time.After`

```go
func main() {
  c := make(chan int, 1)
  go func() {
    time.Sleep(2 * 1e9)
    c <- 1
  }()

  select {
  case x := <-c:
    fmt.Println(x)
  case <-time.After(1e9):
    fmt.Println("TimeOut!")
  }
}
```

### *select 检测缓存chan是否已经满了*

```go
func main() {

  c := make(chan int, 1)
  c <- 1

  select {
  case c <- 2:
  default:
    fmt.Println("is full")
  }

}
```


### 其他

select 语句实现了一种监听模式，通常用在（无限）循环中；在某种情况下，通过 break 语句使循环退出。

例子：

```go
func main() {
  c1 := make(chan int)
  c2 := make(chan int)

  go pump1(c1)
  go pump2(c2)

  suck(c1, c2)

  // time.Sleep(1e9)
}

func pump1(c1 chan int) {
  for i := 0; ; i++ {
    c1 <- i
  }
}

func pump2(c2 chan int) {
  for i := 0; ; i++ {
    c2 <- i * 10
  }
}

func suck(c1, c2 chan int) {
  for i := 0; i < 10; i++ {
    select {
    case x := <-c1:
      fmt.Println("c1::", x)
    case x := <-c2:
      fmt.Println("c2: ", x)
    }
  }
}
```

例子2：

使用一个额外的通道传递给协程，然后在结束的时候随便放点什么进去。main() 线程检查是否有数据发送给了这个通道，如果有就停止。

```go
func tel(ch chan int, quit chan bool) {
  for i:=0; i < 15; i++ {
    ch <- i
  }
  quit <- true
}

func main() {
  var ok = true
  ch := make(chan int)
  quit := make(chan bool)

  go tel(ch, quit)
  for ok {
    select {
      case i:= <-ch:  //会先从ch取值，因为quit在此之前都是false
        fmt.Printf("The counter is at %d\n", i)
      case <-quit:
        os.Exit(0)
    }
  }
}
```