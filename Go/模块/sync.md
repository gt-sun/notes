
[TOC]


在 golang 的官方文档上，作者明确指出，golang 并不希望依靠共享内存的方式进行进程的协同操作。而是希望通过管道 channel 的方式进行。 当然，golang 也提供了共享内存，锁，等机制进行协同操作的包。sync 包就是为了这个目的而出现的。

《Go 并发编程实战》中对 `Sync` 的讲解： https://book.douban.com/subject/26244729/reading/

## 互斥锁

互斥锁是传统的并发程序对共享资源进行访问控制的主要手段。它由标准库代码包 `sync` 中的 `Mutex` 结构体类型代表。`sync.Mutex` 类型（确切地说，是 `*sync.Mutex` 类型）只有两个公开方法——`Lock` 和 `Unlock`。顾名思义，前者被用于锁定当前的互斥量，而后者则被用来对当前的互斥量进行解锁。
类型 `sync.Mutex` 的零值表示了未被锁定的互斥量。也就是说，它是一个开箱即用的工具。我们只需对它进行简单声明就可以正常使用了：

```go
var mutex sync.Mutex
mutex.Lock()
```

我们一般会在锁定互斥锁之后紧接着就用 `defer` 语句来保证该互斥锁的及时解锁。请看下面这个函数：

```go
var mutex sync.Mutex

func write() {
    mutex.Lock()
    defer mutex.Unlock()
    // 省略若干条语句
}
```


## 读写锁

读写锁即是针对于读写操作的互斥锁。它与普通的互斥锁最大的不同就是，它可以分别针对读操作和写操作进行锁定和解锁操作。读写锁遵循的访问控制规则与互斥锁有所不同。在读写锁管辖的范围内，它允许任意个读操作同时进行。但是，在同一时刻，它只允许有一个写操作在进行。并且，在某一个写操作被进行的过程中，读操作的进行也是不被允许的。也就是说，读写锁控制下的多个写操作之间都是互斥的，并且写操作与读操作之间也都是互斥的。但是，多个读操作之间却不存在互斥关系。
在这样的互斥策略之下，读写锁可以在大大降低因使用锁而对程序性能造成的损耗的情况下完成对共享资源的访问控制。
在 Go 语言中，读写锁由结构体类型 `sync.RWMutex` 代表。与互斥锁类似，`sync.RWMutex` 类型的零值就已经是立即可用的读写锁了。在此类型的方法集合中包含了两对方法，即：

```
func (*RWMutex) Lock
func (*RWMutex) Unlock

func (*RWMutex) RLock
func (*RWMutex) RUnlock
```

前一对方法的名称和签名与互斥锁的那两个方法完全一致。它们分别代表了对写操作的锁定和解锁。以下简称它们为写锁定和写解锁。而后一对方法则分别表示了对读操作的锁定和解锁。以下简称它们为读锁定和读解锁。

从普通的互斥锁和读写锁的源码中可以看出，它们是同源的。读写锁的内部是用互斥锁来实现写锁定操作之间的互斥的。我们可以把读写锁看作是互斥锁的一种扩展。


## `Sync.Pool` 临时对象池


## `Sync.Once`


有的时候，我们多个 goroutine 都要过一个操作，但是这个操作我只希望被执行一次，这个时候 Once 就上场了。比如下面的例子:

```go
func main() {
    var once sync.Once
    onceBody := func() {
        fmt.Println("Only once")
    }
    for i := 0; i < 10; i++ {
        go func() {
            once.Do(onceBody)
        }()
    }
    time.Sleep(3e9)
}
```

只会打出一次 "Only once"。


