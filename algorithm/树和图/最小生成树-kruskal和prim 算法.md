

## kruskal

链接：
1. http://baike.baidu.com/view/247951.htm

*释义*
求加权连通图的最小生成树的算法。kruskal 算法总共选择 n- 1 条边，（共 n 个点）所使用的贪心准则是：从剩下的边中选择一条不会产生环路的具有最小耗费的边加入已选择的边的集合中。注意到所选取的边若产生环路则不可能形成一棵生成树。kruskal 算法分 e 步，其中 e 是网络中边的数目。按耗费递增的顺序来考虑这 e 条边，每次考虑一条边。当考虑某条边时，若将其加入到已选边的集合中会出现环路，则将其抛弃，否则，将它选入。


如图：

![](http://o85fa3d0v.bkt.clouddn.com/github/kruskal示例图.jpg)

C：映射变量，包含所有节点的指向；
u：节点

```py
#《Python算法教程》7.4.3
def find(C, u):
    if C[u] != u:
        C[u] = find(C, C[u])
    return C[u]

def union(C, R, u, v):
    u, v = find(C, u), find(C, v)
    if R[u] > R[v]:
        C[v] = u
    else:
        C[u] = v
    if R[u] == R[v]:
        R[v] += 1

def kruskal(G):
    E = [(G[u][v], u, v) for u in G for v in G[u]]
    T = set()
    C, R = {u:u for u in G}, {u:0 for u in G}
    for _, u, v, in sorted(E):
        if find(C, u) != find(C, v):
            T.add((u,v))
            union(C, R, u, v)
    return T

C = {
    "A":{"D":5,"B":7},
    "B":{"A":7,"C":8,"D":9,"E":7},
    "C":{"B":8,"E":5},
    "D":{"A":5,"B":9,"E":15,"F":6},
    "E":{"B":7,"C":5,"D":15,"F":8,"G":9},
    "F":{"D":6,"E":8,"G":11},
    "G":{"E":9,"F":11},
}

res = kruskal(C)
print(res)  #{('E', 'G'), ('B', 'E'), ('A', 'D'), ('D', 'F'), ('C', 'E'), ('A', 'B')}
```


## prim

采用堆结构实现一个优先级队列

```py
#《Python算法教程》7.4.4
def prim(G, s):
    P, Q = {}, [(0, None, s)]
    while Q:
        _, p, u = heappop(Q)
        if u in P: continue
        P[u] = p
        for v, w in G[u].items():
            heappush(Q, (w, u, v))
    return P
```

使用上图的输出结果：`{'E': 'B', 'B': 'A', 'F': 'D', 'G': 'E', 'D': 'A', 'C': 'E', 'A': None}`