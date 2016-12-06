[TOC]


- time.Duration（时长，耗时）
- time.Time（时间点）
- time.C（放时间点的管道）`Time.C:=make(chan time.Time)`

time 包里有 2 个东西，一个是时间点，另一个是时长
时间点的意思就是 “某一刻”，比如 2000 年 1 月 1 日 1 点 1 分 1 秒 那一刻（后台记录的是 unix 时间，从 1970 年开始计算）
时长就是某一刻与另一刻的差，也就是耗时


## 时区，`time.LoadLocation()`

```go
func main() {
    t, _ := time.LoadLocation("")  //默认UTC
    fmt.Println(time.Now().In(t))

    t2, _ := time.LoadLocation("Local")  //使用机器本地的
    fmt.Println(time.Now().In(t2))

    t3, _ := time.LoadLocation("America/Los_Angeles")  //指定时区
    fmt.Println(time.Now().In(t3))
}

//2016-12-06 11:42:51.0490205 +0000 UTC
//2016-12-06 19:42:51.0490205 +0800 CST
//2016-12-06 03:42:51.0655643 -0800 PST
```

## 格式化

- 月：01 或 Jan 都可以
- 小时：03 表示 12 小时制，15 表示 24 小时制。
- 时差：是 -07 ，不是 07, 后边可以增加 “00” 或 “:00”，表示更进一步的分秒时差。
- 上下午：使用 PM，不是 AM。
- 摆放顺序：随意，甚至重复都可以。源代码包也有定义的常用的摆放方式供使用。

```go
func main() {
    formate := "2006-01-02 15:04:05"  //这里的时间不能改
    now := time.Now()

    t, _ := time.LoadLocation("Asia/Shanghai")
    fmt.Println(now.In(t).Format(formate))
}
```

## 时间初始化

时间初始化
除了最常用的 time.Now，go 还提供了通过 unix 标准时间、字符串两种方式来初始化：

```
//通过字符串，默认UTC时区初始化Time
func Parse(layout, value string) (Time, error) 
//通过字符串，指定时区来初始化Time
func ParseInLocation(layout, value string, loc *Location) (Time, error) 

//通过unix 标准时间初始化Time
func Unix(sec int64, nsec int64) Time
```

时间初始化的时候，一定要注意原始输入值的时区。正好手里有一个变量，洛杉矶当地时间 `“2016-11-28 19:36:25”`，unix 时间精确到秒为 `1480390585` 。将其解析出来的代码如下：

```go
local, _ := time.LoadLocation("America/Los_Angeles")
timeFormat := "2006-01-02 15:04:05"

time1 := time.Unix(1480390585, 0)   //通过unix标准时间的秒，纳秒设置时间
time2, _ := time.ParseInLocation(timeFormat, "2016-11-28 19:36:25", local)

fmt.Println(time1.In(local).Format(timeFormat))
fmt.Println(time2.In(local).Format(timeFormat))

chinaLocal, _ := time.LoadLocation("Local")//运行时，该服务器必须设置为中国时区，否则最好是采用"Asia/Chongqing"之类具体的参数。

fmt.Println(time2.In(chinaLocal).Format(timeFormat))

//output:
//2016-11-28 19:36:25
//2016-11-28 19:36:25
//2016-11-29 11:36:25
```

当然，如果输入值是字符串，且带有时区

> “2016-12-04 15:39:06 +0800 CST”

则不需要采用 `ParseInLocation` 方法，直接使用 `Parse` 即可。

## Timer 相关函数或方法的使用

### `time.After`

意思是多少时间之后，但在取出管道内容前不阻塞。

```go
//1
func main() {
    println("the 1")
    tc := time.After(3 * time.Second)
    println("the 2")
    println("the 3")
    <-tc
    println("the 4")
}

//
the 1
the 2
the 3
(waitting 3 Sec...)
the 4


//2
func main() {
    println("the 1")
    tc := time.After(3 * time.Second)
    println("the 2")
    time.Sleep(4 * time.Second)
    <-tc // 这里不会等待，因为上面4 大于 3
    println("the 4")
}
```

```go
// 模拟超时
c := make(chan int)

go func() {
    // time.Sleep(1 * time.Second)
    time.Sleep(3 * time.Second)
    <-c
}()

select {
case c <- 1:
    fmt.Println("channel...")
case <-time.After(2 * time.Second):
    close(c)
    fmt.Println("timeout...")
}
```

### AfterFunc 

和 After 差不多，意思是多少时间之后在 goroutine line 执行函数

```go
f := func() {
    fmt.Println("Time out")
}
time.AfterFunc(1*time.Second, f)
time.Sleep(2 * time.Second) //要保证主线比子线“死的晚”，否则主线死了，子线也等于死了
//【结果】运行了1秒后，打印出timeout，又过了1秒，程序退出
//将一个间隔和一个函数给AfterFunc后
//间隔时间过后，执行传入的函数
```

