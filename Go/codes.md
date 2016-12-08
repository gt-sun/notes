[TOC]


## 运行外部命令

Go 标准库为我们封装了更好用的包： `os/exec`，运行外部命令，应该优先使用它，它包装了 `os.StartProcess` 函数以便更容易的重定向标准输入和输出，使用管道连接 I/O，以及作其它的一些调整。

*StartProcess* 方法

```go
func main() {
// 1) os.StartProcess //
/*********************/
/* Linux: */
env := os.Environ()
procAttr := &os.ProcAttr{
            Env: env,
            Files: []*os.File{
                os.Stdin,
                os.Stdout,
                os.Stderr,
            },
        }
// 1st example: list files
pid, err := os.StartProcess("/bin/ls", []string{"ls", "-l"}, procAttr)  
if err != nil {
        fmt.Printf("Error %v starting process!", err)  //
        os.Exit(1)
}
fmt.Printf("The process id is %v", pid)
```

*os.Run* 方法

```go
　　func main() {
　　  cmd := exec.Command("/bin/sh", "-c", `ps -eaf|grep "nginx: master"|grep -v "grep"|awk '{print $2}'`)
　　  cmd.Stdout = os.Stdout
　　  cmd.Stderr = os.Stderr
　　  cmd.Start()
　　  cmd.Run()
　　  cmd.Wait()
　　}
```

## 实现一个限速器

在操作数据库的时候，频率太快会把db压垮。

代码1：

from:https://segmentfault.com/a/1190000005944664

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

//LimitRate 限速
type LimitRate struct {
    rate       int //每秒执行多少次任务
    interval   time.Duration
    lastAction time.Time
    lock       sync.Mutex
}

func (l *LimitRate) Limit() bool {
    result := false
    for {
        l.lock.Lock()
        //判断最后一次执行的时间与当前的时间间隔是否大于限速速率
        if time.Now().Sub(l.lastAction) > l.interval {
            l.lastAction = time.Now()
            result = true
        }
        l.lock.Unlock()
        if result {
            return result
        }
        time.Sleep(l.interval)
    }
}

//SetRate 设置Rate
func (l *LimitRate) SetRate(r int) {
    l.rate = r
    l.interval = time.Microsecond * time.Duration(1000*1000/l.rate)
}

//GetRate 获取Rate
func (l *LimitRate) GetRate() int {
    return l.rate
}

//测试
func main() {
    var wg sync.WaitGroup
    var lr LimitRate
    lr.SetRate(3)

    b := time.Now()
    for i := 0; i < 5; i++ {
        wg.Add(1)
        go func() {
            if lr.Limit() {
                fmt.Println("Got it!")
            }
            wg.Done()
        }()
    }
    wg.Wait()
    fmt.Println(time.Since(b))
}

//不足：所有请求只能均匀的到来；Sleep唤醒线程的时间较长；
```

## IO操作

### 检查文件是否存在

```go
if _, err := os.Stat("C:\\tips2.md"); os.IsNotExist(err) {
        fmt.Println("不存在该文件")
    }
