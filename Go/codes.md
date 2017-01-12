[TOC]



## 有关Json和结构体

```go
package main

import (
    "encoding/json"
    "fmt"
    "time"
)

type Dog struct {
    ID     int
    Name   string
    Breed  string
    BornAt time.Time
}

type JsonDog struct {
    ID     int    `json:"id"`
    Name   string `json:"name"`
    Breed  string `json:"breed"`
    BornAt int64  `json:"born_at"`
}

func NewJsonDog(d Dog) JsonDog {
    return JsonDog{
        d.ID,
        d.Name,
        d.Breed,
        d.BornAt.Unix(),
    }
}

func main() {
    d := Dog{1, "dog1", "taidi", time.Now()}
    a, err := json.Marshal(NewJsonDog(d))
    if err != nil {
        panic(err)
    }
    fmt.Println(string(a))
}

```

## golang里面的Walk

```go
import (
    "flag"
    "fmt"
    "os"
    "path/filepath"
)

func visit(path string, f os.FileInfo, err error) error {
    fmt.Printf("Visited: %s\n", path)
    return nil
}

func main() {
    flag.Parse()
    root := flag.Arg(0)
    err := filepath.Walk(root, visit)
    fmt.Printf("filepath.Walk() returned %v\n", err)
}
```

第三方库：

```go
import (
    "fmt"
    "os"

    "github.com/kr/fs"
)

func main() {
    walker := fs.Walk("C:\\tools\\Rolan")
    for walker.Step() {
        if err := walker.Err(); err != nil {
            fmt.Fprintln(os.Stderr, err)
            continue
        }
        fmt.Println(walker.Path())
    }
}
```

## 获取变量的类型

```go
//Using string formatting

func typeof(v interface{}) string {
    return fmt.Sprintf("%T", v)
}


//Using reflect package

func typeof(v interface{}) string {
    return reflect.TypeOf(v).String()
}


//Using type assertions

func typeof(v interface{}) string {
    switch t := v.(type) {
    case int:
        return "int"
    case float64:
        return "float64"
    //... etc
    default:
        _ = t
        return "unknown"
    }
}
```

## 输出到Excel

```go
import (
    "encoding/csv"
    "os"
)

func main() {
    f, err := os.Create("haha2.xls")
    if err != nil {
        panic(err)
    }
    defer f.Close()

    f.WriteString("\xEF\xBB\xBF") // 写入UTF-8 BOM

    w := csv.NewWriter(f)
    w.Write([]string{"编号", "姓名", "年龄"})
    w.Write([]string{"1", "张三", "23"})
    w.Write([]string{"2", "李四", "24"})
    w.Write([]string{"3", "王五", "25"})
    w.Write([]string{"4", "赵六", "26"})
    w.Flush()
}
```


## 计算经纬度之间的距离

```go
func main() {
    lat1 := 29.490295
    lng1 := 106.486654

    lat2 := 29.615467
    lng2 := 106.581515
    fmt.Println(EarthDistance(lat1, lng1, lat2, lng2))
}

// 返回值的单位为米
func EarthDistance(lat1, lng1, lat2, lng2 float64) float64 {
    radius := float64(6371000) // 6378137
    rad := math.Pi / 180.0

    lat1 = lat1 * rad
    lng1 = lng1 * rad
    lat2 = lat2 * rad
    lng2 = lng2 * rad

    theta := lng2 - lng1
    dist := math.Acos(math.Sin(lat1)*math.Sin(lat2) + math.Cos(lat1)*math.Cos(lat2)*math.Cos(theta))

    return dist * radius
}
```

## 发送邮件

```go
func SendToMail(user, password, host, to, subject, body, mailtype string) error {
    hp := strings.Split(host, ":")
    auth := smtp.PlainAuth("", user, password, hp[0])
    var content_type string
    if mailtype == "html" {
        content_type = "Content-Type: text/" + mailtype + "; charset=UTF-8"
    } else {
        content_type = "Content-Type: text/plain" + "; charset=UTF-8"
    }

    msg := []byte("To: " + to + "\r\nFrom: " + user + "\r\nSubject: " + subject + "\r\n" + content_type + "\r\n\r\n" + body)
    send_to := strings.Split(to, ";")
    err := smtp.SendMail(host, auth, user, send_to, msg)
    return err
}

func main() {
    user := "xxxxx@qq.com"
    password := "xxxunx"
    host := "smtp.qq.com:25"
    to := "xxx@qq.com"

    subject := "使用Golang发送邮件"

    body := `
        <html>
        <body>
        <h3>
        "Test send to email"
        </h3>
        </body>
        </html>
        `
    fmt.Println("send email")
    err := SendToMail(user, password, host, to, subject, body, "html")
    if err != nil {
        fmt.Println("Send mail error!")
        fmt.Println(err)
    } else {
        fmt.Println("Send mail success!")
    }

}
```

