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