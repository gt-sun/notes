[TOC]


### 命令返回值


- bash 在解析字符的时候，对待 “;” 跟看见回车是一样的行为。


- bash 编程仍然贯彻了 C 程序的设计哲学，即：一切皆表达式。一切皆表达式这个设计原则，确定了 shell 在执行任何东西（注意是任何东西，不仅是命令）的时候都会有一个返回值，因为根据表达式的定义，任何表达式都必须有一个值。在 bash 编程中，这个返回值也限定了取值范围： 0-255 。跟 C 语言含义相反， bash 中 0 为真（ true ），非 0 为假（ false ）。


```
[zorro@zorrozou-pc0 ~]$ ls /123|wc -l
ls: cannot access '/123': No such file or directory
0
[zorro@zorrozou-pc0 ~]$ echo $?
0
```
这是一个 list 的执行，其实就是两个命令简单的用管道串起来。我们发现，这时 shell 会将整个 list 看作一个执行体，所以整个 list 就是一个表达式，那么最后只返回一个值 0 ，这个值是整个 list 中最后一个命令的返回值，第一个命令执行失败并不影响后面的 wc 统计行数，所以逻辑上这个 list 执行成功，返回值为真。


### if结构


```
#!/bin/bash


DIR="/etc"
#第一种写法
ls -l $DIR &> /dev/null
ret=$?


if [ $ret -eq 0 ]
then
        echo "$DIR exists!"
else
        echo "$DIR does not exist!"
fi


#第二种写法
if ls -l $DIR &> /dev/null
then
        echo "$DIR exists!"
else
        echo "$DIR does not exist!"
fi
```
我曾经在无数的脚本中看到这里的第一种写法，先执行某个命令，然后记录其返回值，再使用 [] 进行分支判断。我想，这样写的人应该都是没有真正理解 if 语法的语义，导致做出了很多脱了裤子再放屁的事情。当然，if 语法中后面最常用的命令就是 []。


我们在其他人写的程序里也经常能看到类似这样的判断处理：


```
if [ x$1 = x"zorro" ] && [ x$2 = x"zorro" ]
```


相信你也能明白为什么要这么处理了。仅对某一个判断来说这似乎没什么必要，但是如果你养成了这样的习惯，那么就能让你避免很多可能出问题的环节。这就是编程经验和编程习惯的重要性。


### while结构


我们用 while 和 unitl 来产生一个 0-99 的数字序列：


```
while 版：


#!/bin/bash


count=0


while [ $count -le 100 ]
do
    echo $count
    count=$[$count+1]
done


until 版：


#!/bin/bash


count=0


until ! [ $count -le 100 ]
do
    echo $count
    count=$[$count+1]
done
```
我们通过这两个程序可以再次对比一下 while 和 until 到底有什么不一样？其实它们从形式上完全一样。这里另外说明两个知识点：


在 bash 中，叹号（!）代表对命令 (表达式) 的返回值取反。就是说如果一个命令或 list 或其它什么东西如果返回值为真，加了叹号之后就是假，如果是假，加了叹号就是真。


在 bash 中，使用 $[] 可以得到一个算数运算的值。可以支持常用的 5 则运算（+-/%）。用法就是 $[3+7] 类似这样，而且要注意，这里的 $[] 里面没有空格分隔，因为它并不是个 shell 命令，而是特殊字符。


注意这个运算只支持整数，并且对于小数只取其整数部分（没有四舍五入，小数全舍）。这个计算方法是 bash 提供的基础计算方法，如果想要实现更高级的计算可以使用 let 命令。如果想要实现浮点数运算，我一般使用 awk 来处理。


-


假设我们想写一个脚本检查一台服务器是否能 ping 通？如果能 ping 通，则每隔一秒再看一次，如果发现 ping 不通了，就报警。如果什么时候恢复了，就再报告恢复。就是说这个脚本会一直检查服务器状态， ping 失败则触发报警， ping 恢复则通告恢复。脚本内容如下：
```
#!/bin/bash


IPADDR='10.0.0.1'
INTERVAL=1


while true
do
    while ping -c 1 $IPADDR &> /dev/null
    do
        sleep $INTERVAL
    done


    echo "$IPADDR ping error! " 1>&2


    until ping -c 1 $IPADDR &> /dev/null
    do
        sleep $INTERVAL
    done


    echo "$IPADDR ping ok!"
done


```




### case分支


举几个几个简单的例子，并且它们实际上是一样的：


例 1:


```
#!/bin/bash


case $1 in
    (zorro)
    echo "hello zorro!"
    ;;
    (jerry)
    echo "hello jerry!"
    ;;
    (*)
    echo "get out!"
    ;;
esac
```


例 2:


```
#!/bin/bash


case $1 in
    zorro)
    echo "hello zorro!"
    ;;
    jerry)
    echo "hello jerry!"
    ;;
    *)
    echo "get out!"
    ;;
esac
```


例 3:


```
#!/bin/bash


case $1 in
    zorro|jerry)
    echo "hello $1!"
    ;;
    *)
    echo "get out!"
    ;;
esac
```


这些程序的执行结果都是一样的.


### select结构


select 提供给了我们一个构建交互式菜单程序的方式，如果没有 select 的话，我们在 shell 中写交互的菜单程序是比较麻烦的。它的语法结构是：


```
select name [ in word ] ; do list ; done
```


还是来看看例子：


