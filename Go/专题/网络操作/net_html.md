[TOC]

---

**Parse**

```go
package main

import (
    "bytes"
    "fmt"
    "io/ioutil"
    "log"
    "net/http"

    "golang.org/x/net/html"
)

const (
    url = "http://www.kuaidaili.com/free/"
)

func DownPages(url string) []byte {
    // var body []byte
    resp, err := http.Get(url)
    check(err)
    defer resp.Body.Close()
    body, err := ioutil.ReadAll(resp.Body)
    check(err)
    return body
}

func ParseData(d []byte) {
    doc, err := html.Parse(bytes.NewReader(d))
    check(err)
    var f func(*html.Node)
    f = func(n *html.Node) {
        if n.Type == html.ElementNode && n.Data == "td" {
            for _, td := range n.Attr {
                if td.Key == `data-title` {
                    fmt.Println(td.Val)
                    break
                }
            }
        }
        for c := n.FirstChild; c != nil; c = c.NextSibling {
            f(c)
        }
    }
    f(doc)
}

func main() {
    data := DownPages(url)
    ParseData(data)

}

func check(err error) {
    if err != nil {
        log.Fatal(err)
    }
}

```