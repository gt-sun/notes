
## 数组去重

```go
func removeDuplicatesAndEmpty(a []string) (ret []string) {
    a_len := len(a)
    for i := 0; i < a_len; i++ {
        if (i > 0 && a[i-1] == a[i]) || len(a[i]) == 0 {
            continue
        }
        ret = append(ret, a[i])
    }
    return
}

func main() {
    a := []string{"a", "a", "b"}
    x := removeDuplicatesAndEmpty(a)
    // println(x[:])
    n := len(x)
    for i := 0; i < n; i++ {
        println(x[i])
    }
}
```


## 生成随机数

```go
/**
* size 随机码的位数
* kind 0    // 纯数字
       1    // 小写字母
       2    // 大写字母
       3    // 数字、大小写字母
*/

import (
    "math/rand"
    "time"
)

func krand(size int, kind int) []byte {
    ikind, kinds, result := kind, [][]int{[]int{10, 48}, []int{26, 97}, []int{26, 65}}, make([]byte, size)
    is_all := kind > 2 || kind < 0
    rand.Seed(time.Now().UnixNano())
    for i := 0; i < size; i++ {
        if is_all { // random ikind
            ikind = rand.Intn(3)
        }
        scope, base := kinds[ikind][0], kinds[ikind][1]
        result[i] = uint8(base + rand.Intn(scope))
    }
    return result
}

func main() {
    x := krand(10, 3)
    println(string(x))
}
```