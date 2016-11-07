[TOC]


### namedtuple

*廖雪峰*

我们知道tuple可以表示不变集合，例如，一个点的二维坐标就可以表示成：

`p = (1, 2)`

但是，看到(1, 2)，很难看出这个tuple是用来表示一个坐标的。
定义一个class又小题大做了，这时，`namedtuple`就派上了用场：

```python
>>> from collections import namedtuple
>>> Point = namedtuple('Point', ['x', 'y'])
>>> p = Point(1, 2)
>>> p.x
1
>>> p.y
2
```

`namedtuple`是一个函数，它用来创建一个自定义的tuple对象，并且规定了tuple元素的个数，可以用属性而不是索引来引用tuple的某个元素。
这样一来，我们用`namedtuple`可以很方便地定义一种数据类型，它具备tuple的不变性，又可以根据属性来引用，使用十分方便。
可以验证创建的Point对象是tuple的一种子类：

```
>>> isinstance(p, Point)
True
>>> isinstance(p, tuple)
True
```

类似的，如果要用坐标和半径表示一个圆，也可以用`namedtuple`定义：

`Circle = namedtuple('Circle', ['x', 'y', 'r'])`

还可以写成这种形式：

```python
from collections import namedtuple  
   
Parts = namedtuple('Parts', 'id_num desc cost amount')  
auto_parts = Parts(id_num='1234', desc='Ford Engine',  
                   cost=1200.00, amount=10)  
print(auto_parts.id_num)
```

*PythonCookbook*


为了说明清楚，下面是使用普通元组的代码：

```python
def compute_cost(records):
    total = 0.0
    for rec in records:
        total += rec[1] * rec[2]
    return total
```

下标操作通常会让代码表意不清晰，并且非常依赖记录的结构。 下面是使用命名元组的版本：

```python
from collections import namedtuple

Stock = namedtuple('Stock', ['name', 'shares', 'price'])
def compute_cost(records):
    total = 0.0
    for rec in records:
        s = Stock(*rec)
        total += s.shares * s.price
    return total
```

*讨论*

命名元组另一个用途就是作为字典的替代，因为字典存储需要更多的内存空间。 如果你需要构建一个非常大的包含字典的数据结构，那么使用命名元组会更加高效。 
但是需要注意的是，不像字典那样，一个命名元组是不可更改的。比如：

```
>>> s = Stock('ACME', 100, 123.45)
>>> s
Stock(name='ACME', shares=100, price=123.45)
>>> s.shares = 75
Traceback (most recent call last):
File "<stdin>", line 1, in <module>
AttributeError: can't set attribute
>>>
```

如果你真的需要改变然后的属性，那么可以使用命名元组实例的 `_replace()` 方法， 它会创建一个全新的命名元组并将对应的字段用新的值取代。比如：

```
>>> s = s._replace(shares=75)
>>> s
Stock(name='ACME', shares=75, price=123.45)
>>>
```

`_replace() `方法还有一个很有用的特性就是当你的命名元组拥有可选或者缺失字段时候， 它是一个非常方便的填充数据的方法。 
你可以先创建一个包含缺省值的原型元组，然后使用 `_replace()` 方法创建新的值被更新过的实例。比如：

```python
from collections import namedtuple

Stock = namedtuple('Stock', ['name', 'shares', 'price', 'date', 'time'])

# Create a prototype instance
stock_prototype = Stock('', 0, 0.0, None, None)

# Function to convert a dictionary to a Stock
def dict_to_stock(s):
    return stock_prototype._replace(**s)
```

下面是它的使用方法：

```python
>>> a = {'name': 'ACME', 'shares': 100, 'price': 123.45}
>>> dict_to_stock(a)
Stock(name='ACME', shares=100, price=123.45, date=None, time=None)
>>> b = {'name': 'ACME', 'shares': 100, 'price': 123.45, 'date': '12/17/2012'}
>>> dict_to_stock(b)
Stock(name='ACME', shares=100, price=123.45, date='12/17/2012', time=None)
>>>
```

最后要说的是，如果你的目标是定义一个需要更新很多实例属性的高效数据结构，那么命名元组并不是你的最佳选择。 这时候你应该考虑定义一个包含 `__slots__` 方法的类。


