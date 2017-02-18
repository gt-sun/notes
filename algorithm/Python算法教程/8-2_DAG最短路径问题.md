
如图：

![](http://o85fa3d0v.bkt.clouddn.com/github/DAG最短路径.jpg)


代码：

```py

def dag_sp(W, s, t):
    d = {u:float('inf') for u in W}
    d[s] = 0
    for u in topsort(W): #topsort函数参考拓扑排序章节
        if u == t: break
        for v in W[u]:
            d[v] = min(d[v], d[u] + W[u][v])
    return d[t]

def topsort(G):
    count = dict((u,0) for u in G)
    for u in G:
        for v in G[u]:
            count[v] += 1
    Q = [u for u in G if count[u] == 0]
    S = []
    while Q:
        u = Q.pop()
        S.append(u)
        for v in G[u]:
            count[v] -= 1
            if count[v] == 0:
                Q.append(v)
    return S


W = {
    "a":{"f":9,"b":2},
    "b":{"c":1,"d":2,"f":6},
    "c":{"d":7},
    "d":{"e":2,"f":3},
    "e":{"f":4},
    "f":{},
}

res = dag_sp(W,"a","f")
print(res) # 7

```