[TOC]

---


## Time 和 int64

```go
    var t time.Time
    var i int64
    
    // Time -> int64
    t = time.Now()
    i = t.Unix()
    fmt.Println(i)

    // int64 -> Time    
    t2 := time.Unix(i, 0)
    fmt.Println(t2)
```


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

## 指定时区

```go
func main() {
    formate := "2006-01-02 15:04:05"  //这里的时间不能改
    now := time.Now()

    t, _ := time.LoadLocation("Asia/Shanghai")
    fmt.Println(now.In(t).Format(formate))
}
```

## 时间格式化

- `Format`和`Parse`

前者对Time类型转化为string；
后者对string类型，转换为Time类型；

```go
func f2() {
    t := time.Now()
    fmt.Println(t.Format("2006/01/02"))
}

func f3() {
    // t := time.Now()
    var value string = "2017-02-04 14:10:31"
    res, _ := time.Parse("2006-01-02 15:04:05", value)
    fmt.Println(res.Format("2006/01/02"))
}

打印：
2017/02/04
2017/02/04
```



```
//通过字符串，默认UTC时区初始化Time
func Parse(layout, value string) (Time, error) 

//通过字符串，指定时区来初始化Time
func ParseInLocation(layout, value string, loc *Location) (Time, error) 

```

实例代码如下：

```go
local, _ := time.LoadLocation("America/Los_Angeles")
timeFormat := "2006-01-02 15:04:05"

time1 := time.Unix(1480390585, 0)   //通过unix标准时间的秒，纳秒设置时间
time2, _ := time.ParseInLocation(timeFormat, "2016-11-28 19:36:25", local)

fmt.Println(time1.In(local).Format(timeFormat))
fmt.Println(time2.Format(timeFormat))

//output:
//2016-11-28 19:36:25
//2016-11-28 19:36:25
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
func main() {
    c := time.Tick(1 * time.Second)
    for now := range c {
        fmt.Printf("%v %s\n", now, "abc")
    }
}
//每隔1秒，打印当前时间和一个字符串
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

