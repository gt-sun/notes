sort 包中实现了３种基本的排序算法：插入排序．快排和堆排序．和其他语言中一样，sort 包会根据实际数据自动选择高效的排序算法。


## 自定义排序

按照字符串的长度排序

```go
package main

import (
    "fmt"
    "sort"
)

type Bylength []string

func (s Bylength) Len() int {
    return len(s)
}

func (s Bylength) Less(i, j int) bool {
    return len(s[i]) < len(s[j])
}

func (s Bylength) Swap(i, j int) {
    s[i], s[j] = s[j], s[i]
}

func main() {
    str := []string{"abc", "a", "trfd"}
    sort.Sort(Bylength(str))
    fmt.Println(str)
}

```

## `Sort.Ints` `Sort.Strings`

```go
func main() {
    a := []int{2, 1, 3, 65, 34}
    sort.Ints(a)
    fmt.Println(a)
    fmt.Println(sort.IntsAreSorted(a))

    b := []string{"g", "a", "c", "s"}
    sort.Strings(b)
    fmt.Println(b)
    fmt.Println(sort.StringsAreSorted(b))

}
```

类似的，可以使用函数 `func Float64s(a []float64)` 来排序 float64。

## `Search`

想要在数组或切片中搜索一个元素，该数组或切片必须先被升序排序（因为标准库的搜索算法使用的是二分法）。然后，您就可以使用函数 `func SearchInts(a []int, n int) int` 进行搜索，并返回对应结果的索引值。

当然，还可以搜索 float64 和字符串：

`func SearchFloat64s(a []float64, x float64) int`
`func SearchStrings(a []string, x string) int`