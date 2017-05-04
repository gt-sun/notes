[TOC]


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