### defaultdict

*PythonCookbook*

```python
from collections import defaultdict
aa = defaultdict(list) #设置values为list类型；
aa['name'] = 'sun'
aa['name'] = 'wei'
aa['name2'].append('qqqq')   
aa['name2'].append('tttt')
print(aa.items())   #dict_items([('name2', ['qqqq', 'tttt']), ('name', 'wei')])

d = defaultdict(set)  #设置values为set()类型；
d['a'].add(1)
d['a'].add(2)
d['b'].add(4)
```

`defaultdict` 会自动为将要访问的键(就算目前字典中并不存在这样的键)创建映射实体。 如果你并不需要这样的特性，你可以在一个普通的字典上使用 `setdefault()` 方法来代替。比如：


```
d = {} # A regular dictionary
d.setdefault('a', []).append(1)
d.setdefault('a', []).append(2)
d.setdefault('b', []).append(4)
```

但是很多程序员觉得 `setdefault()` 用起来有点别扭。因为每次调用都得创建一个新的初始值的实例(例子程序中的空列表`[]`)。


*它处补充*

```python
from collections import defaultdict
d = defaultdict(lambda:0)   #把d中新增的key的值默认都设为0，字典自带有fromkeys()函数，但需事先指定keys
for i in range(100):
    d[i % 10] += 1
    print(d.items())   #dict_items([(0, 10), (1, 10), (2, 10), (3, 10), (4, 10), (5, 10), (6, 10), (7, 10), (8, 10), (9, 10)])
```

*廖学锋补充*

使用dict时，如果引用的Key不存在，就会抛出KeyError。如果希望key不存在时，返回一个默认值，就可以用`defaultdict`：

```py
>>> from collections import defaultdict
>>> dd = defaultdict(lambda: 'N/A')
>>> dd['key1'] = 'abc'
>>> dd['key1'] # key1存在
'abc'
>>> dd['key2'] # key2不存在，返回默认值
'N/A'
```

注意默认值是调用函数返回的，而函数在创建`defaultdict`对象时传入。
除了在Key不存在时返回默认值，`defaultdict`的其他行为跟dict是完全一样的。


**一行代码实现多层json嵌套**

```py
def tree():
    from collections import defaultdict
    return defaultdict(tree)

users = tree()

users['hardold']['username'] = 'hrldcpr'
users['hardold']['age'] = 20
users['hardold']['country']['china']['shanghai']['xuhui']['tianlin'] = '磐途'

print(users)

import json

d = json.dumps(users)
print(d)  #{"hardold": {"age": 20, "username": "hrldcpr", "country": {"china": {"shanghai": {"xuhui": {"tianlin": "\u78d0\u9014"}}}}}}
```


### deque - 固定长度队列


> As a general rule, if you need fast appends or fast pops, use a deque. If you need fast random access, use a list.


```py
from collections import deque 
 
def get_last(filename, n=5):
    """
    Returns the last n lines from the file
    """
    try:
        with open(filename) as f:
            return deque(f, n)
    except OSError:
        print("Error opening file: {}".format(filename))
        raise
```

*廖雪峰*

使用list存储数据时，按索引访问元素很快，但是插入和删除元素就很慢了，因为list是线性存储，数据量大的时候，插入和删除效率很低。
`deque`是为了高效实现插入和删除操作的双向列表，适合用于队列和栈：

```py
>>> from collections import deque
>>> q = deque(['a', 'b', 'c'])
>>> q.append('x')
>>> q.appendleft('y')
>>> q
deque(['y', 'a', 'b', 'c', 'x'])
```

`deque`除了实现list的`append()`和`pop()`外，还支持`appendleft()`和`popleft()`，这样就可以非常高效地往头部添加或删除元素。


*PythonCookbook*

**保留目标行的前5行**

保留有限历史记录正是 `collections.deque` 大显身手的时候。比如，下面的代码在多行上面做简单的文本匹配， 并只返回在前N行中匹配成功的行：

