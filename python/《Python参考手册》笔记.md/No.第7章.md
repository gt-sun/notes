## 静态方法

如果在编写类时需要采用很多不同的方式来创建新实例，则常常使用静态方法：

```python
class Date(object):
    def __init__(self,year,month,day):
        self.year=year
        self.month=month
        self.day=day
    @staticmethod
    def now():
        t = time.localtime()
        return Date(t.tm_year, t.tm_mon, t.tm_day)
    @staticmethod
    def tomorrow():
        t = time.localtime(time.time() + 86400)
        return Date(t.tm_year, t.tm_mon, t.tm_day)

# 创建日期实例
a = Date(1990,10,22)
b = Date.now()
c = Date.tomorrow()
```


## 特性 `property`

是一种特殊的属性，访问它时会计算它的值。

实例：

```python
import math

class Circle(object):
    def __init__(self, radius):
        self.radius = radius
    @property
    def area(self):
        return math.pi * self.radius**2
    @property
    def perimeter(self):
        return 2*math.pi*self.radius
    
    
c = Circle(4)
print(c.radius)
print(c.area)
print(c.perimeter)

```

`@property`支持以简单属性的形式访问后面的方法，无需像额外的()来调用方法。