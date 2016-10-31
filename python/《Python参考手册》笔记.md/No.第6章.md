## 闭包

如果要在一系列函数调用中保持某个状态，使用闭包是一种非常高效的方式。例如，下面运行了一个简单计数器的代码：

```python
def countdown(n):
    def next():
        nonlocal n
        r = n
        n -= 1
        return r
    return next

# 用例
next = countdown(10) 
while True:
    v = next()
    if not n: break
```

在这段代码中，闭包用于保存内部计数器的值n，每次调用内部函数next()时，它都更新并返回这个计数器变量的前一个值。不熟悉闭包的人可能用下面这样的一个类来实现类似功能：

```python
class Countdown(object):
    def __init__(self,n):
        self.n = n
    def next(self):
        r = self.n
        self.n -= 1
        return r

#用例
c = Countdown(10)
whire True:
    v = c.next()
    if not v: break
```

使用闭包的版本运行速度要快得多。