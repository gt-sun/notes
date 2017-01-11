

[TOC]

---


## `bytes.Buffer`配合`[]byte`使用

```go
var resbuf bytes.Buffer
for {
    res := make([]byte, 512)
    n, err := outputBuf2.Read(res)
    if err != nil {
        if err == io.EOF {
            break
        } else {
            panic(err)
        }
    }
    if n > 0 {
        resbuf.Write(res[:n])
    }
}
fmt.Println(resbuf.String())
```

## 关于`bytes.Writer`的疑惑

看代码：

```go
var buf bytes.Buffer

func main() {
    cmd := exec.Command("git", "version")
    cmd.Stdout = &buf
    err := cmd.Run()
    if err != nil {
        panic(err)
    }
    fmt.Println(buf.String())

    if _, ok := interface{}(&buf).(io.Writer); ok {
        println("&buf 是一个io.Writer")
    }

    if _, ok := interface{}(buf).(io.Writer); !ok {
        println("buf 不是一个io.Writer")
    }
}
```

打印：

```
go version go1.7.3 windows/amd64

&buf 是一个io.Writer
buf 不是一个io.Writer
```

## 通过 buffer 串联字符串

类似于 Java 的 StringBuilder 类。

在下面的代码段中，我们创建一个 `buffer`，通过 `buffer.WriteString(s)` 方法将字符串 s 追加到后面，最后再通过 `buffer.String()` 方法转换为 string：

```go
func main() {
    var buf bytes.Buffer
    s := "abc天气好"
    buf.WriteString(s)
    buf.WriteString(" 是的呀")
    fmt.Print(buf.String())
}
```

这种实现方式比使用 `+=` 要更节省内存和 CPU，尤其是要串联的字符串数目特别多的时候。