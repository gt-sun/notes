

## `Timer`

```py
import array
from timeit import Timer
 
def arraytest():
    a = array.array("i", [1, 2, 3, 4, 5])
    b = array.array(a.typecode, (2 * x for x in a))
 
def enumeratetest():
    a = array.array("i", [1, 2, 3, 4, 5])
    for i, x in enumerate(a):
        a[i] = 2 * x
 
if __name__=='__main__':
    m = Timer(arraytest)
    n = Timer("enumeratetest()", "from __main__ import enumeratetest")
    # 以上2种方式等效
     
    print(m.timeit()) # 5.22479210582
    print(n.timeit()) # 4.34367196717
```