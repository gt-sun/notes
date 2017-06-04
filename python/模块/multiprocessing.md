

### 基本介绍

multiprocessing 模块可以衍生出子进程。multiprocessing 模块同时提供本地和远程的并发操作。multiprocessing 模块不像 threading 模块那样会受到 GIL 全局解释器锁的限制，它使用进程代替线程。基于这样的特性，multiprocessing 模块可以让程序员在一台服务器上使用多个处理器。

```
In [106]: from multiprocessing import Pool
 
In [107]: def f(x):
   .....:     return x*x;
   .....: 
 
In [108]: if __name__ == '__main__':
   .....:     p=Pool(5)
   .....:     print(p.map(f,[1,2,3]))
   .....:     
[1, 4, 9]
```

在 multiprocessing 模块中，子进程是通过一个 Process 对象生成的。然后调用 start() 函数
```
In [116]: from multiprocessing import Process
 
In [117]: def f(name):
   .....:     print 'hello',name
   .....:     
 
In [118]: if __name__ == '__main__':
   .....:     p=Process(target=f,args=('john',))
   .....:     p.start()
   .....:     p.join()
   .....:     
hello john
```

如果要查看各自的进程 ID，可以使用以下代码:

```
from multiprocessing import Process
import os
 
def info(title):
    print title
    print 'module name:',__name__
    if hasattr(os,'getppid'):
       print 'parent process:',os.getppid()
    print 'process id:', os.getpid()
 
def f(name):
    info('function f')
    print 'hello',name
 
if __name__ == '__main__':
   info('main line')
   p = Process(target=f,args=('john',))
   p.start()
   p.join()
   
打印：
main line
module name: __main__
parent process: 17148
process id: 18168
function f
module name: __main__
parent process: 18168
process id: 18169
hello john
```

### 进程间通信

multiprocessing 模块支持 Queues 和 Pipes 两种方式来进行进程间通信

- 使用 Queue

```
In [123]: from multiprocessing import Process,Queue
 
In [124]: def f(q):
   .....:     q.put([42,None,'hello'])
   .....:     
 
In [125]: if __name__ == '__main__':
   .....:     q=Queue()
   .....:     p=Process(target=f,args=(q,))
   .....:     p.start()
   .....:     print q.get()
   .....:     p.join()
   .....:     
[42, None, 'hello']
```

使用 Queues，对于线程和进程来说都是安全的。

- 使用 Pipe

```
In [136]: from multiprocessing import Process,Pipe
 
In [137]: def f(conn):
   .....:     conn.send([42,None,'hello'])
   .....:     conn.close()
   .....:     
 
In [138]: if __name__ == '__main__':
   .....:     parent_conn,child_conn=Pipe()
   .....:     p=Process(target=f,args=(child_conn,))
   .....:     p.start()
   .....:     print parent_conn.recv()
   .....:     p.join()
   .....:     
[42, None, 'hello']
```

Pipe() 返回一对连接对象，这两个连接对象分别代表 Pipe 的两端。每个连接对象都有 send() 和 recv() 方法。需要注意的是如果两个不同的进程在同一时间对同一个 Pipe 的末端或者连接对象进行读写操作，那么 Pipe 中的数据可能被损坏。不同的进程在不同的末端同一时间读写数据不会造成数据损坏。

### 进程间同步

```
In [143]: from multiprocessing import Process,Lock
 
In [144]: def f(l,i):
               l.acquire()
               print 'hello world',i
               l.release()
   .....:     
 
In [145]: if __name__ == '__main__':
               lock=Lock()
               for num in range(10):
                   Process(target=f,args=(lock,num)).start()
   .....:         
hello world 0
hello world 1
hello world 2
hello world 3
hello world 4
hello world 5
hello world 6
hello world 7
hello world 8
hello world 9
```

### 进程间共享状态信息

在进行并发编程的过程中，尽量不要使用共享状态。如果一定要在进程间共享数据，multiprocessing 模块提供了一些方法。

- 共享内存