```
#!/bin/bash


select i in a b c d
do
    echo $i
done
```


这个程序执行的效果是：


```
[zorro@zorrozou-pc0 bash]$ ./select.sh
1) a
2) b
3) c
4) d
#?
```


你会发现 select 给你构造了一个交互菜单，索引为 1 ， 2 ， 3 ， 4 。对应的名字就是程序中的 a ， b ， c ， d 。之后我们就可以在后面输入相应的数字索引，选择要 echo 的内容：


```
[zorro@zorrozou-pc0 bash]$ ./select.sh 
1) a
2) b
3) c
4) d
#? 1
a
#? 2
b
#? 3
c
#? 4
d
#? 6


#? 
1) a
2) b
3) c
4) d
#? 
1) a
2) b
3) c
4) d
#? 
```


如果输入的不是菜单描述的范围就会 echo 一个空行，如果直接输入回车，就会再显示一遍菜单本身。当然我们会发现这样一个菜单程序似乎没有什么意义，实际程序中， select 大多数情况是跟 case 配合使用的。


```
#!/bin/bash


select i in a b c d
do
    case $i in
        a)
        echo "Your choice is a"
        ;;
        b)
        echo "Your choice is b"
        ;;
        c)
        echo "Your choice is c"
        ;;
        d)
        echo "Your choice is d"
        ;;
        *)
        echo "Wrong choice! exit!"
        exit
        ;;
    esac
done
```


执行结果为：


```
[zorro@zorrozou-pc0 bash]$ ./select.sh 
1) a
2) b
3) c
4) d
#? 1
Your choice is a
#? 2
Your choice is b
#? 3
Your choice is c
#? 4
Your choice is d
#? 5
Wrong choice! exit!
```


这就是 select 的常见用法。




### 附录

#### [[ ]]和[]

```
# num=a
# [[ $num > 98 ]] && echo ok
ok
```

a的ascii是97，为什么97>98?
因为字符串和数字比较，会先比较首个字符，如果一样再往后依次比较,这里实际是97>9。
 `[[` 只适用于字符串，不能做数字比较！
 
- `[[]]` 使用&&,||

- `[]` 使用-a,-o


#### if 判断概要

```
# 1
[[ ! y =~ ^[y,n]$ ]] && echo error

正则匹配   ! 取反；
~ 使用正则
^$  开头，结尾
[y,n]  y或n  | 也支持

# 2 if后面直接接命令
if grep -Eqi "CentOS" /etc/issue || grep -Eq "CentOS" /etc/*-release; then

# 3 if后面接命令返回值的判断
if [[ `getconf WORD_BIT` = '32' && `getconf LONG_BIT` = '64' ]] ; then
```

#### 速查表

```
二、文件/文件夹(目录)判断
[ -b FILE ] 如果 FILE 存在且是一个块特殊文件则为真。
[ -c FILE ] 如果 FILE 存在且是一个字特殊文件则为真。
[ -d DIR ] 如果 FILE 存在且是一个目录则为真。
[ -e FILE ] 如果 FILE 存在则为真。
[ -f FILE ] 如果 FILE 存在且是一个普通文件则为真。
[ -g FILE ] 如果 FILE 存在且已经设置了SGID则为真。
[ -k FILE ] 如果 FILE 存在且已经设置了粘制位则为真。
[ -p FILE ] 如果 FILE 存在且是一个名字管道(F如果O)则为真。
[ -r FILE ] 如果 FILE 存在且是可读的则为真。
[ -s FILE ] 如果 FILE存在且大小不为0则为真。</font>
[ -t FD ] 如果文件描述符 FD 打开且指向一个终端则为真。
[ -u FILE ] 如果 FILE 存在且设置了SUID (set user ID)则为真。
[ -w FILE ] 如果 FILE存在且是可写的则为真。
[ -x FILE ] 如果 FILE 存在且是可执行的则为真。
[ -O FILE ] 如果 FILE 存在且属有效用户ID则为真。
[ -G FILE ] 如果 FILE 存在且属有效用户组则为真。
[ -L FILE ] 如果 FILE 存在且是一个符号连接则为真。
[ -N FILE ] 如果 FILE 存在 and has been mod如果ied since it was lastread则为真。
[ -S FILE ] 如果 FILE 存在且是一个套接字则为真。
[ FILE1 -nt FILE2 ] 如果 FILE1 has been changed more recentlythan FILE2, or 如果 FILE1 exists and FILE2 does not则为真。
[ FILE1 -ot FILE2 ] 如果 FILE1 比 FILE2 要老, 或者 FILE2 存在且 FILE1不存在则为真。
[ FILE1 -ef FILE2 ] 如果 FILE1 和 FILE2 指向相同的设备和节点号则为真。

三、字符串判断
[ -z STRING ] 如果STRING的长度为零则为真 ，即判断是否为空，空即是真；
[ -n STRING ] 如果STRING的长度非零则为真 ，即判断是否为非空，非空即是真；
[ STRING1 = STRING2 ] 如果两个字符串相同则为真 ；
[ STRING1 != STRING2 ] 如果字符串不相同则为真 ；
[ STRING1 ]　 如果字符串不为空则为真,与-n类似

两值比较 {

            整数     字符串
            -lt      <         # 小于
            -gt      >         # 大于
            -le      <=        # 小于或等于
            -ge      >=        # 大于或等于
            -eq      ==        # 等于
            -ne      !=        # 不等于

        }
```









