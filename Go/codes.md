
## 数组去重去空

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


## 统计字符串长度

可以通过代码 `len([]int32(s))` 来获得字符串中字符的数量，但使用 `utf8.RuneCountInString(s)` 效率会更高一点。

```go
s := "abcd"
l := utf8.RuneCountInString(s)
```


## 关闭文件操作

如果你在一个 for 循环内部处理一系列文件，你需要使用 defer 确保文件在处理完毕后被关闭，例如：

```go
for _, file := range files {
    if f, err = os.Open(file); err != nil {
        return
    }
    // 这是错误的方式，当循环结束时文件没有关闭
    defer f.Close()
    // 对文件进行操作
    f.Process(data)
}
```

但是在循环结尾处的 defer 没有执行，所以文件一直没有关闭！垃圾回收机制可能会自动关闭文件，但是这会产生一个错误，更好的做法是：

```go
for _, file := range files {
    if f, err = os.Open(file); err != nil {
        return
    }
    // 对文件进行操作
    f.Process(data)
    // 关闭文件
    f.Close()
 }
```

defer 仅在函数返回时才会执行


## 频繁修改字符串

当需要对一个字符串进行频繁的操作时，谨记在 go 语言中字符串是不可变的（类似 java 和 c#）。使用诸如`a += b`形式连接字符串效率低下，尤其在一个循环内部使用这种形式。这会导致大量的内存开销和拷贝。应该使用一个字符数组代替字符串，将字符串内容写入一个缓存中。例如以下的代码示例：

```go
var b bytes.Buffer
...
for condition {
    b.WriteString(str) // 将字符串str写入缓存buffer
}
    return b.String()
```

注意：由于编译优化和依赖于使用缓存操作的字符串大小，当循环次数大于 15 时，效率才会更佳。


## 修改字符串中的某个字符

Go 语言中的字符串是不可变的，也就是说 str[index] 这样的表达式是不可以被放在等号左侧的。如果尝试运行 str[i] = 'D' 会得到错误：cannot assign to str[i]。

因此，您必须先将字符串转换成字节数组，然后再通过修改数组中的元素值来达到修改字符串的目的，最后将字节数组转换回字符串格式。

例如，将字符串 "hello" 转换为 "cello"：

```go
s := "hello"
c := []byte(s)
c[0] = ’c’
s2 := string(c) // s2 == "cello"
```

## 数据类型转换

### `byte` 与 `string` 转换

```
b := []byte{'a', 'b', 'c'}
s := string(b[:])


s := "abcd"
b := []byte(s)

//使用copy()
s := "abcd"
var b [4]byte
copy(b[:], s)
```


### string 转换其他

- float

```
        strconv.ParseFloat()
```

- int

```
        strconv.ParseInt()
```

- bool 

```
        strconv.ParseBool()
```


### int 转换其他

- string

```
        // 通过Itoa方法转换  
        str1 := strconv.Itoa(i)  
        // 通过Sprintf方法转换  
        str2 := fmt.Sprintf("%d", i)  
        // 通过FormatInt转换
        str3 = strconv.FormatInt()
```

- float

```
        float(i)
```

- bool 

```
        bool(i)
```

### float 转换其他

- string

```
        // 通过Itoa方法转换  
        str1 := strconv.Itof(f)  
        // 通过Sprintf方法转换  
        str2 := fmt.Sprintf("%f", f)  
        // 通过FormatInt转换
        str3 = strconv.FormatFloat()
```

- int

```
        int(i)
```

- bool 

```
        bool(i)
```

### bool 转换其他

- string

```
        // 通过Sprintf方法转换  
        str2 := fmt.Sprintf("%d", b)  
        // 通过FormatInt转换
        str3 = strconv.FormatBool()
```

- int

```
        int(i)
```

- float 

```
        float(i)
```

### 单独说下byte

- byte转换string

```
    string(byte)
```

- byte转换int、bool、float

使用encoding/binary包做转换

- int、bool、float转换byte

使用encoding/binary包做转换

### interface转为string

```go
func interface2string(inter interface{}) string {
    tempStr := ""
    switch inter.(type) {
    case string:
        tempStr = inter.(string)
        break
    case float64:
        tempStr = strconv.FormatFloat(inter.(float64), 'f', -1, 64)
        break
    case int64:
        tempStr = strconv.FormatInt(inter.(int64), 10)
        break
    case int:
        tempStr = strconv.Itoa(inter.(int))
        break
    }
    return tempStr
}
```