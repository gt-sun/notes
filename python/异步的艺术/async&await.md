[TOC]

- 考虑到 Python 异步编程的（短暂）历史，可以理解人们会误认为 `async/await == asyncio`。我是说 `asyncio` 帮助我们可以在 Python 3.4 中实现异步编程，同时也是 Python 3.5 中引入`async/await`的推动因素。但是`async/await` 的设计意图就是为了让其足够灵活从而不需要依赖`asyncio`或者仅仅是为了适应这一框架而扭曲关键的设计决策。换句话说，`async/await` 延续了 Python 设计尽可能灵活的传统同时又非常易于使用（实现）。



## 【博文】async/await 入门

**强调：**

- 跟 `yield from` 一样, 不能在函数外部使用 `await` , 否则会抛出语法错误。 (译者注: async 用来声明一个函数是协程, 然后使用 `await` 调用这个协程, `await` 必须在函数内部, 这个函数通常也被声明为另一个协程)

在新版 Python3.5 中，引入了两个新关键字 `async` 和 `await` ，用于解决在 Python 异步编程中无法有效区分 `yield` 生成器与异步的关系的问题。

**异步是一个什么东西**

异步的作用在于，对于 Python 这种拥有 GIL 的语言，某个线程在处理单个耗时较长的任务时（如 I/O 读取，RESTful API 调用）等操作时，不能有效的释放 CPU 资源，导致其他线程的等待时间随之增加。 异步的作用是，在等待这种花费大量时间的操作数，允许释放 CPU 资源执行其他的线程任务，从而提高程序的执行效率。

**3.4 之前如何实现异步**

在 3.5 版本以前的程序中，Python 程序通常是使用 `yield` 作为一个判断是否进入异步操作的关键词。 比如在 3.4.x 版本中，我们可以用这样的一个例子来看一下 ：

```py
import time
import asyncio

@asyncio.coroutine
def slow_operation(n):
    yield from asyncio.sleep(1)
    print("Slow operation {} complete".format(n))


@asyncio.coroutine
def main():
    start = time.time()
    yield from asyncio.wait([
        slow_operation(1),
        slow_operation(2),
        slow_operation(3),
    ])
    end = time.time()
    print('Complete in {} second(s)'.format(end-start))


loop = asyncio.get_event_loop()
loop.run_until_complete(main())
```

执行结果如下：

```
Slow operation 2 complete
Slow operation 1 complete
Slow operation 3 complete
Complete in 1.0008249282836914 second(s)
```

如果你了解过 `yield` ，你会知道 `yield` 其实作用是用来生成一个生成器，而生成器的作用是用于输出一系列的结果。比如计算斐波那契数列：

```py
def fab(max):
    n, a, b = 0, 0, 1
    while n < max:
        yield b
        a, b = b, a + b
        n = n + 1

for n in fab(5):
    print n
```


上面的方法如果不使用 `yield` ，则换成一个支持 `iterable` 的可能更直观理解一点：

```py
class Fab(object):

    def __init__(self, max):
        self.max = max
        self.n, self.a, self.b = 0, 0, 1

    def __iter__(self):
        return self

    def next(self):
        if self.n < self.max:
            r = self.b
            self.a, self.b = self.b, self.a + self.b
            self.n = self.n + 1
            return r
        raise StopIteration()
```


**3.5 版本异步功能**

在 3.5 之后的版本里，程序提供了 `async` 和 `await` 关键字。

比如在上一节中的例子改造成为:

```py
import asyncio
import time

async def slow_operation(n):
    await asyncio.sleep(1)
    print("Slow operation {} complete".format(n))


async def main():
    start = time.time()
    await asyncio.wait([
        slow_operation(1),
        slow_operation(2),
        slow_operation(3),
    ])
    end = time.time()
    print('Complete in {} second(s)'.format(end-start))


loop = asyncio.get_event_loop()
loop.run_until_complete(main())
```