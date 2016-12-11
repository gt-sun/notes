## `Json`子包

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


