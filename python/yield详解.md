[TOC]

链接：

http://mp.weixin.qq.com/s?__biz=MzA4MjEyNTA5Mw==&mid=2652563679&idx=2&sn=e67af73c01ede11bd8efbc2591e35f31&scene=4#wechat_redirect


# 第三部分(先看)


### 先讲 iterator 和 iterable


- 可迭代对象 (Iterable) 是实现了__iter__()方法的对象, 通过调用iter()方法可以获得一个迭代器 (Iterator)。


- 迭代器 (Iterator) 是实现了__iter__()和__next__()的对象。


对于iterable, 我们该关注的是, 它是一个能一次返回一个成员的对象 (iterable is an object capable of returning its members one at a time), 一些iterable将所有值都存储在内存中, 比如list, 而另一些并不是这样, 比如我们下面将讲到的iterator.


iterator是实现了`iterator.__iter__()`和`iterator.__next__()`方法的对象`iterator.__iter__()`方法返回的是iterator对象本身. 根据官方的说法, 正是这个方法, 实现了`for ... in ...`语句. 而`iterator.__next__()`是iterator区别于iterable的关键了, 它允许我们显式地获取一个元素. 当调用`next()`方法时, 实际上产生了 2 个操作:


- 更新iterator状态, 令其指向后一项, 以便下一次调用
- 返回当前结果




正是`__next__()`，使得iterator能在每次被调用时，返回一个单一的值 ，从而极大的节省了内存资源。另一点需要格外注意的是，iterator是消耗型的，即每一个值被使用过后，就消失了。因此，你可以将以上的操作 2 理解成pop。对iterator进行遍历之后，其就变成了一个空的容器了，但不等于None哦。因此，若要重复使用iterator，利用list()方法将其结果保存起来是一个不错的选择。


我们通过代码来感受一下。


```
>>> from collections import Iterable, Iterator
>>> a = [1,2,3]   
# 众所周知,list是一个iterable
>>> b = iter(a)   
# 通过iter()方法,得到iterator,iter()
实际上调用了__iter__(),此后不再多说


>>> isinstance(a, Iterable)
True


>>> isinstance(a, Iterator)
False


>>> isinstance(b, Iterable)
True


>>> isinstance(b, Iterator)
True


# iterator是消耗型的,用一次少一次.
对iterator进行变量,iterator就空了!


>>> c = list(b)
>>> c
[1, 2, 3]
>>> d = list(b)
>>> d
[]
# 空的iterator并不等于None.


>>> if b:
...   print(1)
...
1


# 再来感受一下next()
>>> e = iter(a)
>>> next(e)     
#next()实际调用了__next__()方法,此后不再多说


1


>>> next(e)
2
```


PS: iterator都是iterable，但iterable不都是iterator。


### for循环的原理


我们对一个iterable用for ... in ...进行迭代时，实际是先通过调用iter()方法得到一个iterator，假设叫做 X。然后循环地调用 X 的next()方法取得每一次的值，直到 iterator 为空，返回的StopIteration作为循环结束的标志。for ... in ...会自动处理StopIteration异常，从而避免了抛出异常而使程序中断。


### yield


我们常说的生成器，就是带有yield的函数，而generator iterator则是generator function的返回值，即一个generator对象，而形如(elem for elem in [1, 2, 3])的表达式，称为generator expression，实际使用与generator无异。


```
>>> a = (elem for elem in [1, 2, 3])
>>> a
<generator object <genexpr> at 0x7f0d23888048>
>>> def fib():
...     a, b = 0, 1
...     while True:
...         yield b
...         a, b = b, a + b
...
>>> fib
<function fib at 0x7f0d238796a8>
>>> b = fib()
<generator object fib at 0x7f0d20bbfea0>
```


其实说白了,generator就是iterator的一种，以更优雅的方式实现的iterator。


你完全可以像使用iterator一样使用generator。定义一个iterator，你需要分别实现__iter__()方法和__next__()方法，但generator只需要一个小小的yield。


前文讲到iterator通过__next__()方法实现了每次调用，返回一个单一值的功能。而yield就是实现generator的__next__()方法的关键！先来看一个最简单的例子:


```
>>> def g():
...     print("1 is")
...     yield 1
...     print("2 is")
...     yield 2
...     print("3 is")
...     yield 3
...
>>> z = g()
>>> z
<generator object g at 0x7f0d2387c8b8>
>>> next(z)
1 is1


>>> next(z)
2 is2


>>> next(z)
3 is3


>>> next(z)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
StopIteration
```


