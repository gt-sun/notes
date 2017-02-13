#最大子数组
#面试常客

#问题：一个数组，有正有负，计算其中最大子数组


#暴力法
def MaxSub(G):
    n = len(G)
    res = max((G[i:j] for i in range(n) for j in range(i+1,n+1)),key=sum)
    return sum(res)



# 线性法
#该算法在每次元素累加和小于 0 时，从下一个元素重新开始累加。
def MaxSub2(G):
    n = len(G)
    Max,Cur = 0,0
    for i in range(n):
        Cur += G[i]
        if Cur > Max:
            Max = Cur
            index = i
        if Cur < 0:
            Cur = 0
    return Max

G = [2,4,-7,5,2,-1,2,-4,3]
res = MaxSub2(G)
print(res)
