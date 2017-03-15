[TOC]

---

### 应用

#### `timethis`计算运行时间

```py
import time

def timethis(func):
    def wraper(*args,**kwargs):
        start = time.time()
        res = func(*args,**kwargs)
        end = time.time()
        print(func.__name__,end-start)
        return res
    return wraper

@timethis
def test(n):
    while n > 0:
        n -= 1
    return "Done!"


t = test(1000000)
print(t)

# print
test 0.07812929153442383
Done!
```

### 闭包

先不着急看闭包的定义，让我们从一段示例代码开始。

```py
>>> def outer():
...     x = 1
...     def inner():
...         print x # 1
...     return inner
>>> foo = outer()
>>> foo.func_closure # doctest: +ELLIPSIS
(<cell at 0x...: int object at 0x...>,)
```


从上一个示例可以看到，inner 是 outer 返回的一个函数，存储在变量 foo 里然后用 foo() 来调用。但是它能运行吗？先来思考一下作用域规则。

Python 中一切都按作用域规则运行—— x 是函数 outer 中的一个局部变量，当函数 inner 在 #1 处打印 x 时，Python 在 inner 中搜索局部变量但是没有找到，然后在外层作用域即函数 outer 中搜索找到了变量 x。

Python 支持一种名为**函数闭包**的特性，意味着在非全局作用域定义的 inner 函数在定义时记得外层命名空间是怎样的。inner 函数包含了外层作用域变量，通过查看它的 `func_closure` 属性可以看出这种函数闭包特性。

记住——每次调用函数 outer 时，函数 inner 都会被重新定义。此时 x 的值没有变化，所以返回的每个 inner 函数和其它的 inner 函数运行结果相同，但是如果稍做一点修改呢？


```py
>>> def outer(x):
...     def inner():
...         print x # 1
...     return inner
>>> print1 = outer(1)
>>> print2 = outer(2)
>>> print1()
1
>>> print2()
2
```

从这个示例可以看到闭包——函数记住其外层作用域的事实——可以用来构建本质上有一个硬编码参数的自定义函数。虽然没有直接给 inner 函数传参 1 或 2，但构建了能 “记住” 该打印什么数的 inner 函数自定义版本。

闭包是强大的技术，在某些方面来看可能感觉它有点像面向对象技术：outer 作为 inner 的构造函数，有一个类似私有变量的 x。闭包的作用不胜枚举。如果你熟悉 Python 中 sorted 函数的参数 key，也许你已经写过 lambda 函数通过第二项而非第一项来排序一些列表。

但是这么用闭包太没意思了！让我们再次从头开始，写一个装饰器。

### 装饰器

装饰器其实就是一个以函数作为参数并返回一个替换函数的可执行函数。

```py
>>> def outer(some_func):
...     def inner():
...         print "before some_func"
...         ret = some_func() # 1
...         return ret + 1
...     return inner
>>> def foo():
...     return 1
>>> decorated = outer(foo) # 2
>>> decorated()
before some_func
2
```

我们可以说变量 decorated 是 foo 的装饰版——即 foo 加上一些东西。事实上，如果写了一个实用的装饰器，可能会想用装饰版来代替 foo，这样就总能得到 “附带其他东西” 的 foo 版本。

```py
>>> foo = outer(foo)
>>> foo # doctest: +ELLIPSIS
<function inner at 0x...>
```

现在任意调用 foo() 都不会得到原来的 foo，而是新的装饰器版！

想象一个提供坐标对象的库。它们可能主要由一对对的 x、y 坐标组成。遗憾的是坐标对象不支持数学运算，并且我们也无法修改源码。然而我们需要做很多数学运算，所以要构造能够接收两个坐标对象的 add 和 sub 函数，并且做适当的数学运算。这些函数很容易实现。

```py
>>> class Coordinate(object):
...     def __init__(self, x, y):
...         self.x = x
...         self.y = y
...     def __repr__(self):
...         return "Coord:" + str(self.__dict__)
>>> def add(a, b):
...     return Coordinate(a.x + b.x, a.y + b.y)
>>> def sub(a, b):
...     return Coordinate(a.x - b.x, a.y - b.y)
>>> one = Coordinate(100, 200)
>>> two = Coordinate(300, 200)
>>> add(one, two)
Coord: {'y': 400, 'x': 400}
```

但是如果 add 和 sub 函数必须有边界检测功能呢？也许只能对正坐标进行加或减，如下：


```py
class Coordinate(object):
    def __init__(self,x,y):
        self.x = x
        self.y = y
    def __repr__(self):
        return "Coordiname:" + str(self.__dict__)


def lessfive(func):
    def wraper(*args,**kwargs):
        for i in args:
            if i.x > 5:
                i.x = 5
            if i.y > 5:
                i.y = 5
        res = func(*args,**kwargs)
        return res
    return wraper

@lessfive
def add(m,n):
    return Coordinate(m.x + n.x, m.y + n.y)

a = Coordinate(10,20)
b = Coordinate(1,2)

c = add(a,b)
print(c)

# out
Coordiname:{'x': 6, 'y': 7}
```


###　带参数的装饰器

再包装一层函数