```py
from collections import deque

def search(lines, pattern, history=5):
    previous_lines = deque(maxlen=history)
    for li in lines:
        if pattern in li:
            yield li, previous_lines
        previous_lines.append(li)

# Example use on a file
if __name__ == '__main__':
with open(r'../../cookbook/somefile.txt') as f:
for line, prevlines in search(f, 'python', 5):
    for pline in prevlines:
        print(pline, end='')
    print(line, end='')
    print('-' * 20)
```

**讨论**

我们在写查询元素的代码时，通常会使用包含 yield 表达式的生成器函数，也就是我们上面示例代码中的那样。 
这样可以将搜索过程代码和使用搜索结果代码解耦。

使用 `deque(maxlen=N)`构造函数会新建一个固定大小的队列。当新的元素加入并且这个队列已满的时候， 最老的元素会自动被移除掉。


更一般的， `deque` 类可以被用在任何你只需要一个简单队列数据结构的场合。 如果你不设置最大队列大小，那么就会得到一个无限大小队列，你可以在队列的两端执行添加和弹出元素的操作。


在队列两端插入或删除元素时间复杂度都是 O(1) ，而在列表的开头插入或删除元素的时间复杂度为 O(N) 。


### OrderedDict

>  需要注意的是，一个 OrderedDict 的大小是一个普通字典的两倍，因为它内部维护着另外一个链表。 


- 廖学锋：
使用dict时，Key是无序的。在对dict做迭代时，我们无法确定Key的顺序。
如果要保持Key的顺序，可以用OrderedDict：

```py
>>> from collections import OrderedDict
>>> d = dict([('a', 1), ('b', 2), ('c', 3)])
>>> d # dict的Key是无序的
{'a': 1, 'c': 3, 'b': 2}
>>> od = OrderedDict([('a', 1), ('b', 2), ('c', 3)])
>>> od # OrderedDict的Key是有序的
OrderedDict([('a', 1), ('b', 2), ('c', 3)])
```

注意，`OrderedDict`的Key会按照插入的顺序排列，不是Key本身排序：

```py
>>> od = OrderedDict()
>>> od['z'] = 1
>>> od['y'] = 2
>>> od['x'] = 3
>>> list(od.keys()) # 按照插入的Key的顺序返回
['z', 'y', 'x']
```

`OrderedDict`可以实现一个FIFO（先进先出）的dict，当容量超出限制时，先删除最早添加的Key：

```py
#代码见github 0925.ipynb

from collections import OrderedDict

class O(OrderedDict):
    def __init__(self, maxlen):
        super(O, self).__init__()
        self._maxlen = maxlen
    def __setitem__(self, key, value):
        in_or_notin = 1 if key in self else 0
        if len(self) - in_or_notin >= self._maxlen:
            print('满了，要删掉一个')
            last = self.popitem(last=False) #True是LIFO
            print('remove:', last)
        if in_or_notin:
            print('删掉原先的然后set操作~')
            del self[key]
            print('set:', (key, value))
        else:
            print('add:', (key, value))
        OrderedDict.__setitem__(self, key, value)
```

### Counter

- 廖学锋：

Counter是一个简单的计数器，例如，统计字符出现的个数：

```py
>>> from collections import Counter
>>> c = Counter()
>>> for ch in 'programming':
...     c[ch] = c[ch] + 1
...
>>> c
Counter({'g': 2, 'm': 2, 'r': 2, 'a': 1, 'i': 1, 'o': 1, 'n': 1, 'p': 1})
```

`Counter`实际上也是dict的一个子类，上面的结果可以看出，字符'g'、'm'、'r'各出现了两次，其他字符各出现了一次。


- PythonCookbook

序列中出现次数最多的元素
`collections.Counter` 类就是专门为这类问题而设计的， 它甚至有一个有用的 `most_common()` 方法直接给了你答案。


为了演示，先假设你有一个单词列表并且想找出哪个单词出现频率最高。你可以这样做：

```py
words = [
'look', 'into', 'my', 'eyes', 'look', 'into', 'my', 'eyes',
'the', 'eyes', 'the', 'eyes', 'the', 'eyes', 'not', 'around', 'the',
'eyes', "don't", 'look', 'around', 'the', 'eyes', 'look', 'into',
'my', 'eyes', "you're", 'under'
]

from collections import Counter

word_counts = Counter(words)

# 出现频率最高的3个单词
top_three = word_counts.most_common(3)
print(top_three)

# Outputs [('eyes', 8), ('the', 5), ('look', 4)]
```

