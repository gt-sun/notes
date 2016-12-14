
[TOC]


# net

先看一个`C/S`的模型

server.go

```go
package main

import (
    "fmt"
    "log"
    "net"
)

func main() {
    fmt.Println("Starting server...")
    listener, err := net.Listen("tcp", "127.0.0.1:9000")
    if err != nil {
        log.Fatal(err)
    }

    for {
        conn, err := listener.Accept()
        if err != nil {
            log.Fatal(err)
        }
        go do(conn)
    }

}

func do(conn net.Conn) {
    for {
        buf := make([]byte, 512)
        len, err := conn.Read(buf)
        if err != nil {
            log.Fatal(err)
        }
        fmt.Printf("Received data :%v\n", string(buf[:len]))

    }
}
```

client.go

```go
package main

import (
    "bufio"
    "fmt"
    "log"
    "net"
    "os"
    "strings"
)

func main() {
    conn, err := net.Dial("tcp", "127.0.0.1:9000")
    if err != nil {
        log.Fatal(err)
    }
    inputer := bufio.NewReader(os.Stdin)
    fmt.Println("What is your name?")
    clientname, _ := inputer.ReadString('\n')
    trimmedclient := strings.Trim(clientname, "\r\n")

    for {
        fmt.Println("Type Q for quit")
        input, _ := inputer.ReadString('\n')
        trimmedinput := strings.Trim(input, "\r\n")
        if trimmedinput == "Q" {
            return
        }
        _, err = conn.Write([]byte(trimmedclient + "says:" + trimmedinput))
    }
}

```



## http子包

链接：http://www.open-open.com/lib/view/open1473146369515.html

http 并发：http://www.open-open.com/lib/view/open1466247930321.html

http client 设置连接超时： http://www.open-open.com/lib/view/open1464080880528.html

*简单的爬虫*

```go
import (
    "fmt"
    "io/ioutil"
    "net/http"
)

func main() {
    resp, err := http.Get("https://www.itjuzi.com/invstdeal")
    if err != nil {
        fmt.Println("http get error.")
    }
    defer resp.Body.Close()
    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        fmt.Println("http read error")
        return
    }

    src := string(body)
    fmt.Println(src)
}
```