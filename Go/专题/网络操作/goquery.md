[TOC]

https://github.com/PuerkitoBio/goquery


## 笔记

goquery exposes two structs, `Document` and `Selection`, and the `Matcher` interface.

## 【博文】[GoQuery](http://blog.studygolang.com/2015/04/go-jquery-goquery/)

**goquery 提供的主要类型和方法**

*Document*

`Document` 代表一个将要被操作的 HTML 文档，不过，和 jQuery 不同，它装载的是 DOM 文档的一部分。

```go
type Document struct {
    *Selection
    Url *url.URL
    rootNode *html.Node // 文档的根节点
}
```

因为 `Document` 中内嵌了一个 `Selection` 类型，因此，`Document` 可以直接使用 `Selection` 类型的方法。

有五种方法获取一个 `Document` 实例，分别是从一个 URL 创建、从一个 *html.Node 创建、从一个 io.Reader 创建、从一个 *http.Response 创建和从一个已有的 Document Clone 一个。

*Selection*

`Selection` 代表符合特定条件的节点集合。

```go
type Selection struct {
    Nodes []*html.Node
    document *Document
    prevSel *Selection
}
```

一般地，得到了 `Document` 实例后，通过 `Dcoument.Find` 方法获取一个 `Selection` 实例，然后像 jQuery 一样使用链式语法和方法操作它。

`Selection` 类型提供的方法可以分为如下几大类（注意，3 个点 (…) 表示有重载的方法）：

1）类似函数的位置操作

- Eq()
- First()
- Get()
- Index…()
- Last()
- Slice()

2）扩大 Selection 集合（增加选择的节点）

- Add…()
- AndSelf()
- Union(), which is an alias for AddSelection()

3）过滤方法，减少节点集合

- End()
- Filter…()
- Has…()
- Intersection(), which is an alias of FilterSelection()
- Not…()

4）循环遍历选择的节点

- Each()
- EachWithBreak()
- Map()

5）修改文档

- After…()
- Append…()
- Before…()
- Clone()
- Empty()
- Prepend…()
- Remove…()
- ReplaceWith…()
- Unwrap()
- Wrap…()
- WrapAll…()
- WrapInner…()

6）检测或获取节点属性值

- Attr(), RemoveAttr(), SetAttr()
- AddClass(), HasClass(), RemoveClass(), ToggleClass()
- Html()
- Length()
- Size(), which is an alias for Length()
- Text()

7）查询或显示一个节点的身份

- Contains()
- Is…()

8）在文档树之间来回跳转（常用的查找节点方法）

- Children…()
- Contents()
- Find…()
- Next…()
- Parent[s]…()
- Prev…()
- Siblings…()

*Matcher 接口*

该接口定义了一些方法，用于匹配 HTML 节点和编译过的选择器字符串。Cascadia’s Selector 实现了该接口。

```go
type Matcher interface {
    Match(*html.Node) bool
    MatchAll(*html.Node) []*html.Node
    Filter([]*html.Node) []*html.Node
}
```


## 实例

### `Each`和`EachWithBreak`的使用

- 获取帖子的标题

```go
func main() {
    doc, err := goquery.NewDocument("http://studygolang.com/topics")
    if err != nil {
        log.Fatal(err)
    }
    doc.Find(".topics .topic").Each(func(i int, s *goquery.Selection) {
        title := s.Find(".title a").Text()
        fmt.Printf("第%d个帖子：%s\n", i+1, title)
    })
}
```

- `EachWithBreak`的使用

如果标题包含“2016”就终止。

```go
func main() {
    doc, err := goquery.NewDocument("http://studygolang.com/topics")
    if err != nil {
        log.Fatal(err)
    }
    doc.Find(".topics .topic").EachWithBreak(func(i int, s *goquery.Selection) bool {
        title := s.Find(".title a").Text()
        fmt.Printf("第%d个帖子：%s\n", i+1, title)
        if strings.Contains(title, "2016") {
            return false
        }
        return true
    })
}
```

- 倒着遍历

`Each` 遍历是按照页面节点的顺序的。如果我们希望反着处理，也就是先处理页面最底下的节点。查看文档，发现没有直接提供这样的方法。那么该怎么实现呢？

```go
func main() {
    doc, _ := goquery.NewDocument("http://studygolang.com/topics")
    topicsSelection := doc.Find(".topics .topic")

    for i := topicsSelection.Length() - 1; i > 0; i-- {
        topicNode := topicsSelection.Get(i)
        title := goquery.NewDocumentFromNode(topicNode).Find(".title a").Text()
        fmt.Printf("第%d个帖子是：%s\n", i, title)
    }
}
```

### 不使用`Each`，进行全部遍历

- 打印所有的`td`标签

```go
func ExampleScrape() {
    doc, err := goquery.NewDocument("http://www.kuaidaili.com/free/")
    if err != nil {
        log.Fatal(err)
    }

    sel := doc.Find("td")
    for i := range sel.Nodes {
        fmt.Printf("%s\n", sel.Eq(i).Text())
    }
}
func main() {
    ExampleScrape()
}
```

### 其他实例

- 使用`Each() + Eq()`循环遍历指定部分

```go
func PrintProxy(url string) {
    g, e := goquery.NewDocument(url)
    if e != nil {
        fmt.Println(e)
    }
    g.Find("tr").Each(func(i int, s *goquery.Selection) {
        if i > 0 && i < 3 {
            node := s.Find("td")
            IP := node.Eq(0)
            Port := node.Eq(1)
            fmt.Printf("%v:%v\n", IP.Text(), Port.Text())
        }

    })
}
```

- 使用`Eq(index int)`来选取指定部分

```go
func main() {
    g, e := goquery.NewDocument("http://gold.3g.cnfol.com/")
    if e != nil {
        fmt.Println(e)
    }
    c := g.Find("ul")
    s := c.Eq(6).Find("a") //查找所有的ul，只在第6个ul内部操作。
    s.Each(func(i int, content *goquery.Selection) {
        a, _ := content.Attr("href")
        fmt.Println(a)
    })
}
```

- 下载图片

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

- Github 的例子

```go
func ExampleScrape() {
  doc, err := goquery.NewDocument("http://metalsucks.net") 
  if err != nil {
    log.Fatal(err)
  }

  // Find the review items
  doc.Find(".sidebar-reviews article .content-block").Each(func(i int, s *goquery.Selection) {
    // For each item found, get the band and title
    band := s.Find("a").Text()
    title := s.Find("i").Text()
    fmt.Printf("Review %d: %s - %s\n", i, band, title)
  })
}

func main() {
  ExampleScrape()
}
```