**讨论**

作为输入， `Counter` 对象可以接受任意的 hashable 序列对象。 在底层实现上，一个 `Counter` 对象就是一个字典，将元素映射到它出现的次数上。比如：

```py
>>> word_counts['not']
1
>>> word_counts['eyes']
8
>>>
```

如果你想手动增加计数，可以简单的用加法：

```py
>>> morewords = ['why','are','you','not','looking','in','my','eyes']
>>> for word in morewords:
... word_counts[word] += 1
...
>>> word_counts['eyes']
9
>>>
```

或者你可以使用 `update()` 方法：

```py
>>> word_counts.update(morewords)
>>>
```

`Counter` 实例一个鲜为人知的特性是它们可以很容易的跟数学运算操作相结合。比如：

```py
>>> a = Counter(words)
>>> b = Counter(morewords)
>>> a
Counter({'eyes': 8, 'the': 5, 'look': 4, 'into': 3, 'my': 3, 'around': 2,
"you're": 1, "don't": 1, 'under': 1, 'not': 1})
>>> b
Counter({'eyes': 1, 'looking': 1, 'are': 1, 'in': 1, 'not': 1, 'you': 1,
'my': 1, 'why': 1})
>>> # Combine counts
>>> c = a + b
>>> c
Counter({'eyes': 9, 'the': 5, 'look': 4, 'my': 4, 'into': 3, 'not': 2,
'around': 2, "you're": 1, "don't": 1, 'in': 1, 'why': 1,
'looking': 1, 'are': 1, 'under': 1, 'you': 1})
>>> # Subtract counts
>>> d = a - b
>>> d
Counter({'eyes': 7, 'the': 5, 'look': 4, 'into': 3, 'my': 2, 'around': 2,
"you're": 1, "don't": 1, 'under': 1})
>>>
```

毫无疑问， `Counter` 对象在几乎所有需要制表或者计数数据的场合是非常有用的工具。 在解决这类问题的时候你应该优先选择它，而不是手动的利用字典去实现。


### ChainMap - 合并多个字典或映射

- PythonCookbook

假如你有如下两个字典:


a = {'x': 1, 'z': 3 }
b = {'y': 2, 'z': 4 }


现在假设你必须在两个字典中执行查找操作(比如先从 a 中找，如果找不到再在 b 中找)。 一个非常简单扼解决方案就是使用 collections 模块中的 `ChainMap` 类。比如：

```py
from collections import ChainMap
c = ChainMap(a,b)
print(c['x']) # Outputs 1 (from a)
print(c['y']) # Outputs 2 (from b)
print(c['z']) # Outputs 3 (from a)
```

**讨论**

一个 `ChainMap` 接受多个字典并将它们在逻辑上变为一个字典。 然后，这些字典并不是真的合并在一起了， 
`ChainMap` 类只是在内部创建了一个容纳这些字典的列表 并重新定义了一些常见的字典操作来遍历这个列表。大部分字典操作都是可以正常使用的，比如：

```py
>>> len(c)
3
>>> list(c.keys())
['x', 'y', 'z']
>>> list(c.values())
[1, 2, 3]
>>>
```

如果出现重复键，那么第一次出现的映射值会被返回。 因此，例子程序中的 `c['z']` 总是会返回字典 a 中对应的值，而不是 b 中对应的值。


对于字典的更新或删除操作总是影响的是列表中第一个字典。比如：

```py
>>> c['z'] = 10
>>> c['w'] = 40
>>> del c['x']
>>> a
{'w': 40, 'z': 10}
>>> del c['y']
Traceback (most recent call last):
...
KeyError: "Key not found in the first mapping: 'y'"
>>>
```

`ChainMap` 对于编程语言中的作用范围变量(比如 globals , locals 等)是非常有用的。 事实上，有一些方法可以使它变得简单：

