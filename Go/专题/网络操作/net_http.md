[TOC]


链接：http://www.open-open.com/lib/view/open1473146369515.html

http 并发：http://www.open-open.com/lib/view/open1466247930321.html

http client 设置连接超时： http://www.open-open.com/lib/view/open1464080880528.html

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

### 使用http.NewServerMux()

```go
func server() {
    mux := http.NewServeMux()
    mux.Handle("/", http.HandlerFunc(func(w http.ResponseWriter, h *http.Request) {
        fmt.Println("server: received request")
        time.Sleep(time.Second)
        io.WriteString(w, "Finished\n")
        fmt.Println("server: request finished~")
    }))

    srv := &http.Server{Addr: ":8000", Handler: mux}

    if err := srv.ListenAndServe(); err != nil {
        fmt.Printf("Listen on :%s\n", err)
    }
}
```

### 实现静态文件服务器，类似python的`python -m SimpleHTTP`

from: https://github.com/Unknwon/go-web-foundation/blob/master/lectures/lecture2/code/02_Go_HTTP/main_v2.go

```go
package main

import (
    "io"
    "log"
    "net/http"
    "os"
)

type myHandler struct {
}

func (*myHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    io.WriteString(w, "My server:"+r.URL.String())
}

func main() {
    mux := http.NewServeMux()
    mux.Handle("/", &myHandler{})
    mux.HandleFunc("/bye", sayBye)

    //实现静态文件
    wd, err := os.Getwd()
    if err != nil {
        log.Fatal(err)
    }
    mux.Handle("/file/", http.StripPrefix("/file/", http.FileServer(http.Dir(wd))))

    err = http.ListenAndServe(":9000", mux)
    if err != nil {
        log.Fatal(err)
    }

}

func sayBye(w http.ResponseWriter, r *http.Request) {
    io.WriteString(w, "Bye!")
}

```


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

### 解析json网页

```go
package main

import (
    "encoding/json"
    "fmt"
    "io/ioutil"
    "log"
    "net/http"
)

// var url = "http://192.168.200.4/api/v4/groups"

var url = "http://192.168.200.4/api/v4/groups/38/projects"

type Result struct {
    Id   int
    Name string
}

func main() {
    client := &http.Client{}
    req, _ := http.NewRequest("GET", url, nil)
    req.Header.Set("PRIVATE-TOKEN", "fbA_ez5PVv3-C_WEtCJB")
    res, err := client.Do(req)
    if err != nil {
        log.Fatal(err)
    }
    defer res.Body.Close()

    body, err := ioutil.ReadAll(res.Body)
    if err != nil {
        log.Fatal(err)
    }
    var results []Result
    err = json.Unmarshal(body, &results)
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("%+v", results)
    fmt.Println("=================")
    for _, v := range results {
        fmt.Println(v.Id, v.Name)
    }

    fmt.Printf("总共有：%d个项目\n", len(results))
}
```