[TOC]

---

> - 考虑到 Python 异步编程的（短暂）历史，可以理解人们会误认为 `async/await == asyncio`。我是说 `asyncio` 帮助我们可以在 Python 3.4 中实现异步编程，同时也是 Python 3.5 中引入`async/await`的推动因素。但是`async/await` 的设计意图就是为了让其足够灵活从而不需要依赖`asyncio`或者仅仅是为了适应这一框架而扭曲关键的设计决策。换句话说，`async/await` 延续了 Python 设计尽可能灵活的传统同时又非常易于使用（实现）。

## 和 `concurrent.futures`区别

The `asyncio` documentation covers the differences:

```py
class asyncio.Future(*, loop=None)

This class is almost compatible with `concurrent.futures.Future`.

Differences:

- `result()` and `exception()` do not take a timeout argument and raise an exception when the future isn’t done yet.
- Callbacks registered with `add_done_callback()` are always called via the event loop’s `call_soon_threadsafe()`.
- This class is not compatible with the `wait()` and `as_completed()` functions in the `concurrent.futures` package.

This class is not thread safe.
```

Basically, if you're using `ThreadPoolExecutor` or `ProcessPoolExecutor`, or want to use a `Future` directly for thread-based or process-based concurrency, use `concurrent.futures.Future`. If you're using `asyncio`, use `asyncio.Future`.

`asyncio.Future` isn't **thread-safe** at all - it's only designed to be used in a single-threaded, asyncio-based application.

`asyncio` provides a `Future` class that mimics the one in the `concurrent.futures` module, but adapted for use with the event loop;

## 官方笔记

**`call_later` `call_soon`**

```py
import asyncio
import datetime


def display_time(end_time, loop):
    if (loop.time() + 1.0) < end_time:
        loop.call_later(1, display_time, end_time, loop)
    else:
        print(datetime.datetime.now()) # 等待5秒后执行
        loop.stop()

loop = asyncio.get_event_loop()
end_time = loop.time() + 5.0
loop.call_soon(display_time, end_time, loop)

loop.run_forever()
loop.close()
```


## 廖雪峰

```py
import asyncio
import threading

@asyncio.coroutine
def f():
    print("Hello world ",threading.currentThread())
    yield from asyncio.sleep(1)
    print("Hello again! ",threading.currentThread())


tasks = [f(),f()]

loop = asyncio.get_event_loop()
loop.run_until_complete(asyncio.wait(tasks))
loop.close()
```

打印：

```
Hello world  <_MainThread(MainThread, started 8092)>
Hello world  <_MainThread(MainThread, started 8092)>
Hello again!  <_MainThread(MainThread, started 8092)>
Hello again!  <_MainThread(MainThread, started 8092)>
[Finished in 1.2s]
```

当前线程名称可以看出，两个coroutine是由同一个线程并发执行的。

如果把`asyncio.sleep()`换成真正的 IO 操作，则多个coroutine就可以由一个线程并发执行。

**aiohttp 实现简单的httpserver**

```py
import asyncio
# import aiohttp
from aiohttp import web


async def index(request):
    await asyncio.sleep(0.5)
    return web.Response(body=b'<h1>Index</h1>',content_type="text/html")

async def hello(request):
    await asyncio.sleep(0.5)
    text = '<h1>hello, %s!</h1>' % request.match_info['name']
    return web.Response(body=text.encode('utf-8'),content_type="text/html")

async def init(loop):
    app = web.Application(loop=loop)
    app.router.add_route('GET', '/', index)
    app.router.add_route('GET', '/hello/{name}', hello)
    srv = await loop.create_server(app.make_handler(), '127.0.0.1', 8000)
    print('Server started at http://127.0.0.1:8000...')
    return srv

loop = asyncio.get_event_loop()
loop.run_until_complete(init(loop))
loop.run_forever()
```


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