```

### 关闭文件操作

如果你在一个 for 循环内部处理一系列文件，你需要使用 defer 确保文件在处理完毕后被关闭，例如：

```go
for _, file := range files {
    if f, err = os.Open(file); err != nil {
        return
    }
    // 这是错误的方式，当循环结束时才会关闭，仅关闭了最后一个file
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

### `io/ioutil`

#### `ioutil.ReadDir` 读取目录

不会读取子目录，按文件夹名排序输出。

```go
func main() {
    files, err := ioutil.ReadDir("C:\\Users\\sun\\Documents\\git\\notes\\Go")
    if err != nil {
        panic(err)
    }

    for _, file := range files {
        fmt.Println(file.Name())
    }
}
```

#### `ioutil.ReadAll` 读取

```go
func main() {
    r := strings.NewReader("Go is a general-purpose language designed with systems programming in mind.")

    b, err := ioutil.ReadAll(r)
    if err != nil {
        log.Fatal(err)
    }

    fmt.Printf("%s", b)
}
```

#### `ioutil.ReadFile`读取文件

```go

// 一下子全部读取
package main

import (
    "fmt"
    "io/ioutil"
)

func main() {
    file := "C:\\Users\\sun\\Documents\\git\\notes\\Go\\codes.md"
    f, err := ioutil.ReadFile(file)  //ReadFile 会先判断文件的大小，给 bytes.Buffer 一个预定义容量，避免额外分配内存。
    if err != nil {
        panic(err)
    }
    fmt.Println(string(f))
}
```

#### `ioutil.WriteFile`写入文件

```go
import "io/ioutil"

func main() {
    // var data byte
    s := "dsf打偶然"
    data := []byte(s)
    err := ioutil.WriteFile("sun2.log", data, 0666)
    if err != nil {
        panic(err)
    }
}
```

### 使用`os`包 新建并写入内容

```go
func main() {
    f, err := os.Create("sun.log")
    if err != nil {
        panic(err)
    }
    f.WriteString("this is sun")
    defer f.Close()
}
```

### 逐行读取/处理文件

```go
//1
func ReadLine(fileName string) error {
    f, err := os.Open(fileName)
    if err != nil {
        return err
    }
    buf := bufio.NewReader(f)
    for {
        line, err := buf.ReadString('\n')
        line = strings.TrimSpace(line)
        // handler(line)
        fmt.Println(line, "okkkk")
        if err != nil {
            if err == io.EOF { //判断是否到了文件结尾
                return nil
            }
            return err
        }
    }
    return nil
}

func main() {
    file := "C:\\tips.md"
    ReadLine(file)

}

//2
func main() {
    file, err := os.Open("C:/tips.md")
    if err != nil {
        panic(err)
    }

    br := bufio.NewReader(file)
    for {
        a, _, c := br.ReadLine()
        if c == io.EOF {
            break
        }
        fmt.Println(string(a), "okkkk")
    }

}

//3 使用Scanner —— 推荐
func main() {
    //读取字符串
    input := "This is The Golang Standard Library.\nWelcome you!"
    scanner := bufio.NewScanner(strings.NewReader(input))
    for scanner.Scan() {
        fmt.Println(scanner.Text())
    }
    if err := scanner.Err(); err != nil {
        fmt.Fprintln(os.Stderr, "reading standard input:", err)
    }
}

func main() {
    // 读取文件
    file, _ := os.Open("C:\\tips.md")
    scanner := bufio.NewScanner(file)
    for scanner.Scan() {
        fmt.Println(scanner.Text())
    }
    if err := scanner.Err(); err != nil {
        fmt.Fprintln(os.Stderr, "reading standard input:", err)
    }
}
```

### `bufio.Scanner`的使用

```go
// 扫描有多少个单词
func main() {
    input := "This is The Golang Standard Library.\nWelcome you!"
    scanner := bufio.NewScanner(strings.NewReader(input))
    scanner.Split(bufio.ScanWords) //没有指定split 则默认是逐行
    count := 0
    for scanner.Scan() {
        count++
    }
    if err := scanner.Err(); err != nil {
        fmt.Println("error")
    }
    fmt.Println(count)  //8
}
```

### 在文件里追加内容

```go
func main() {
    file, err := os.OpenFile("C:\\temp\\01.txt", os.O_WRONLY|os.O_APPEND, 0666)
    if err != nil {
        panic(err)
    }

    _, err = file.Write([]byte("\r\nxxxxx\r\n"))
    if err != nil {
        panic(err)
    }
}
```


## 字符串操作

### 输出这样一句话：This is "studygolang.com" website. 该如何做？

3种方法：

```
fmt.Println(`this is "my home" yes?`)
fmt.Println("this is \"my home\" yes?")
fmt.Println("this is", strconv.Quote("my home"), "yes?")
```

### 分割/连接字符串

Go 里面 `string` 是最基础的类型，是一个只读类型，针对他的每一个操作都会创建一个新的 string。

```go
//使用strings.Fileds
fmt.Printf("%q", strings.Fields("  a b c haha")) //["a" "b" "c" "haha"]

//使用Split
fmt.Println(strings.Split("abchaha", "c"))  //[ab haha]

//SplitAfter 保留分隔符
fmt.Println(strings.SplitAfter("abc,haha,sun", ",")) //[abc, haha, sun]

//Join
fmt.Println(Join([]string{"name=xxx", "age=xx"}, "&"))  // 输出 name=xxx&age=xx
```

### 数组去重去空

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


### 生成随机数

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


### 统计字符串长度

可以通过代码 `len([]int32(s))` 来获得字符串中字符的数量，但使用 `utf8.RuneCountInString(s)` 效率会更高一点。

```go
s := "abcd"
l := utf8.RuneCountInString(s)
```


### 频繁修改字符串

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


如果是少量小文本拼接，用 `+` 就好

如果是大量小文本拼接，用 `strings.Join`

如果是大量大文本拼接，用 `bytes.Buffer`


### 遍历字符串

```go
func main() {
    s := "abc我是"
    for i, n := 0, len(s); i < n; i++ {  // byte 方式
        fmt.Printf("%c", s[i])
    }
    fmt.Println()

    for _, v := range s {  // rune 方式
        fmt.Printf("%c", v)
    }
}

//
abcææ¯
abc我是
```

### 修改字符串中的某个字符

Go 语言中的字符串是不可变的，也就是说 str[index] 这样的表达式是不可以被放在等号左侧的。如果尝试运行 str[i] = 'D' 会得到错误：cannot assign to str[i]。

因此，您必须先将字符串转换成字节数组，然后再通过修改数组中的元素值来达到修改字符串的目的，最后将字节数组转换回字符串格式。

例如，将字符串 "hello" 转换为 "cello"：

```go
s := "hello"
c := []byte(s) //如含有中文，使用rune
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

>Ps：
无论从 []byte 到 string 还是 string 到 []byte，他们的指针地址均不同。说明在类型转换的时候，发生了值拷贝，而 []byte 与 string 并不共享内存。



### string 转换其他

- float

```
        strconv.ParseFloat()
```

- int

```
str := "123"
i, _ := strconv.Atoi(str)
fmt.Println(i)
```

- bool 

```
        strconv.ParseBool()
```


### int 转换其他

- string

```
str1 := strconv.Itoa(i)  
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