

使用channel：最基础版

```go
package main

import "fmt"

func main() {
  c := make(chan int)
  go foo(c)
  for i := 0; i < 5; i++ {
    fmt.Println("in main:", <-c)
  }

  fmt.Println("boring!")
}

func foo(c chan int) {
  for j := 0; ; j++ {
    c <- j
  }
}
```


使用channel：作为值传递

```go
package main

import "fmt"

func main() {
    c := foo()
    for i := 0; i < 5; i++ {
        fmt.Println("Recilved from channel:", <-c)
    }
    fmt.Println("Exit!")
}

func foo() <-chan int {
    c := make(chan int)
    go func() {
        for i := 0; ; i++ {
            c <- i
        }
    }()
    return c

}
```


使用channel：fan-in模式，合并输出

```go
package main

import (
    "fmt"
    "math/rand"
    "time"
)

func main() {
    c := fanin(foo("Tim"), foo("Sun"))
    for i := 0; i < 5; i++ {
        fmt.Println("Recilved from channel:", <-c)

    }
    fmt.Println("Exit!")
}

func fanin(t1, t2 <-chan string) <-chan string {
    c := make(chan string)
    go func() {
        for {
            c <- <-t1
        }
    }()
    go func() {
        for {
            c <- <-t2
        }
    }()
    return c
}

func foo(s string) <-chan string {
    c := make(chan string)
    go func() {
        for i := 0; ; i++ {
            c <- s
            time.Sleep(time.Duration(rand.Intn(1e3)) * time.Millisecond)
        }
    }()
    return c

}
```

使用channel：结合结构体存储队列

```go
package main

import (
    "fmt"
    "math/rand"
    "time"
)

type Msg struct {
    str  string
    wait chan bool
}

func main() {
    c := fanIn(boring("Tim"), boring("Sun"))

    for i := 0; i < 10; i++ {
        msg1 := <-c
        fmt.Println(msg1.str)
        msg2 := <-c
        fmt.Println(msg2.str)
        msg1.wait <- true
        msg2.wait <- true
    }
    fmt.Println("Exit")
}

func boring(s string) <-chan Msg {
    c := make(chan Msg)
    waitForIt := make(chan bool)
    go func() {
        for i := 0; ; i++ {
            c <- Msg{s, waitForIt}
            time.Sleep(time.Duration(rand.Intn(1e3)) * time.Millisecond)
            <-waitForIt
        }
    }()
    return c
}

func fanIn(input1, input2 <-chan Msg) <-chan Msg {
    c := make(chan Msg)
    go func() {
        for {
            c <- <-input1
        }
    }()
    go func() {
        for {
            c <- <-input2
        }
    }()
    return c
}
```

使用channel：select

配合select，使用单个goroutine

```go
func fanin(t1, t2 <-chan string) <-chan string {
    c := make(chan string)
    go func() {
        for {
            select {
            case s := <-t1:
                c <- s
            case s := <-t2:
                c <- s
            }
        }
    }()
    return c
}
```