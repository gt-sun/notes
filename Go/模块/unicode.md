## 统计字符串长度

可以通过代码 `len([]int32(s))` 来获得字符串中字符的数量，但使用 `utf8.RuneCountInString(s)` 效率会更高一点。

```go
s := "abcd"
l := utf8.RuneCountInString(s)
```