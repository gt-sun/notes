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