第一次调用next()方法时，函数似乎执行到yield 1，就暂停了。然后再次调用next()时，函数从yield 1之后开始执行的，并再次暂停。第三次调用next()，从第二次暂停的地方开始执行。第四次, 抛出StopIteration异常。


我们再来看另一段代码。


```
>>> def gen():
...     while True:
...         s = yield
...         print(s)
...
>>> g = gen()
>>> g.send("kissg")
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: can't send non-None value to a just-started generator
>>> next(g)
>>> g.send("kissg")
kissg
```


generator其实有第 2 种调用方法 (恢复执行)，即通过send(value)方法将value作为yield表达式的当前值，你可以用该值再对其他变量进行赋值，这一段代码就很好理解了。
调用send(value)时要注意，要确保，generator是在yield处被暂停了，如此才能向yield表达式传值，否则将会报错 (如上所示)，可通过next()方法或send(None)使generator执行到yield。


再来看一段yield更复杂的用法，或许能加深你对generator的next()与send(value)的理解：


```
In [1]: def echo(v=None):
   ...:     while True:
   ...:         print("line3")
   ...:         v = yield v
   ...:         if v is not None:
   ...:             v += 1
   ...:


In [2]: g = echo(1)


In [3]: g
Out[3]: <generator object echo at 0x0000000003776C50>


In [4]: g.send(None)
line3
Out[4]: 1


In [5]: g.send(2)
line3
Out[5]: 3
```


### yield 与 return


在一个生成器中，如果没有 return，则默认执行到函数完毕时返回 StopIteration；


```
>>> def g1():
...     yield 1
...
>>> g=g1()
>>> next(g)    #第一次调用 next(g) 时，会在执行完 yield 语句后挂起，所以此时程序并没有执行结束。
1
>>> next(g)    #程序试图从 yield 语句的下一条语句开始执行，发现已经到了结尾，所以抛出 StopIteration 异常。
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
StopIteration
>>>
```


如果在执行过程中 return，则直接抛出 StopIteration 终止迭代。


```
>>> def g2():
...     yield 'a'
...     return
...     yield 'b'
...
>>> g=g2()
>>> next(g)    #程序停留在执行完 yield 'a'语句后的位置。
'a'
>>> next(g)    #程序发现下一条语句是 return，所以抛出 StopIteration 异常，这样 yield 'b'语句永远也不会执行。
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
StopIteration
```


如果在 return 后返回一个值，那么这个值为 StopIteration 异常的说明，不是程序的返回值。


生成器没有办法使用 return 来返回值。


```
>>> def g3():
...     yield 'hello'
...     return 'world'
...
>>> g=g3()
>>> next(g)
'hello'
>>> next(g)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
StopIteration: world
```


# 第一部分


**生成器有这么几个方法：**


- `__next__` 不用说了，每次 for 还有 next 都是调用这个方法。
- send(value) 用 value 对 yield 语句赋值，再执行接下来的代码直到下个 yield。
- throw(type[, value[, traceback]]) 抛出错误，类似于 raise 吧。
- close() 告诉生成器，你已经死了。再调用会抛出 StopIteration。
- gi_running 查看生成器是否再运行。


### 实例1




```python
def gen():
    yield 1
    yield 2
g = gen()


for i in g:
    print(i)


打印：
1
2
```




### 实例 2


 在调用send方法前，必须先调用一次`__next__`，让生成器执行到 yield 语句处， 才能进行赋值。外面加上 while 循环是为了避免出现send之后， 生成器没有 yield 语句了，抛出 StopIteration 的情况。




```python
def gen():
    while 1:
        h = yield
        print(h)
g = gen()
```




```python
g.send(None)  #表示开始
```




```python
g.send('aaa')
```


    aaa






```python
g.send('bbb')
```


    bbb






```python
g.close()
```




```python
g.send('ccc')
```




    ---------------------------------------------------------------------------


    StopIteration                             Traceback (most recent call last)


    <ipython-input-11-b18ebbba6fe9> in <module>()
    ----> 1 g.send('ccc')
    


    StopIteration: 






```python
g.gi_running
```


    False


# 第二部分


## yield


### 实例1：


```
def add(s, x):
    return s + x


def gen():
    for  i in range(4):
        yield i


base = gen()
for n in [1, 10]:
    base = (add(i, n) for i in base)


print(list(base))


结果:
[20, 21, 22, 23]
```
核心语句就是:


for n in [1, 10]:
　　base = (add(i + n) for i in base)
在执行list(base)的时候，开始检索，然后生成器开始运算了。关键是，这个循环次数是2,也就是说，有两次生成器表达式的过程。必须牢牢把握住这一点。


