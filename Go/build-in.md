


## 1.9 type-alias

`type T1 = T2`

它们是完全相同的，只是拼写上的差异。下面这些都是一样的：

- `*T1` and `*T2`
- `chan T1` and `chan T2`
- `func(T1)` and `func(T2)`
- `interface{M() T1 }` and `interface{ M() T2 }`

Since T1 is just another way to write T2, it does not have its own set of method declarations.

The language specification already defines `byte` as an alias for `uint8` and similarly `rune` as an alias for `int32`, 

而类型声明：`type Tnamed Tunderlying`.

That declaration defines a new type Tnamed, different from (not identical to) Tunderlying. Because Tnamed is different from all other types, notably Tunderlying, composite types built from Tnamed and Tunderlying are different. For example, these pairs are all different types:

- `*Tnamed` and `*Tunderlying`
- `chan Tnamed` and `chan Tunderlying`
- `func(Tnamed)` and `func(Tunderlying)`
- `interface{M() Tnamed }` and `interface{ M() Tunderlying }`

## append

- 将元素添加到切片
```go
var b []string
b = append(b, "S", "s")

var c [][]string
c = append(c, []string{"a"}, []string{"b"})
```
- 将切片 b 的元素追加到切片 a 之后：`a = append(a, b...)`
- 删除位于索引 i 的元素：`a = append(a[:i], a[i+1:]...)`
- 切除切片 a 中从索引 i 至 j 位置的元素：`a = append(a[:i], a[j:]...)`
- 为切片 a 扩展 j 个元素长度：`a = append(a, make([]T, j)...)`
- 在索引 i 的位置插入元素 x：`a = append(a[:i], append([]T{x}, a[i:]...)...)`
- 在索引 i 的位置插入长度为 j 的新切片：`a = append(a[:i], append(make([]T, j), a[- i:]...)...)`
- 在索引 i 的位置插入切片 b 的所有元素：`a = append(a[:i], append(b, a[i:]...)...)`
- 取出位于切片 a 最末尾的元素 x：`x, a = a[len(a)-1], a[:len(a)-1]`

## copy

```
slice1 := []int{1, 2, 3, 4, 5} 
slice2 := []int{5, 4, 3} 

copy(slice2, slice1) // 只会复制slice1的前3个元素到slice2中 
copy(slice1, slice2) // 只会复制slice2的3个元素到slice1的前3个位置
```

使用`copy`连接字符串效率最高

```go
func main() {
    s := make([]byte, 5)
    copy(s[:], "abcd")
    copy(s[4:], `e`)
    fmt.Println(string(s))
}
```

