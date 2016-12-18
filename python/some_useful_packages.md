[TOC]


## Finding dead code with `Vulture`

https://pypi.python.org/pypi/vulture

For example, given this small bit of Python

```py
def fn(): 
    x = 1 
    return 2 
 
fn()
```

Saving that and running vulture against it will give me the following output.

```
$ vulture code.py  
code.py:2: Unused variable 'x' 
```