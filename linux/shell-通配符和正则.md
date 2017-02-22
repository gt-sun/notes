


### rm 批量删除

删除b和bb下的文件：

```
# rm -f a/{b,bb}/index
```


### bash 匹配IP


> shell 和其它编程语言一样，也可以使用正则分组捕获，不过不能使用 $1 或 \ 1 这样的形式来捕获分组，可以通过数组 `${BASH_REMATCH}` 来获得，如 `${BASH_REMATCH[1]}`，`${BASH_REMATCH[N]}`


下面以 ip="121.0.2.2" 为例，shell 脚本代码如下（当然，你要做成更通用交互式的脚本，可以通过 expect 来实现）：


```
#!/bin/bash
ip="121.0.2.2"
if [[ $ip =~ ^([0-9]{1,2}|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.([0-9]{1,2}|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.([0-9]{1,2}|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.([0-9]{1,2}|1[0-9][0-9]|2[0-4][0-9]|25[0-5])$ ]]
then
    echo "Match"
    echo ${BASH_REMATCH[1]}
    echo ${BASH_REMATCH[2]}
    echo ${BASH_REMATCH[3]}
    echo ${BASH_REMATCH[4]}
else
    echo "Not match"
fi
```




### bash 通配符


```
Bash 的通配符：
1.  ?   匹配单个字符，ls -l aa?b.txt
2.  *    匹配任意个字符  ls -l aa*b.txt
3.  []   匹配中括号中的任意一个字符 ls -l aa[trh]b.txt,   ls -l aa[a-d]b.txt
4.  {}   一组表达式，用逗号, 隔开，只要满足其中一条即可  ls -l ls{[ro]*a,[s-v]}*a
5.  ^    在 [] 中使用，表示不等于这里面内容的，注意：是完全匹配，跟正则表达式不一样  ls -l [^myconfig]*.txt
6.  GOLBIGNORE  内部变量 GLOBIGNORE 保存了通配时所忽略的文件名集合
```


在 bash 4.0 以上版本中，如果 bash 环境开启了 globstar 设置，那么两个连续的 `**` 可以用来递归匹配某目录下所有的文件名。我们通过一个实验测试一下：


一个目录的结构如下：


```
[zorro@zorrozou-pc0 bash]$ tree test/
test/
├── 1
├── 2
├── 3
├── 4
├── a
│   ├── 1
│   ├── 2
│   ├── 3
│   └── 4
├── a.conf
├── b
│   ├── 1
│   ├── 2
│   ├── 3
│   └── 4
├── b.conf
├── c
│   ├── 5
│   ├── 6
│   ├── 7
│   └── 8
└── d
    ├── 1.conf
    └── 2.conf


4 directories, 20 files
```


使用通配符进行文件名匹配：


```
[zorro@zorrozou-pc0 bash]$ echo test/*
test/1 test/2 test/3 test/4 test/a test/a.conf test/b test/b.conf test/c test/d
[zorro@zorrozou-pc0 bash]$ echo test/*.conf
test/a.conf test/b.conf
```


这个结果大家应该都熟悉。我们再来看看下面：


查看当前 globstar 状态：


```
[zorro@zorrozou-pc0 bash]$ shopt globstar
globstar        off
```


打开 globstar：


```
[zorro@zorrozou-pc0 bash]$ shopt -s globstar
[zorro@zorrozou-pc0 bash]$ shopt globstar
globstar        on
```


使用 ** 匹配：


```
[zorro@zorrozou-pc0 bash]$ echo test/**
test/ test/1 test/2 test/3 test/4 test/a test/a/1 test/a/2 test/a/3 test/a/4 test/a.conf test/b test/b/1 test/b/2 test/b/3 test/b/4 test/b.conf test/c test/c/5 test/c/6 test/c/7 test/c/8 test/d test/d/1.conf test/d/2.conf
[zorro@zorrozou-pc0 bash]$ echo test/**/*.conf
test/a.conf test/b.conf test/d/1.conf test/d/2.conf
```


关闭 globstart 并再次测试 **：


```
[zorro@zorrozou-pc0 bash]$ shopt -u globstar
[zorro@zorrozou-pc0 bash]$ shopt  globstar
globstar        off


[zorro@zorrozou-pc0 bash]$ echo test/**/*.conf
test/d/1.conf test/d/2.conf
[zorro@zorrozou-pc0 bash]$
[zorro@zorrozou-pc0 bash]$ echo test/**
test/1 test/2 test/3 test/4 test/a test/a.conf test/b test/b.conf test/c test/d
```


[...] 表示这个范围中的任意一个字符。比如 [abcd]，表示 a 或 b 或 c 或 d 。当然这也可以写成 [a-d]。[a-z] 表示任意一个小写字母。还是刚才的 test 目录，我们再来试试：


```
[zorro@zorrozou-pc0 bash]$ ls test/[123]
test/1  test/2  test/3
[zorro@zorrozou-pc0 bash]$ ls test/[abc]
test/a:
1  2  3  4


test/b:
1  2  3  4


test/c:
5  6  7  8
```


以上就是简单的三个通配符的说明。当然，关于通配符以及 shopt 命令还有很多相关知识。我们还是会在后续的文章中单独把相关知识点拿出来讲，再这里大家先理解这几个。另外需要强调一点，千万不要把 bash 的通配符和正则表达式搞混了，它们完全没有关系！