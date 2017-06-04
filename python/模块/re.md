

- [Python 正则表达式指南](http://www.cnblogs.com/huxi/archive/2010/07/04/1771073.html)



## tips


*查找中文字*

```
...
re.findall(u'([\u4e00-\u9fa5]+)', text)
...
```

*过滤非404开头的行*


```
p = re.compile(r'^404')
if not p.search(line):
    pass
……
```
