
http://blog.csdn.net/raphealguo/article/details/7560918


算法目的：
对一个连通图进行遍历的算法。

## 广度优先搜索BFS


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