```py
>>> values = ChainMap()
>>> values['x'] = 1
>>> # Add a new mapping
>>> values = values.new_child()
>>> values['x'] = 2
>>> # Add a new mapping
>>> values = values.new_child()
>>> values['x'] = 3
>>> values
ChainMap({'x': 3}, {'x': 2}, {'x': 1})
>>> values['x']
3
>>> # Discard last mapping
>>> values = values.parents
>>> values['x']
2
>>> # Discard last mapping
>>> values = values.parents
>>> values['x']
1
>>> values
ChainMap({'x': 1})
>>>
```

作为 `ChainMap` 的替代，你可能会考虑使用 `update()` 方法将两个字典合并。比如：

```py
>>> a = {'x': 1, 'z': 3 }
>>> b = {'y': 2, 'z': 4 }
>>> merged = dict(b)
>>> merged.update(a)
>>> merged['x']
1
>>> merged['y']
2
>>> merged['z']
3
>>>
```

这样也能行得通，但是它需要你创建一个完全不同的字典对象(或者是破坏现有字典结构)。 同时，如果原字典做了更新，这种改变不会反应到新的合并字典中去。比如：

```py
>>> a['x'] = 13
>>> merged['x']
1
```

ChainMap 

使用原来的字典，它自己不创建新的字典。所以它并不会产生上面所说的结果，比如：

```py
>>> a = {'x': 1, 'z': 3 }
>>> b = {'y': 2, 'z': 4 }
>>> merged = ChainMap(a, b)
>>> merged['x']
1
>>> a['x'] = 42
>>> merged['x'] # Notice change to merged dicts
42
```

- 实例

```py
import os
import argparse
from collections import ChainMap

def main():
  app_defaults = {'username': 'admin', 'passwd':'admin'}

    parser = argparse.ArgumentParser()
    parser.add_argument('-u', '--username')
    parser.add_argument('-p', '--passwd')
    args = parser.parse_args()
    command_line_arguments = {key:value for key, value in vars(args).items() if value}

    chain = ChainMap(command_line_arguments, os.environ, app_defaults)
    print(chain['username'])

if __name__=='__main__':
  main()
    os.environ['username'] = 'su'
  main()

#python test.py
# sun
# su
# 
#python test.py -u aaaa
# aaaa
# aaaa
```

### Iterable - 判断一个对象是否可迭代

- PythonCookbook：


**问题**

你想将一个多层嵌套的序列展开成一个单层列表


解决方案
可以写一个包含 yield from 语句的递归生成器来轻松解决这个问题。比如：

```py
from collections import Iterable

def flatten(items, ignore_types=(str, bytes)):
for x in items:
    if isinstance(x, Iterable) and not isinstance(x, ignore_types):
        yield from flatten(x)
    else:
        yield x


items = [1, 2, [3, 4, [5, 6], 7], 8]
# Produces 1 2 3 4 5 6 7 8
for x in flatten(items):
    print(x)
```

在上面代码中， `isinstance(x, Iterable)` 检查某个元素是否是可迭代的。 如果是的话， `yield from` 就会返回所有子例程的值。最终返回结果就是一个没有嵌套的简单序列了。


额外的参数 `ignore_types` 和检测语句 `isinstance(x, ignore_types)` 用来将字符串和字节排除在可迭代对象外，防止将它们再展开成单个的字符。 这样的话字符串数组就能最终返回我们所期望的结果了。比如：

```py
>>> items = ['Dave', 'Paula', ['Thomas', 'Lewis']]
>>> for x in flatten(items):
...     print(x)
...
Dave
Paula
Thomas
Lewis
>>>
```

**讨论**

语句 `yield from` 在你想在生成器中调用其他生成器作为子例程的时候非常有用。 如果你不使用它的话，那么就必须写额外的 for 循环了。比如：

```py
def flatten(items, ignore_types=(str, bytes)):
    for x in items:
        if isinstance(x, Iterable) and not isinstance(x, ignore_types):
            for i in flatten(x):
                yield i
        else:
            yield x
```

尽管只改了一点点，但是 `yield from` 语句看上去感觉更好，并且也使得代码更简洁清爽。


之前提到的对于字符串和字节的额外检查是为了防止将它们再展开成单个字符。 如果还有其他你不想展开的类型，修改参数 `ignore_types` 即可。


最后要注意的一点是， `yield from `在涉及到基于协程和生成器的并发编程中扮演着更加重要的角色。 
