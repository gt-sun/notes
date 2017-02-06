
来自：http://ahalei.blog.51cto.com/4767671/1371613

规则：首先将第 1 个数删除，紧接着将第 2 个数放到这串数的末尾，再将第 3 个数删除并将第 4 个数再放到这串数的末尾，再将第 5 个数删除…… 直到剩下最后一个数，将最后一个数也删除。按照刚才删除的顺序，把这些删除的数连在一起就是 QQ 啦。加密过的一串数是 “6 3 1 75 8 9 2 4”，计算QQ号码。


代码1：

简单粗暴，使用数组切片。

```py
def qq(x):
    res = []
    while len(x) >1:
        delnum,lastnum = x[0],x[1]
        res.append(delnum)
        x = x[2:]
        x.append(lastnum)
    res.append(x[0])
    return res
```


代码2：

使用队列的思想,始终维护一段队列，在队列头和尾操作。

```py
def qq2(x):
    head,tail = 0,9
    while head < tail:
        print(x[head])
        head += 1

        if head == tail:
            break

        x.append(x[head])
        tail += 1
        head += 1
```