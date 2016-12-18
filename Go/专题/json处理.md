[TOC]


## 内置模块


- 解析json字符串

```go
package main

import (
    "encoding/json"
    "fmt"
    "io"
    "log"
    "strings"
)

func main() {
    const jsonStream = `
        {"Name": "Ed", "Text": "Knock knock."}
        {"Name": "Sam", "Text": "Who's there?"}
        {"Name": "Ed", "Text": "Go fmt."}
        {"Name": "Sam", "Text": "Go fmt who?"}
        {"Name": "Ed", "Text": "Go fmt yourself!"}
    `

    type Message struct {
        Name, Text string
    }

    dec := json.NewDecoder(strings.NewReader(jsonStream))
    var m Message
    for {
        if err := dec.Decode(&m); err == io.EOF {
            break
        } else if err != nil {
            log.Fatal(err)
        }
        fmt.Printf("Name is :%v,Text is :%v\n", m.Name, m.Text)
    }

}
```

- 解析数组形式的json

```go
func main() {
    const jsonStream = `
        [
            {"Name": "Ed", "Text": "Knock knock."},
            {"Name": "Sam", "Text": "Who's there?"},
            {"Name": "Ed", "Text": "Go fmt."},
            {"Name": "Sam", "Text": "Go fmt who?"},
            {"Name": "Ed", "Text": "Go fmt yourself!"}
        ]
    `
    type Message struct {
        Name, Text string
    }
    dec := json.NewDecoder(strings.NewReader(jsonStream))

    // read open bracket
    t, err := dec.Token()
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("%T: %v\n", t, t)

    // while the array contains values
    for dec.More() {
        var m Message
        // decode an array value (Message)
        err := dec.Decode(&m)
        if err != nil {
            log.Fatal(err)
        }

        fmt.Printf("%v: %v\n", m.Name, m.Text)
    }

    // read closing bracket
    t, err = dec.Token()
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("%T: %v\n", t, t)

}
//打印
json.Delim: [
Ed: Knock knock.
Sam: Who's there?
Ed: Go fmt.
Sam: Go fmt who?
Ed: Go fmt yourself!
json.Delim: ]
```

### 把对象to json，`Marshal()`方法

```go

package main

import (
    "encoding/json"
    "fmt"
    "log"
)

type Road struct {
    Name   string
    Number int
}

func main() {
    roads := Road{"通协路", 288}

    b, err := json.Marshal(roads)
    if err != nil {
        log.Fatal(err)
    }

    fmt.Println(string(b))


    // Unmarshal
    fmt.Println("===json to object===")

    b2 := &Road{}
    ch := make(chan string, 1)
    go func(c chan string, str string) {
        c <- str
    }(ch, string(b))

    data := <-ch

    err = json.Unmarshal([]byte(data), &b2)
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println("Unmarshal success")
    fmt.Println(b2.Name, b2.Number)
}

//打印
{"Name":"通协路","Number":288}
===json to object===
Unmarshal success
通协路 288
```



## 第三方包 `go-simplejson`

*实例 - 解析json，提取信息*

```go
package main

import (
    "fmt"
    "strconv"

    "github.com/bitly/go-simplejson"
)

func main() {
    js, err := simplejson.NewJson([]byte(`{
        "test": {
            "string_array": ["asdf", "ghjk", "zxcv"],
            "array": [1, "2", 3],
            "arraywithsubs": [{"subkeyone": 1},
            {"subkeytwo": 2, "subkeythree": 3}],
            "int": 10,
            "float": 5.150,
            "bignum": 9223372036854775807,
            "string": "simplejson",
            "bool": true
        }
    }`))
    if err != nil {
        panic("json format error")
    }
    s, err := js.Get("test").Get("string").String()
    if err != nil {
        fmt.Println("decode error: get int failed!")
        return
    }
    fmt.Println(s)

    // 检查key是否存在
    _, ok := js.CheckGet("missing_key")
    if ok {
        fmt.Println("key missing_key exists")
    } else {
        fmt.Println("key missing_key not exists")
    }

    arr, err := js.Get("test").Get("array").Array()
    if err != nil {
        fmt.Println("decode error: get array failed!")
        return
    }

    for _, v := range arr {
        var iv int
        switch v.(type) {
        case float64:
            iv = int(v.(float64))
            fmt.Println(iv)
        case string:
            iv, _ = strconv.Atoi(v.(string))
            fmt.Println(iv)
        }
    }
}

```