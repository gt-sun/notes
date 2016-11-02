Python 中，队列是线程间最常用的交换数据的形式。Queue 模块是提供队列操作的模块。
多进程可使用`multiprocessing.Queue`

- 创建一个 “队列” 对象

```
import Queue
q = Queue.Queue(maxsize = 10)
```
Queue.Queue 类即是一个队列的同步实现。队列长度可为无限或者有限。可通过 Queue 的构造函数的可选参数 maxsize 来设定队列长度。如果 maxsize 小于 1 就表示队列长度无限。

- 将一个值放入队列中

q.put(10)
调用队列对象的 put() 方法在队尾插入一个项目。put() 有两个参数，第一个 item 为必需的，为插入项目的值；第二个 block 为可选参数，默认为
1。如果队列当前为空且 block 为 1，put() 方法就使调用线程暂停, 直到空出一个数据单元。如果 block 为 0，put 方法将引发 Full 异常。

- 将一个值从队列中取出

q.get()
调用队列对象的 get() 方法从队头删除并返回一个项目。可选参数为 block，默认为 True。如果队列为空且 block 为 True，get() 就使调用线程暂停，直至有项目可用。如果队列为空且 block 为 False，队列将引发 Empty 异常。

- Python Queue 模块有三种队列及构造函数
    - 1、Python Queue 模块的 FIFO 队列先进先出。     class Queue.Queue(maxsize)
    - 2、LIFO 类似于堆，即先进后出。                         class Queue.LifoQueue(maxsize)
    - 3、还有一种是优先级队列级别越低越先出来。    class Queue.PriorityQueue(maxsize)

`q.qsize()` 返回队列的大小
`q.empty()` 如果队列为空，返回 True, 反之 False
`q.full()` 如果队列满了，返回 True, 反之 False
`q.full` 与 maxsize 大小对应
`q.get([block[, timeout]])` 获取队列，timeout 等待时间
`q.get_nowait()` 相当 q.get(False)
非阻塞 `q.put(item)` 写入队列，timeout 等待时间
`q.put_nowait(item)` 相当 q.put(item, False)
`q.task_done()` 在完成一项工作之后，`q.task_done()`函数向任务已经完成的队列发送一个信号
`q.join()` 实际上意味着等到队列为空，再执行别的操作

- 实例：

实现一个线程不断生成一个随机数到一个队列中 (考虑使用 Queue 这个模块)
实现一个线程从上面的队列里面不断的取出奇数
实现另外一个线程从上面的队列里面不断取出偶数

```python
import queue
import random
import threading
import time

class Product(threading.Thread):
    def __init__(self, t_name, queue):
        threading.Thread.__init__(self, name=t_name)
        self.data = queue

    def run(self):
        for i in range(10):
            v = random.randint(1, 100)
            print("{} : {} is producting {} to the queue!".format(time.ctime(), self.getName(), v))
            self.data.put(v)
            time.sleep(1)
        print("{} : {} finshed!".format(time.ctime(), self.getName()))

class Consumer_even(threading.Thread):
    def __init__(self, t_name, queue):
        threading.Thread.__init__(self, name=t_name)
        self.data = queue

    def run(self):
        while 1:
            try:
                v = self.data.get(1, 5)
                if v % 2 == 0:
                    print("{} : {} is consumering, {} in the queue is consumered!".format(time.ctime(), self.getName(), v))
                    time.sleep(2)
                else:
                    self.data.put(v)
                    time.sleep(2)
            except queue.Empty:
                print("{} : {} is finshed!".format(time.ctime(), self.getName()))
                break


class Consumer_odd(threading.Thread):
    def __init__(self, t_name, queue):
        threading.Thread.__init__(self, name=t_name)
        self.data = queue

    def run(self):
        while 1:
            try:
                v = self.data.get(1, 5)
                if v % 2 != 0:
                    print("{} : {} is consumering, {} in the queue is consumered!".format(time.ctime(), self.getName(), v))
                    time.sleep(2)
                else:
                    self.data.put(v)
                    time.sleep(2)
            except queue.Empty:
                print("{} : {} is finshed!".format(time.ctime(), self.getName()))
                break

def main():
    q = queue.Queue()
    product = Product('Pro', q)
    consumer_even = Consumer_even('Con_even', q)
    consumer_odd = Consumer_odd('Con_odd', q)
    product.start()
    consumer_even.start()
    consumer_odd.start()
    product.join()
    consumer_even.join()
    consumer_odd.join()
    print('All done')

if __name__ == "__main__":
    main()

# https://blog.linuxeye.com/334.html
```
