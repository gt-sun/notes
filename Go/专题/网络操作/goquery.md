[TOC]

https://github.com/PuerkitoBio/goquery





实例：

```go
import (
    "fmt"
    "github.com/PuerkitoBio/goquery"
    "io"
    "net/http"
    "os"
)
 
func main() {
    x, _ := goquery.NewDocument("http://www.fengyun5.com/Sibao/600/1.html")
    urls, _ := x.Find("#content img").Attr("src")
    res, _ := http.Get(urls)
    file, _ := os.Create("xxx.jpg")
    io.Copy(file, res.Body)
    fmt.Println("下载完成！")
}
```