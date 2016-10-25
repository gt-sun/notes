直接上代码：
```python
import attr

@attr.s

class Point3D(object):
    x = attr.ib() 
    y = attr.ib()
    z = attr.ib()

p = Point3D(1,2,3)
print(p)  # Point3D(x=1, y=2, z=3)

#对象比较
Point3D(1,2,3) == Point3D(1,2,3)  # true
Point3D(3,2,3) > Point3D(1,2,3)  # true


#获取json对象
print(attr.asdict(Point3D(1,2,3)))  # {'x': 1, 'y': 2, 'z': 3}
```

官网的例子：
```python
>>> import attr
>>> @attr.s
... class C(object):
...     x = attr.ib(default=42)
...     y = attr.ib(default=attr.Factory(list))
...
...     def hard_math(self, z):
...         return self.x * self.y * z
>>> i = C(x=1, y=2)
>>> i
C(x=1, y=2)
>>> i.hard_math(3)
6
>>> i == C(1, 2)
True
>>> i != C(2, 1)
True
>>> attr.asdict(i)
{'y': 2, 'x': 1}
>>> C()
C(x=42, y=[])
>>> C2 = attr.make_class("C2", ["a", "b"])
>>> C2("foo", "bar")
C2(a='foo', b='bar')
```