[TOC]



## 模拟一个cache


```py
import datetime
import random
import time

class MyCache(object):
    """docstring for MyCache"""
    def __init__(self):
        self.cache = {}
        self.max_cache_size = 10

    def __contains__(self, key):
        return key in self.cache

    def update(self, key, value):
        if key not in self.cache and len(self.cache) >= self.max_cache_size:
            self.remove_oldest()
        self.cache[key] = {'date_access':datetime.datetime.now(), 'value':value}

    def remove_oldest(self):
        oldest_entry = None
        for key in self.cache:
            if not oldest_entry:
                oldest_entry = key
            elif self.cache[key]['date_access'] < self.cache[oldest_entry]['date_access']:
                oldest_entry = key
        self.cache.pop(oldest_entry)

    @property
    def size(self):
        return len(self.cache)

if __name__=='__main__':
    keys = ['test', 'red', 'fox', 'fence', 'junk',
            'other', 'alpha', 'bravo', 'cal', 'devo', 'ele','aaa', 'bbb', 'ccc', 'ddd']
    s = 'abcdefghijklmnop'
    cache = MyCache()
    for i, key in enumerate(keys):
        if key in cache:
            continue
        else:
            value = ''.join(random.choice(s) for i in range(8))
            cache.update(key, value)
            time.sleep(0.0001)
        print('已经插入%s个，已经缓存%s条数据' % (i+1, cache.size))

    # print(cache.cache.items())
    list_key = sorted(cache.cache.items(), key=lambda x:x[1]['date_access'])
    print(list_key)

结果：
已经插入1个，已经缓存1条数据
已经插入2个，已经缓存2条数据
已经插入3个，已经缓存3条数据
已经插入4个，已经缓存4条数据
已经插入5个，已经缓存5条数据
已经插入6个，已经缓存6条数据
已经插入7个，已经缓存7条数据
已经插入8个，已经缓存8条数据
已经插入9个，已经缓存9条数据
已经插入10个，已经缓存10条数据
已经插入11个，已经缓存10条数据
已经插入12个，已经缓存10条数据
已经插入13个，已经缓存10条数据
已经插入14个，已经缓存10条数据
已经插入15个，已经缓存10条数据

```


## 去重

实现：
- 对list去重；
- 对以dict为元素的list去重；

```py
def dedupe(items, key=None):
    seen = set()
    for item in items:
        value = item if key is None else key(item)
        if value not in seen:
            yield item
            seen.add(value)


a = [{'x':1, 'y':2}, {'x':1, 'y':3}, {'x':1, 'y':2}, {'x':2, 'y':4}]
b = [1, 5, 2, 1, 9, 1, 5, 10]

print(list(dedupe(b)))
#out: [1, 5, 2, 9, 10]

print(list(dedupe(a, key=lambda x: (x['x'], x['y']))))
#out：[{'y': 2, 'x': 1}, {'y': 3, 'x': 1}, {'y': 4, 'x': 2}]
#判断x、y

print(list(dedupe(a, key=lambda x: (x['x']))))
#out: [{'y': 2, 'x': 1}, {'y': 4, 'x': 2}]
#仅判断x是否重复
```

## 2重循环 -> 1重循环

需求如下：

```py
s = "a string to examine"
for i in range(len(s)):
    for j in range(i+1, len(s)):
        if s[i] == s[j]:
            answer = (i, j)
            break   # 如何 break 两次呢???
```

对索引对进行一重循环:

```py
def unique_pairs(n):
    """在 range(n) 范围内生成索引对"""
    for i in range(n):
        for j in range(i+1, n):
            yield i, j

s = "a string to examine"
for i, j in unique_pairs(len(s)):
    if s[i] == s[j]:
        answer = (i, j)
        break
```

## 安全的使用eval

```py
In [1]: import ast

In [2]: a = '[1,2,3]'

In [3]: ast.literal_eval(a)
Out[3]: [1, 2, 3]

In [4]: b = '1+2'

In [5]: ast.literal_eval(b)
Out[5]: 3
```

## [1,2,3] to 123

```py
a = [1, 2, 3]
b = int("".join(map(str, a)))
```


## 匹配正反顺序

Q：有列表： [0, 1], [0, 4], [1, 0], [1, 4], [4, 0], [4, 1]，假如[a,b] == [b,a]，请去重。

A:

法1
```py
print({tuple(item) for item in map(sorted, items)})

#OR
print({tuple(sorted(item)) for item in a})
```

法2

```py
def remove_reversed_duplicates(iterable):
    seen = set()
    for item in iterable:
        tup = tuple(item)
        if tup not in seen:
            seen.add(tup[::-1]) #倒序的智慧
            yield item
```