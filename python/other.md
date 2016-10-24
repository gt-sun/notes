## 动态给实例绑定属性、方法


```python
In [1]: class Student(object):
   ...:     pass
   ...:

In [2]: s = Student()

In [3]: s.name = "sun"  # 绑定属性

In [4]: s.name
Out[4]: 'sun'

In [11]: def set_age(self, age):
   ....:     self.age = age
   ....:

In [13]: from types import MethodType

In [15]: s.set_age = MethodType(set_age, s)  # 绑定方法

In [18]: s.set_age(22)

In [19]: s.age
Out[19]: 22
```

但是，给另外一个实例绑定却是无效的：
```python
In [20]: s2 = Student()

In [21]: s2.set_age(23)
---------------------------------------------------------------------------
AttributeError                            Traceback (most recent call last)
<ipython-input-21-1475e8b7d015> in <module>()
----> 1 s2.set_age(23)

AttributeError: 'Student' object has no attribute 'set_age'
```

为了给所有实例都绑定方法，可以给 class 绑定方法：
```python
In [22]: def set_score(self, score):
   ....:     self.score = score
   ....:

In [23]: Student.set_score = set_score  # 给类绑定方法

In [24]: s.set_score(100)

In [25]: s.score
Out[25]: 100

In [26]: s2.set_score(99)

In [27]: s2.score
Out[27]: 99
```

通常情况下，上面的`set_score`方法可以直接定义在 class 中，但动态绑定允许我们在程序运行的过程中动态给 class 加上功能，这在静态语言中很难实现。

**使用`__slots__`**<span id="jump"></span>

但是，如果我们想要限制实例的属性怎么办？比如，只允许对 Student 实例添加name和age属性。

为了达到限制的目的，Python 允许在定义 class 的时候，定义一个特殊的`__slots__`变量，来限制该 class 实例能添加的属性：

```
class Student(object):
    __slots__ = ('name', 'age') # 用tuple定义允许绑定的属性名称
```

然后，我们试试：

```
>>> s = Student() # 创建新的实例
>>> s.name = 'Michael' # 绑定属性'name'
>>> s.age = 25 # 绑定属性'age'
>>> s.score = 99 # 绑定属性'score'
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
AttributeError: 'Student' object has no attribute 'score'
```

由于`score`没有被放到`__slots__`中，所以不能绑定score属性，试图绑定score将得到`AttributeError`的错误。

使用`__slots__`要注意，`__slots__`定义的属性仅对当前类实例起作用，对继承的子类是不起作用的：

```
>>> class GraduateStudent(Student):
...     pass
...
>>> g = GraduateStudent()
>>> g.score = 9999
```
除非在子类中也定义`__slots__`，这样，子类实例允许定义的属性就是自身的`__slots__`加上父类的`__slots__`。