sort 包中实现了３种基本的排序算法：插入排序．快排和堆排序．和其他语言中一样，sort 包会根据实际数据自动选择高效的排序算法。


## Go 1.8 新的 slice 排序 API

统一的 slice 排序由新的 `sort.Slice` 函数实现。它允许任意的 slice 都可以被排序，只需提供一个回调比较函数即可，而不是像以前要提供一个特定的`sort.Interface`的实现。这个函数没有返回值。想其它的排序函数一样，它提供了原地的排序。

下面的例子根据海拔高度排序知名山峰的 slice。

```go
type Peak struct {
    Name      string
    Elevation int // in feet
}
peaks := []Peak{
    {"Aconcagua", 22838},
    {"Denali", 20322},
    {"Kilimanjaro", 19341},
    {"Mount Elbrus", 18510},
    {"Mount Everest", 29029},
    {"Mount Kosciuszko", 7310},
    {"Mount Vinson", 16050},
    {"Puncak Jaya", 16024},
}
// does an in-place sort on the peaks slice, with tallest peak first
sort.Slice(peaks, func(i, j int) bool {
    return peaks[i].Elevation >= peaks[j].Elevation
})
// peaks is now sorted
```

通过`sort.Interface`类型的`Len()`和`Swap(i, j int)`提供了抽象的排序类型，这是以前的排序方法，而`Less(i, j int)`作为一个比较回调函数，可以简单地传递给`sort.Slice`进行排序。

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