
http://blog.csdn.net/raphealguo/article/details/7560918


算法目的：
对一个连通图进行遍历的算法。



## 深度优先搜索DFS

它的思想是从一个顶点 V0 开始，沿着一条路一直走到底，如果发现不能到达目标解，那就返回到上一个节点，然后从另一条路开始走到底，这种尽量往深处走的概念即是深度优先的概念。

![](http://o85fa3d0v.bkt.clouddn.com/github/邻接图01.jpg)

代码1：迭代版DFS

```py
def iter_dfs(G,s):
    S,Q = set(),[]
    Q.append(s)
    while Q:
        u = Q.pop()
        if u in S: continue #S的作用是记录已经遍历过的节点，避免环路
        S.add(u)
        Q.extend(G[u])
        yield u

a,b,c,d,e,f,g,h = range(8)
G = [
    [b,c,d,e,f], #a
    [c,e],
    [d],
    [e],
    [f],
    [c,g,h],
    [f,h],
    [f,g], #h
]

```

输出：`[0, 5, 7, 6, 2, 3, 4, 1]`
这里的输出跟G里子数组的元素先后有关。


## 广度优先搜索BFS

与DFS唯一显著的区别就是将`LIFO`替换成了`FIFO`，结果就是先被访问到的节点会率先完成探索。不再需要对任何边和节点进行多次访问，保证算法的线性级性能。

```py
def bfs(G,s):
    P,Q = {s:None},deque([s])
    while Q:
        u = Q.popleft()
        for v in G[u]:
            if v in P: continue
            P[v] = u
            Q.append(v)
    return P
```

`bfs函数`与`iter_dfs函数`非常相似，我们只是把list换成了deque，这次我们只需在遍历过程中只需跟踪途径节点的父节点（字典P），不需要再去记录那些已访问过的节点（之前的集合S）。

现在，如果我们要获取a到u的路径，只要直接在P中“往回倒”就行了，如下：

```py
>>> path = [u]
>>> while P[u] is not None:
        path.append(P[u])
        u = P[u]
>>> path.reverse()
```

*作用*
被用来在一个节点到另一个节点之间寻找（未加权）最短路径。


## 实际场景

1. 浏览网页是一种将DFS和BFS可视化的方式。当我们接连点过一些链接后，通过“后退”按钮回到某个页面时，我们使用的就是DFS。而BFS则更像是我们用新窗口（或标签页）在后台打开每个页面，然后在看完各页面后依次关闭窗口。