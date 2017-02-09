# 找明星问题
# 10个人中只有一个明星，大家都认识明星，明星不认识任何人。

from random import randrange


def naive_celeb(G):
    n = len(G)
    for u in range(n):
        for v in range(n):
            if u == v: continue
            if G[u][v]: break
            if not G[v][u]: break
        else:
            return u

#优化思路：G[u][v]为真，说明u肯定不是明星，否则v肯定不是明星
def celeb(G):
    u,v = 0,1
    n = len(G)
    for c in range(2,n+1): #从第3个开始 以次判断
        if G[u][v]:  #如果u认识v，则u肯定不是明星，往后累加
            u = c
        else:
            v = c #否则u可能是明星，v肯定不是明星，往后累加
    if u == n: #累加到最后，只剩下u和v，u不是明星，说明v是明星
        c = v
    else:
        c = u

    #其实到这里已经能确定c就是明星了，下面的过程再判断一遍

    for v in range(n):
        if c == v:
            continue
        if G[c][v]: break
        if not G[v][c]: break
    else:
        return c
    return None


n = 10 #人数

# 构造数据结构，使用二维数组
G = [[randrange(2) for i in range(10)] for i in range(10)]

c = randrange(10) # 指定一位明星
print(c)

#设置关系
for i in range(10):
    G[i][c] = True #所有人都认识明星
    G[c][i] = False #明星不认识所有人

for i in G:
    print(i)

cc = naive_celeb(G)
print(cc)

cc = celeb(G)
print(cc)