后悔的话，需要使用 Stop 命令来停止即将开始的执行，如果已经开始执行就来不及了，如下：

```go
houhui := true
f := func() {
    fmt.Println("Time out")
}
ta := time.AfterFunc(2*time.Second, f)
time.Sleep(time.Second)
if houhui {
    ta.Stop()
}
time.Sleep(3 * time.Second)    //要保证主线比子线“死的晚”，否则主线死了，子线也等于死了
//【结果】运行了3秒多一点点后，程序退出，什么都不打印
//注册了个f函数，打算2秒后执行
//过了1秒后，后悔了，停掉（Stop）它
```


`time.Stop` 停止定时器 或 `time.Reset` 重置定时器

```go
start := time.Now()
timer := time.AfterFunc(2*time.Second, func() {
    fmt.Println("after func callback, elaspe:", time.Now().Sub(start))
})

time.Sleep(1 * time.Second)
// time.Sleep(3*time.Second)
// Reset 在 Timer 还未触发时返回 true；触发了或Stop了，返回false
if timer.Reset(3 * time.Second) {
    fmt.Println("timer has not trigger!")
} else {
    fmt.Println("timer had expired or stop!")
}

time.Sleep(10 * time.Second)

// output:
// timer has not trigger!
// after func callback, elaspe: 4.00026461s
```

如果定时器还未触发，Stop 会将其移除，并返回 true；否则返回 false；后续再对该 Timer 调用 Stop，直接返回 false。

Reset 会先调用 stopTimer 再调用 startTimer，类似于废弃之前的定时器，重新启动一个定时器。返回值和 Stop 一样。


## Tick 

和 After 差不多，意思是每隔多少时间后，其他与 After 一致

```go
fmt.Println("the 1")
tc:=time.Tick(time.Second) //返回一个time.C这个管道，1秒(time.Second)后会在此管道中放入一个时间点，
                        //1秒后再放一个，一直反复，时间点记录的是放入管道那一刻的时间
for i:=1;i<=2;i++{
    <-tc
    fmt.Println("hello")
}
//每隔1秒，打印一个hello
```

## time.Time的方法

### Befor 和 After

```go
func main() {
    t1 := time.Now()
    time.Sleep(time.Second)
    t2 := time.Now()
    a := t2.After(t1)
    b := t2.Before(t1)
    println(a) //true
    println(b) //false
}
```

### Sub 方法

```go
func main() {
    t1 := time.Now()
    time.Sleep(time.Second)
    t2 := time.Now()
    sub := t2.Sub(t1)
    println(sub.Seconds())
}
```

### Add 方法

```go
func main() {
    t1 := time.Now()
    t2 := t1.Add(time.Hour)
    println(t2.Hour())
}
```

## time.Parse 方法

```go
func main() {
    t, err := time.Parse(time.UnixDate, "Sat Mar  7 11:06:39 PST 2015") //默认是这种格式
    if err != nil {
        panic(err)
    }
    fmt.Println("default format:", t) //default format: 2015-03-07 11:06:39 +0000 PST
    // 跟time.Now()格式一致

    fmt.Println("Unix format:", t.Format(time.UnixDate)) //Unix format: Sat Mar  7 11:06:3
}
```

## 待研究代码

```go
package main
import (
    "fmt"
    "time"
)

var week time.Duration
func main() {
    t := time.Now()
    fmt.Println(t) // e.g. Wed Dec 21 09:52:14 +0100 RST 2011
    fmt.Printf("%02d.%02d.%4d\n", t.Day(), t.Month(), t.Year())
    // 21.12.2011
    t = time.Now().UTC()
    fmt.Println(t) // Wed Dec 21 08:52:14 +0000 UTC 2011
    fmt.Println(time.Now()) // Wed Dec 21 09:52:14 +0100 RST 2011
    // calculating times:
    week = 60 * 60 * 24 * 7 * 1e9 // must be in nanosec
    week_from_now := t.Add(week)
    fmt.Println(week_from_now) // Wed Dec 28 08:52:14 +0000 UTC 2011
    // formatting times:
    fmt.Println(t.Format(time.RFC822)) // 21 Dec 11 0852 UTC
    fmt.Println(t.Format(time.ANSIC)) // Wed Dec 21 08:56:34 2011
    fmt.Println(t.Format("02 Jan 2006 15:04")) // 21 Dec 2011 08:52
    s := t.Format("20060102")
    fmt.Println(t, "=>", s)
    // Wed Dec 21 08:52:14 +0000 UTC 2011 => 20111221
}
```