使用第三方包：

`go get gopkg.in/gomail.v2`

```go
package main

import gomail "gopkg.in/gomail.v2"

func main() {
    m := gomail.NewMessage()
    m.SetHeader("From", "xxx@qq.com")
    m.SetHeader("To", "xx@qq.com", "x@qq.com")
    m.SetAddressHeader("Cc", "xxx@86l.com", "强")
    m.SetHeader("Subject", "Hello!")
    m.SetBody("text/html", "Hello <b>Bob</b> and <i>Cora</i>!")
    m.Attach("02.go") //附件

    d := gomail.NewDialer("smtp.qq.com", 25, "xxx@qq.com", "xxunxxxx")

    if err := d.DialAndSend(m); err != nil {
        panic(err)
    }
}

```

## 生成随机数

- 使用hash数

```go
func createPasswd() string {
    t := time.Now()
    h := md5.New()
    io.WriteString(h, t.String())
    passwd := fmt.Sprintf("%x", h.Sum(nil))
    return passwd
}
```

- 使用`math/rand`

```go
func main() {
    for a := 0; a < 5; a++ {
        i := rand.Intn(506)
        fmt.Println(i) // 执行多次，结果都一样
    }

    fmt.Println("========使用种子=========")

    s1 := rand.NewSource(32)
    r1 := rand.New(s1)
    for a := 0; a < 5; a++ {
        fmt.Println(r1.Intn(100)) // 执行多次，结果都一样
    }

    fmt.Println("=========使用随机种子=========")

    s2 := rand.NewSource(time.Now().Unix())
    r2 := rand.New(s2)
    for a := 0; a < 5; a++ {
        fmt.Println(r2.Intn(100)) // 执行多次，结果不一样
    }
}
```

```go
const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_!@#$%"
const long = len(letters)

func main() {
    fmt.Println(GenString(10))
}

func GenString(n int) string {
    b := make([]byte, n)
    s1 := rand.NewSource(time.Now().UnixNano())
    r1 := rand.New(s1)
    for i := range b {
        b[i] = letters[r1.Intn(long)]
    }
    return string(b)
}
```

## 从控制台输入

*fmt.Scanln*

```go
func main() {
    var firstname, lastname string
    fmt.Println("输入你的名字：")
    fmt.Scanln(&firstname, &lastname) //以空格分割
    fmt.Println("你的名字是：", firstname, lastname)
}
```

*bufio.NewReader*

```go
func main() {
    fmt.Println("请输入你的名字：")
    inputer := bufio.NewReader(os.Stdin)
    name, _ := inputer.ReadString('\n') //读取到'\n'为止
    
    name = strings.Trim(name, "\r\n")
    fmt.Println("你的名字是：", name)
}
```

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

## 序列化

```go
import (
    "encoding/gob"
    "fmt"
    "os"
    "runtime"
)

const file = "/tmp/test.gob"

type User struct {
    Name, Pass string
}

func main(){
    var datato = &User{"Donald","DuckPass"}
    var datafrom = new(User)

    err := Save(file, datato)
    Check(err)
    err = Load(file, datafrom)
    Check(err)
    fmt.Println(datafrom)
}

// Encode via Gob to file
func Save(path string, object interface{}) error {
    file, err := os.Create(path)
    if err == nil {
        encoder := gob.NewEncoder(file)
        encoder.Encode(object)
    }
    file.Close()
    return err
 }

// Decode Gob file
func Load(path string, object interface{}) error {
    file, err := os.Open(path)
    if err == nil {
        decoder := gob.NewDecoder(file)
        err = decoder.Decode(object)
    }
    file.Close()
    return err
}

func Check(e error) {
    if e != nil {
        _, file, line, _ := runtime.Caller(1)
        fmt.Println(line, "\t", file, "\n", e)
        os.Exit(1)
    }
}
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
var a interface{} = 12

func main() {
    b := a.(int)
    print(b) //12
}
```

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