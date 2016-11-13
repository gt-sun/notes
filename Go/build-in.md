


## append

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