生成器返回去开始运算，n = 10而不是1没问题吧，这个在上面提到的文章中已经提到了，就是add(i+n)绑定的是n这个变量，而不是它当时的数值。


然后首先是第一次生成器表达式的执行过程:base = (10 + 0, 10 + 1, 10 + 2, 10 +3),这是第一次循环的结果(形象表示，其实已经计算出来了(10,11,12,3))，然后第二次，base = (10 + 10, 11 + 10, 12 + 10, 13 + 10) ,终于得到结果了[20, 21, 22, 23].




### 实例2

```
#coding: U8


def h():
    print('Wen Chuan')
    m = yield 5  #m是下一个yield传进来的参数，即send()的内容
    print(m)
    d = yield 12
    # print(d)  #这里d没有值，因为下面没有send了，d是下一个yield传进来的参数
    print('We are together!')


c = h()
x = c.send(None)  #send方法 给yield传参
#x 获取了 yield 5 的参数值 5
#相当于c.__next__(),第一次使用 send参数必须为None，表示启动生成器，直到下一个 yield 表达式处。
#m = Fighting!  是下一个send的参数


y = c.send('Fighting!')  #y 获取了 yield 12 的参数值 12
print('We will never forget the date', x, '.', y)


打印：
Wen Chuan
Fighting!
('We will never forget the date', 5, '.', 12)
```


### 实例3： 生产-消费者模型


```
def consumer():
  r = ''
  while True:
  n = yield r
        if not n:
  return
  print('[CONSUMER] Consuming %s...' % n)
        r = '200 OK'


def produce(c):
  c.send(None)
    n = 0
  while n < 5:
  n = n + 1
  print('[PRODUCER] Producing %s...' % n)
        r = c.send(n)
        print('[PRODUCER] Consumer return: %s' % r)
    c.close()


c = consumer()
produce(c)


打印：
[PRODUCER] Producing 1...
[CONSUMER] Consuming 1...
[PRODUCER] Consumer return: 200 OK
[PRODUCER] Producing 2...
[CONSUMER] Consuming 2...
[PRODUCER] Consumer return: 200 OK
[PRODUCER] Producing 3...
[CONSUMER] Consuming 3...
[PRODUCER] Consumer return: 200 OK
[PRODUCER] Producing 4...
[CONSUMER] Consuming 4...
[PRODUCER] Consumer return: 200 OK
[PRODUCER] Producing 5...
[CONSUMER] Consuming 5...
[PRODUCER] Consumer return: 200 OK
```


注意到`consumer`函数是一个`generator`，把一个`consumer`传入`produce`后：


1.  首先调用`c.send(None)`启动生成器；


2.  然后，一旦生产了东西，通过`c.send(n)`切换到`consumer`执行；


3.  `consumer`通过`yield`拿到消息，处理，又通过`yield`把结果传回；


4.  `produce`拿到`consumer`处理的结果，继续生产下一条消息；


5.  `produce`决定不生产了，通过`c.close()`关闭`consumer`，整个过程结束。


整个流程无锁，由一个线程执行，`produce`和`consumer`协作完成任务，所以称为 “协程”，而非线程的抢占式多任务。


### 实例4

发送值到生成器函数在中

```
def mygen():
    """Yield 5 until something else is passed back via send()"""
    a = 5
    while True:
        f = (yield a) #yield a and possibly get f in return
        if f is not None:
            a = f  #store the new value
 
>>> g = mygen()
>>> g.next()
5
>>> g.next()
5
>>> g.send(7)  #we send this back to the generator
7
>>> g.next() #now it will yield 7 until we send something else
7
```

### 实例5：实现tail -f

```python
In [28]: import time

In [29]: def tail(f):
   ....:     f.seek(0, 2)
   ....:     while 1:
   ....:         line = f.readline()
   ....:         if not line:
   ....:             time.sleep(0.1)
   ....:             continue
   ....:         yield line
   ....:
```


### yield 处理异常


```
import random


def get_record(line):
  num = random.randint(0, 3)
  if num == 3:
    raise Exception("3 means danger")
  return line


def parsefunc(stream):
  for line in stream:
    try:
      rec = get_record(line)
    except Exception as e:
      yield (None, e)
    else:
      yield (rec, None)


if __name__ == '__main__':
  with open('data/test.txt') as f:
    for rec, e in parsefunc(f):
      if e:
        print("Got an exception %s" % e)
      else:
        print("Got a record %s" % rec)
```
