
[TOC]


# net

## Socket 编程

```
//监听
listener,err := net.Listen("tcp","127.0.0.1:8080") 

//等待请求
conn,err := listener.Accept()

//conn的Read方法
var buf bytes.Buffer
b := make([]byte,10)
for {
    n,err := conn.Read(b)
    if err != nil{
        if err == io.EOF{
            print("conn is closed!")
            conn.Close()
        }else {
            print("errer!")
        }
        break
    }
    buf.Write(b[:n])
}

//以上read简单粗暴，下面是带消息边界的读取
r := bufio.NewReader(conn)
line,err := r.ReadBytes('\n')
```

## 实例


### 实现 HEAD 方法

```go
package main

import (
    "bytes"
    "fmt"
    "io"
    "net"
    "os"
)

func checkError(err error) {
    if err != nil {
        fmt.Fprintf(os.Stderr, "Fatal error: %s", err.Error())
        os.Exit(1)
    }
}

func main() {
    if len(os.Args) != 2 {
        fmt.Fprintf(os.Stderr, "Usage : %s host:port", os.Args[0])
        os.Exit(1)
    }

    service := os.Args[1]
    conn, err := net.Dial("tcp", service)
    checkError(err)

    _, err = conn.Write([]byte("HEAD / HTTP/1.0\r\n\r\n"))
    checkError(err)
    result, err := readFully(conn)
    checkError(err)

    fmt.Println(string(result))
    os.Exit(0)
}

func readFully(conn net.Conn) ([]byte, error) {
    defer conn.Close()

    result := bytes.NewBuffer(nil)
    var buf [512]byte
    for {

        n, err := conn.Read(buf[:])
        result.Write(buf[0:n])
        if err != nil {
            if err == io.EOF {
                break
            }
            return nil, err
        }
    }
    return result.Bytes(), nil
}

```

### 下载一个网页

```go
func main() {
    var (
        host          = "www.apache.org"
        port          = "80"
        remote        = host + ":" + port
        msg    string = "GET / \n"
        data          = make([]byte, 4096)
        read          = true
        count         = 0
    )
    // 创建一个socket
    con, err := net.Dial("tcp", remote)
    // 发送我们的消息，一个http GET请求
    io.WriteString(con, msg)
    // 读取服务器的响应
    for read {
        count, err = con.Read(data)
        read = (err == nil)
        fmt.Printf(string(data[0:count]))
    }
    con.Close()
}
```

### `C/S`的模型

*最简单的*

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

*版本2*

server.go

```go
package main

import (
    "fmt"
    "log"
    "net"
    "os"
    "strings"
)

var mapUser map[string]int

func main() {
    var (
        conn     net.Conn
        listener net.Listener
        err      error
    )
    mapUser = make(map[string]int)
    fmt.Println("Start server...")
    listener, err = net.Listen("tcp", "127.0.0.1:9000")
    checker(err)

    for {
        conn, err = listener.Accept()
        checker(err)
        go do(conn)
    }

}

func do(conn net.Conn) {
    var buf []byte
    var err error
    for {
        buf = make([]byte, 512)
        _, err = conn.Read(buf)
        checker(err)
        input := string(buf)
        ix := strings.Index(input, "says")
        clientName := input[0 : ix-1]
        mapUser[clientName] = 1
        if strings.Contains(input, "SH") {
            fmt.Println("关闭Server！")
            os.Exit(0)
        }

        if strings.Contains(input, "WHO") {
            displayList()
        }
        fmt.Printf("Recived from %s : %s\n", clientName, input)
    }
}

func displayList() {
    fmt.Println("This is client list:")
    for k, v := range mapUser {
        fmt.Printf("No:%d, client is %s\n", v, k)
    }
}

func checker(err error) {
    if err != nil {
        log.Fatal(err)
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

var (
    conn        net.Conn
    err         error
    inputReader *bufio.Reader
    clientName  string
    input       string
)

func main() {
    fmt.Println("Start connecting server")
    conn, err = net.Dial("tcp", "127.0.0.1:9000")
    checker(err)

    inputReader = bufio.NewReader(os.Stdin)
    fmt.Println("First input your name __")
    clientName, _ = inputReader.ReadString('\n')
    trimmedclient := strings.Trim(clientName, "\r\n")

    for {
        fmt.Println("Send to server. Q for Quit. SH to shutdown server")
        input, _ = inputReader.ReadString('\n')
        trimmedInput := strings.Trim(input, "\r\n")
        if trimmedInput == "Q" {
            return
        }
        _, err = conn.Write([]byte(trimmedclient + " says :" + trimmedInput))
        checker(err)
    }

}

func checker(err error) {
    if err != nil {
        log.Fatal(err)
    }
}

```


