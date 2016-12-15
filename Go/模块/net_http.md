[TOC]

go 为所有的 HTTP 状态码定义了常量，比如：

```
http.StatusContinue     = 100
http.StatusOK           = 200
http.StatusFound        = 302
http.StatusBadRequest       = 400
http.StatusUnauthorized     = 401
http.StatusForbidden        = 403
http.StatusNotFound     = 404
http.StatusInternalServerError  = 500
```

## Tips

### 错误信息处理，避免到处都是`err != nil`

```go
func httpRequestHandler(w http.ResponseWriter, req *http.Request) {
    err := func () error {
        if req.Method != "GET" {
            return errors.New("expected GET")
        }
        if input := parseInput(req); input != "command" {
            return errors.New("malformed command")
        }
        // 可以在此进行其他的错误检测
    } ()

        if err != nil {
            w.WriteHeader(400)
            io.WriteString(w, err)
            return
        }
        doSomething() ...
```

### 设置头信息

比如在网页应用发送 html 字符串的时候，在输出之前执行`w.Header().Set("Content-Type", "text/html")`。

## 实例

### 简单的POST表单网页

```go
package main

import (
    "io"
    "log"
    "net/http"
)

const form = `
    <html>
    <body>
    <form action="#" method="post" name="bar">
        <input type="text" name="in">
        <input type="submit" value="submit">

    </form>

    </body>
    </html>
`

func main() {
    http.HandleFunc("/test1", Simple)
    http.HandleFunc("/test2", FormServer)

    if err := http.ListenAndServe("127.0.0.1:9000", nil); err != nil {
        log.Fatal(err)
    }

}

func Simple(w http.ResponseWriter, r *http.Request) {
    io.WriteString(w, "<h1>Hello~</h1>")

}

func FormServer(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "text/html")
    switch r.Method {
    case "GET":
        io.WriteString(w, form)
    case "POST":
        io.WriteString(w, r.FormValue("in"))
    }
}

```


### 检查网站状态

```go
func main() {
    var urls = []string{
        "http://www.qq.com",
        "http://www.baidu.com",
        "http://www.taobao.com",
        "http://www.yy.com",
        "http://y.qq.com",
        "http://86links.com",
    }

    for _, url := range urls {
        resp, err := http.Head(url)
        if err != nil {
            log.Fatal(err)
        }

        fmt.Println(url, ":", resp.Status)
    }
}
```

### *最简单的httpserver*

```go
import (
    "fmt"
    "io"
    "log"
    "net/http"
)

func main() {
    http.HandleFunc("/sun", HelloServer)
    err := http.ListenAndServe("127.0.0.1:9000", nil)
    if err != nil {
        log.Fatal(err)
    }
}

func HelloServer(w http.ResponseWriter, req *http.Request) {
    fmt.Println("Inside HelloServer func")
    io.WriteString(w, "Hello! "+req.URL.Path[:])
}
```

### 最简单的下载网页

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