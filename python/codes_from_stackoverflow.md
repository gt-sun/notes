[TOC]



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