```
In [11]: from multiprocessing import Process,Value,Array
 
In [12]: def f(n,a):
   ....:     n.value=3.1415927
   ....:     for i in range(len(a)):
   ....:         a[i] = -a[i]
   ....:         
 
In [13]: if __name__ == '__main__':
   ....:     num=Value('d',0.0)
   ....:     arr=Array('i',range(10))
   ....:     p=Process(target=f,args=(num,arr))
   ....:     p.start()
   ....:     p.join()
   ....:     print num.value
   ....:     print arr[:]
   ....:     
3.1415927
[0, -1, -2, -3, -4, -5, -6, -7, -8, -9]
```

- 共享进程

```
In [27]: from multiprocessing import Process,Manager
 
In [28]: def f(d,l):
            d[1] = '1'
            d['2']=2
            d[0.25]=None
            l.reverse()
   ....:     
 
In [29]: if __name__ == '__main__':
    manager=Manager()
    d=manager.dict()
    l=manager.list(range(10))
    p=Process(target=f,args=(d,l))
    p.start()
    p.join()
    print d
    print l
   ....:     
{0.25: None, 1: '1', '2': 2}
[9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
```

### 使用一组工作进程

使用 Pool 对象会创建一组 worker 进程

```
from multiprocessing import Pool, TimeoutError
import time
import os

def f(x):
    return x*x
    
if __name__ == '__main__':
    pool = Pool(processes=4)              # start 4 worker processes
 
    # print "[0, 1, 4,..., 81]"
    print pool.map(f, range(10))
 
    # print same numbers in arbitrary order
    for i in pool.imap_unordered(f, range(10)):
        print i
 
    # evaluate "f(20)" asynchronously
    res = pool.apply_async(f, (20,))      # runs in *only* one process
    print res.get(timeout=1)              # prints "400"
 
    # evaluate "os.getpid()" asynchronously
    res = pool.apply_async(os.getpid, ()) # runs in *only* one process
    print res.get(timeout=1)              # prints the PID of that process
 
    # launching multiple evaluations asynchronously *may* use more processes
    multiple_results = [pool.apply_async(os.getpid, ()) for i in range(4)]
    print [res.get(timeout=1) for res in multiple_results]
 
    # make a single worker sleep for 10 secs
    res = pool.apply_async(time.sleep, (10,))
    try:
        print res.get(timeout=1)
    except TimeoutError:
        print "We lacked patience and got a multiprocessing.TimeoutError"


打印：
[0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
0
1
4
9
25
36
64
49
81
16
400
27150
[27149, 27152, 27151, 27150]
We lacked patience and got a multiprocessing.TimeoutError

```


## 多进程

多进程测试代码：

```
import random
import multiprocessing


def list_append(count, id, out_list):
    """
    Creates an empty list and then appends a 
    random number to the list 'count' number
    of times. A CPU-heavy operation!
    """
    for i in range(count):
        out_list.append(random.random())

if __name__ == "__main__":
    size = 10000000   # Number of random numbers to add
    procs = 2   # Number of processes to create

    # Create a list of jobs and then iterate through
    # the number of processes appending each process to
    # the job list 
    jobs = []
    for i in range(0, procs):
        out_list = list()
        process = multiprocessing.Process(target=list_append, 
                                          args=(size, i, out_list))
        jobs.append(process)

    # Start the processes (i.e. calculate the random number lists)      
    for j in jobs:
        j.start()

    # Ensure all of the processes have finished
    for j in jobs:
        j.join()

    print("List processing complete.")
```

> 最快的速度是使用cpu的核数，但性能没有想象中的比单进程快。


## 多线程

测试代码：

```
import threading
 
def f(n):
    list=[]
    for x in range(n):
        x=x*x
        list.append(x)
 
if __name__ == '__main__':
   threads=2
   tasks=[]
   for i in range(1,threads):
      thread=threading.Thread(target=f(10000000))
      tasks.append(thread)
   for j in tasks:
      j.start()
   for j in tasks:
      j.join()
```

> 最佳的性能是单线程。