```py
class Coordinate(object):
    def __init__(self,x,y):
        self.x = x
        self.y = y
    def __repr__(self):
        return "Coordiname:" + str(self.__dict__)


def lessfive(mes):
    def build(func):
        def wraper(*args,**kwargs):
            print(mes)
            for i in args:
                if i.x > 5:
                    i.x = 5
                if i.y > 5:
                    i.y = 5
            res = func(*args,**kwargs)
            return res
        return wraper
    return build

@lessfive(mes="小于5")
def add(m,n):
    return Coordinate(m.x + n.x, m.y + n.y)

a = Coordinate(10,20)
b = Coordinate(1,2)

c = add(a,b)
print(c)

# out
小于5
Coordiname:{'y': 7, 'x': 6}
```


### 内置装饰器 

- @property   负责把一个方法变成属性调用

实例：

```py
class A(object):
  def __init__(self, name):
  self.name = name

  @property
  def size(self):
    return len(self.name)

a = A('sun')
print(a.size)  #没有@property,此处要写a.size()
```

- 静态属性 静态方法 类方法

*如何使用类的静态属性*

类的静态属性很简单，在类中直接定义的变量（没有self.）就是静态属性
引用静态属性使用“类名.属性名”的形式。

```py
class C:
    count = 0   #静态属性
    
    def __init__(self):
        C.count = C.count += 1
    def getCount(self):
        return C.count
    
```

*如何使用类的静态方法，有哪些需要注意的地方？*

特性：  使我可以不用实例化一个类就可以调用像这样:
`ClassName.StaticMethod ( )`
静态方法是类的特殊方法，静态方法只需要在普通方法的前面加上`@staticmethod` 修饰符即可。

```py
class C:
    @staticmethod
    def static(arg1, arg2, arg3):
        print(arg1, arg2, arg3, arg1 + arg2 + arg3)
    
    def nostatic(self):
        print('Im no static!!')
```

静态方法的最大优点是：不会绑定到实例对象上，就是节省开销。
静态方法被用来组织类之间有逻辑关系的函数.

如果用不到类的变量，就可以考虑使用静态方法。准确来说，静态方法用不到类中的数据，它仅仅是因为逻辑上的需要被归并到该类中

```py
>>> c1 = C()
>>> c2 = C()
>>> c1.static is C.static
True
>>> c1.nostatic is C.nostatic
False
>>> c1.static
<function static at 0x026F2B30>
>>> c2.static
<function static at 0x026F2B30>
>>> C.static
<function static at 0x026F2B30>   #三个都是同一个
>>> c1.nostatic
<bound method C.nostatic of <__main__.C instance at 0x0263F238>>
>>> c2.nostatic
<bound method C.nostatic of <__main__.C instance at 0x0217F490>>
>>> C.nostatic
<unbound method C.nostatic>
```

说明：
静态方法并不需要self参数，即使是使用对象去访问，self参数也不会传进去。
最后,请少用staticmethod方法!在Python里只有很少的场合适用静态方法,其实许多顶层函数会比静态方法更清晰明了.

*区别*

使用 `@staticmethod` 或 `@classmethod`，就可以不需要实例化，直接类名. 方法名 () 来调用。
这有利于组织代码，把某些应该属于某个类的函数给放到那个类里去，同时有利于命名空间的整洁。

既然 `@staticmethod` 和 `@classmethod` 都可以直接类名. 方法名 () 来调用，那他们有什么区别呢
从它们的使用上来看,

- `@staticmethod` 不需要表示自身对象的 self 和自身类的 cls 参数，就跟使用函数一样。
- `@classmethod` 也不需要 self 参数，但第一个参数需要是表示自身类的 cls 参数。

如果在 `@staticmethod` 中要调用到这个类的一些属性方法，只能直接类名. 属性名或类名. 方法名。
而 `@classmethod` 因为持有 cls 参数，可以来调用类的属性，类的方法，实例化对象等，避免硬编码。

```py
class A(object):
    bar = 1
    def foo(self):
        print 'foo'

    @staticmethod
    def static_foo():
        print 'static_foo'
        print A.bar

    @classmethod
    def class_foo(cls):
        print 'class_foo'
        print cls.bar
        cls().foo()

A.static_foo()
A.class_foo()

输出
static_foo
1
class_foo
1
foo
```

### `@call`装饰器

假设你要创建一个整数平方的列表，你可以这样写：

```py
>>> def table(n):
...     value = []
...     for i in range(n):
...         value.append(i*i)
...     return value
>>> table = table(5)
```

注意看最后一句，是不是很符合装饰器的语法规则？什么情况下你会写这样的代码呢？

- 你需要把相对复杂业务写成一个方法。
- 这个方法和返回值可以同名，而且你不希望对外公开此方法，只公开结果。
- 你想尽量使用装饰器。（无厘头的理由）

那么这时候`@call()`装饰器就登场了。

```py
def call(*args, **kwargs):
    def call_fn(fn):
        return fn(*args, **kwargs)
    return call_fn
```

这个装饰器会把你传入的参数送给目标函数然后直接执行。

```py
@call(5)
def table(n):
    value = []
    for i in range(n):
        value.append(i*i)
    return value

print len(table), table[3]  # 5 9
```

`@call()`装饰器适用于任何函数，你传入的参数会被直接使用然后结果赋值给同名函数。这样避免了你重新定义一个变量来存储结果。

###  使用 `@functools.wraps(func) `

保留原有函数的名称和 docstring

https://segmentfault.com/a/1190000006658289


```py

from functools import wraps


def addstr(func):
    @wraps(func)
    def wraper():
        print("this is addstr()")
        res = func()
        return res
    return wraper


@addstr
def test():
    print("this is test()") 

test()
print(test.__name__) #test


#如果不用functools.wraps，这里的__name__是wraper

```