# http子包

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