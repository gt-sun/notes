[TOC]

### 函数的使用

- 可以带`function fun()` 定义，也可以直接`fun()` 定义,不带任何参数。
- 参数返回，可以加`return` 返回;如果不加，将以最后一条命令运行结果，作为返回值。 `return`后跟数值n(0-255)
- 函数里面写`exit`，会直接退出整个脚本，后面的命令不再运行；
- 如果需要跳出函数继续执行下面的语句块，使用`return`；

```shell
#!/bin/bash

func(){
    echo "$1"
    return
    echo "不会执行到这里"  # 不会执行
}

func "nc"  # 传参
```

实例：函数遍历目录中所有文件包括子目录

```shell
#!/bin/bash
function traverse(){
for file in `ls $1`
      do
         if [ -d $1"/"$file ]
         then
            traverse $1"/"$file
         else
            echo $1"/"$file 
         fi
      done
   }
 
traverse "/usr/local/src"
```


### 循环语句

- 数字段形式

```
for i in {1..10}
do
   echo $i
done
```

- 详细列出（字符且项数不多）

```
for File in 1 2 3 4 5
do
    echo $File
done
```

- 对存在的文件进行循环

```
for shname in *.sh
do
    ...
done
```


- 查找循环（ls数据量太大的时候也可以用这种方法）

```
for shname in `find . -type f -name "*.sh"`
do
    ...
done
```

- ((语法循环--有点像C语法，但记得双括号

```
for((i=1;i<100;i++))
do
    ...
done
```

- seq形式 起始从1开始

```
for i in `seq 100`
do
    ...
done
```

- while循环注意为方括号[],且注意空格

```
min=1
max=100
while [ $min -le $max ]
do
    echo $min
    min=`expr $min + 1`
done
```

无限循环语法格式：

```
while :
do
    command
done
或者
while true
do
    command
done
```

按行读取文件：

`while read line;do echo "---"$line"++";done </etc/passwd`

- 双括号形式，内部结构有点像C的语法，

```
i=1
while((i<100))
do
    if((i%4==0));then
        echo $i
    fi
   ((i++))
done
```

- case

```
read -p "restart which tomcat? plz enter the number: " whichone
case "${whichone}" in
    1)
        echo "restart /app/tomcat..."
                ps -ef |grep "/app/tomcat/" |egrep -v "grep|tail" |awk '{print $2}' |xargs kill -9
                sleep 2
                /app/tomcat/bin/startup.sh
                echo "restart /app/tomcat okkkkk"
                ;;
    2)
        echo "restart /app/tomcat_8081..."
                ps -ef |grep "/app/tomcat_8081" |egrep -v "grep|tail" |awk '{print $2}' |xargs kill -9
                sleep 2
                /app/tomcat_8081/bin/startup.sh
                echo "restart /app/tomcat_8081 okkkkk"
                ;;
    *)
                echo -e "error enter!!  BYE\n"
                exit 1
esac
```


### bash 数组

**从0开始**

以下dst_dir不是一个数组

```
# dst_dir=$(find /dev/shm/ -type f -name "${filename}" -exec dirname {} \;)                  

# echo ${dst_dir}
/dev/shm/a /dev/shm

# echo ${dst_dir[@]}
/dev/shm/a /dev/shm

# echo ${#dst_dir[@]}   #打印长度
1

# echo ${#dst_dir}   #打印变量的长度
19
```

正确创建数组的方式：

```
test_211 /dev/shm/a # ls
1  2  3

test_211 /dev/shm/a # sz=($(find `pwd` -type f))  # sz 为数组
test_211 /dev/shm/a # echo ${sz[1]}
/dev/shm/a/2
test_211 /dev/shm/a # echo ${sz[0]}
/dev/shm/a/3
test_211 /dev/shm/a # echo ${sz[2]}
/dev/shm/a/1
test_211 /dev/shm/a # echo ${#sz[@]}  # 数组长度
3
```

实例：打印下面这句话中字母数不大于6的单词

```shell
#!/bin/bash
content="I am oldboy teacher welcome to oldboy training class."
new_content=`echo $content | sed 's/\.//'`
echo $new_content
arg=(`echo $new_content`)
for i in ${arg[@]}
do
if [[ ${#i} -le 6 ]];then
echo $i
fi
done
```


### 变量技巧

- 提取文件名和文件扩展名

```
# 提取文件名
file_jpg="sample.jpg"
name=${file_jpg%.*}
echo File name is: $name
输出结果：
File name is: sample

# 提取扩展名
extension=${file_jpg#*.}
echo Extension is: jpg
输出结果：
Extension is: jpg



这里有个能够提取域名不同部分的实用案例。假定URL= "www.google.com" ：
$ echo ${URL%.*} #  移除.* 所匹配的最右边的内容
www.google
$ echo ${URL%%.*} #  将从右边开始一直匹配到最左边的*. 移除（贪婪操作符）
www
$ echo ${URL#*.} #  移除 *. 所匹配的最左边的内容
google.com
$ echo ${URL##*.} #  将从左边开始一直匹配到最右边的*. 移除（贪婪操作符）
com

```

### basename和dirname

`basename`提取文件名：

```
var=/dir1/dir2/file.txt
echo $(basename $var)  # file.txt
```

如果只想文件名不想要后缀：

```
var=/dir1/dir2/file.txt
echo $(basename $var .txt)  # file
```

`dirname`提取目录名：

```
var=/dir1/dir2/file.txt
echo $(dirname $var)  # /dir1/dir2
```


### 其他有用命令


- `# man inotifywait | col -b > inotifywait.txt`   导出man手册

- strings
显示文件中可打印字符，一般用来查看非文本文件。

- cp 不覆盖

```
awk 'BEGIN {cmd="cp -i 123 /tmp/"; print"n"|cmd;}'
```

- 开启调试

```
#!/bin/bash -xv  #这样不用其他任何选项就可以启用调试
```



### 重命名

先看一个脚本：

```
#!/bin/bash
#文件名: rename.sh
#用途: 重命名 .jpg 和 .png 文件
count=1;
for img in `find . -iname '*.png' -o -iname '*.jpg' -type f -maxdepth 1`
do
new=image-$count.${img##*.}
echo "Renaming $img to $new"
mv "$img" "$new"
let count++
done

输出如下：
$ ./rename.sh
Renaming hack.jpg to image-1.jpg
Renaming new.jpg to image-2.jpg
Renaming next.png to image-3.png
```

```
将  *.JPG 更名为  *.jpg ：
$ rename *.JPG *.jpg

将文件名中的空格替换成字符“ _ ”：
$ rename 's/ /_/g' *

转换文件名的大小写：
$ rename 'y/A-Z/a-z/' *
$ rename 'y/a-z/A-Z/' *
```

### 临时文件和目录

```
# 临时文件
mktemp

#临时目录
mktemp -d

#仅仅生成文件名，不实际创建
mktemp -u

#根据模板创建
mktemp test.xxx
test.2cs
```

### split 分割文件

```
$ split -b 10k data.file
$ ls
data.file xaa xab xac xad xae xaf xag xah xai xaj

如果想以数字为后缀，可以另外使用 -d 参数。此外，
使用  -a length 可以指定后缀长度：
$ split -b 10k data.file -d -a 4

除了 k （KB）后缀，我们还可以使用 M （MB）、 G （GB）、 c （byte）、 w （word）等后缀。
$ ls
data.file x0009 x0019 x0029 x0039 x0049 x0059 x0069 x0079

使用前缀
$ split -b 10k data.file -d -a 4 split_file
$ ls
data.file split_file0002 split_file0005 split_file0008 strtok.c
split_file0000 split_file0003 split_file0006 split_file0009
split_file0001 split_file0004 split_file0007

使用行数分割
$ split -l 10 data.file
#  分割成多个文件，每个文件包含10
```

PS：`csplit` 命令可以按照指定单词或文本分割文件。



### 高级表达式

```
a=$((2>6?5:8))          # 判断两个值满足条件的赋值给变量

a='ee';b='a';echo ${!b} # 间接引用 name 变量的值

: ${a="cc"}             # 如果 a 有值则不改变, 如果 a 无值则赋值 a 变量为 cc
```


### find

```
将所有的 .mp3文件移入给定的目录：
$ find path -type f -name "*.mp3" -exec mv {} target_dir \;

将所有文件名中的空格替换为字符“ _ ”：
$ find path -type f -exec rename 's/ /_/g' {} \;
```


### systemd系列

- `systemctl`

`systemctl list-units` List loaded units;
`systemctl show docker` 查看
`systemctl show-environment` 查看环境变量
`systemctl list-dependencies nginx.service` 打印依赖


- `journalctl` 日志查看

```
# 查看所有日志（默认情况下 ，只保存本次启动的日志）
$ sudo journalctl

# 查看内核日志（不显示应用日志）
$ sudo journalctl -k

# 查看系统本次启动的日志
$ sudo journalctl -b
$ sudo journalctl -b -0# 查看上一次启动的日志（需更改设置）
$ sudo journalctl -b -1# 查看指定时间的日志
$ sudo journalctl --since="2012-10-30 18:17:16"
$ sudo journalctl --since "20 min ago"
$ sudo journalctl --since yesterday
$ sudo journalctl --since "2015-01-10" --until "2015-01-11 03:00"
$ sudo journalctl --since 09:00 --until "1 hour ago"# 显示尾部的最新10行日志
$ sudo journalctl -n

# 显示尾部指定行数的日志
$ sudo journalctl -n 20# 实时滚动显示最新日志
$ sudo journalctl -f

# 查看指定服务的日志
$ sudo journalctl /usr/lib/systemd/systemd

# 查看指定进程的日志
$ sudo journalctl _PID=1# 查看某个路径的脚本的日志
$ sudo journalctl /usr/bin/bash

# 查看指定用户的日志
$ sudo journalctl _UID=33 --since today

# 查看某个 Unit 的日志
$ sudo journalctl -u nginx.service
$ sudo journalctl -u nginx.service --since today

# 实时滚动显示某个 Unit 的最新日志
$ sudo journalctl -u nginx.service -f

# 合并显示多个 Unit 的日志
$ journalctl -u nginx.service -u php-fpm.service --since today

# 查看指定优先级（及其以上级别）的日志，共有8级
# 0: emerg
# 1: alert
# 2: crit
# 3: err
# 4: warning
# 5: notice
# 6: info
# 7: debug
$ sudo journalctl -p err -b

# 日志默认分页输出，--no-pager 改为正常的标准输出
$ sudo journalctl --no-pager

# 以 JSON 格式（单行）输出
$ sudo journalctl -b -u nginx.service -o json

# 以 JSON 格式（多行）输出，可读性更好
$ sudo journalctl -b -u nginx.serviceqq
 -o json-pretty

# 显示日志占据的硬盘空间
$ sudo journalctl --disk-usage

# 指定日志文件占据的最大空间
$ sudo journalctl --vacuum-size=1G

# 指定日志文件保存多久
$ sudo journalctl --vacuum-time=1years
```

- `systemd-analyze`

`systemd-analyze blame` 打印服务的启动耗时
`systemd-analyze verify FILE...` 检查unit file
`systemd-analyze critical-chain docker.service` 打印服务的启动流程

- `hostnamectl`

`hostnamectl` 显示当前主机的信息
`sudo hostnamectl set-hostname rhel7` 设置主机名

- `timedatectl`

```
# 查看当前时区设置
$ timedatectl

# 显示所有可用的时区
$ timedatectl list-timezones  

# 设置当前时区
$ sudo timedatectl set-timezone America/New_York
$ sudo timedatectl set-time YYYY-MM-DD
$ sudo timedatectl set-time HH:MM:SS
```

- `loginctl` 命令用于查看当前登录的用户

```
# 列出当前session
$ loginctl list-sessions

# 列出当前登录用户
$ loginctl list-users

# 列出显示指定用户的信息
$ loginctl show-user ruanyf
```



```
systemd-cgls  打印所有正在运行的systemd服务
systemd-cgtop  查看服务使用资源的情况
```

### history

通过history查看命令，然后用!(history中命令编号)
修改history命令输出详细信息：
```
vi /etc/bashrc
HISTFILESIZE=4000
HISTSIZE=4000
HISTTIMEFORMAT='%F %T '
export HISTTIMEFORMAT
```

- 记录每个用户的历史记录


1. /etc/profile 添加
```
USER_IP=`who -u am i 2> /dev/null | awk '{print $NF}' | sed -e 's/[()]//g'`
PROMPT_COMMAND='date "+[ %Y%m%d-%H:%M:%S $LOGNAME from $USER_IP  ]: `history 1 |cut -c 8-`" >> /var/log/user.log'
```
2. 设置权限
```
chmod 002 /var/log/user.log
```

### test 和　[]

使用字符串比较时，最好用双中括号

- `[[ $str1 = $str2 ]]` 和 `[[ $str1 == $str2 ]]` 是2种写法；

- `[ $var -eq 0 ]` 数值比较


### 字段分隔符的用法

IFS 的默认值为空白字符（换行符、制表符、空格）

```
#!/bin/bash

data="name,sex,rollno,location"

oldIFS=$IFS
IFS=,
for item in $data;
do
   echo Item:$item
done

IFS=$oldIFS
```

### cat

```
cat > foo.txt << EOF
aaaaa
bbbbb
ccccc
EOF
```


### tr

- 删除字符

```
echo "hello 123 world 456" | tr -d '0-9'
hello world
```

- 不删除字符

```
echo hello 1 char 2 next 4 | tr -d -c '0-9 \n'
1 2 4
```

- 压缩重复字符

```
echo hello     world | tr -s ' '
hello world
```

- 利用tr将数字列表相加

```
$ cat sum.txt 
1
2
3
4
5

$ cat sum.txt | echo $[ $(tr '\n' '+' ) 0 ]  
15
```

### date

![](index_files/fe85aad8-1748-44bb-aeb3-91ba5fc0b770.jpg)

- 1 .

```
date
Mon Aug 22 14:12:45 CST 2016

date +%s
1471846387

date "+something_%s"
something_1471847392
```

- 2 . 使用 `--date -d`

```
# 将日期串转换成时间戳
date --date "Mon Aug 22 14:12:45 CST 2016" +%s
1471846365

# 打印星期
date --date "Mon Aug 22 14:12:45 CST 2016" +%A
Monday
```



### 重定向

```
# 错误和标准输出分别：
cmd 2 > error.txt 1 > out.txt

#将stderr转换成stdout：
cmd > out.txt 2>&1
或
cmd &> out.txt
```

### 环境变量

```
对于每个进程，在其运行时的环境变量可以使用下面的命令来查看：
cat /proc/$PID/environ |tr '\0' '\n'
```


### set

```
-e
开启错误检查，应该放在脚本的第一行

-x
执行命令前先打印该命令出来；
```


### mysqldump

```
-- 备份所有数据库
mysqldump -uroot -p --all-database > all.sql

-- 备份数据库test
mysqldump -uroot -p test > test.sql

-- 备份数据库test下的表emp
mysqldump -uroot -p test emp > test_emp.sql

-- 备份数据库test下的表emp, dept
mysqldump -uroot -p test emp dept > test_emp_dept.sql


# 选项
--all-database -A 所有db
--opt 此选项将打开所有会提高文件导出速度和创造一个可以更快导入的文件的选项。
-q or -quick 这个选项使得MySQL不会把整个导出的内容读入内存再执行导出，而是在读到的时候就写入导文件中。

为了保证数据备份的一致性，对于 MyISAM 表备份时需要加上 -l 参数，对于 InnoDB 可采用 --single-transaction 选项。
```


```
-- 恢复某个数据库
mysql -uroot -p db_name < bakfile
```

### mapfile readarray

这两个命令又是同一个命令的两种写法。它们的功能是，**将一个文本文件直接变成一个数组，每行作为数组的一个元素。**这对某些程序的处理是很方便的。尤其是当你要对某些文件进行全文的分析或者处理的时候，比一行一行读进来处理方便的多。用法：

```
[zorro@zorrozou-pc0 bash]$ cat mapfile.sh 
#!/bin/bash

exec 3< /etc/passwd

mapfile -u 3 passwd 

exec 3<&-

echo ${#passwd}

for ((i=0;i<${#passwd};i++))
do
    echo ${passwd[$i]}
done
```

程序输出：

```
[zorro@zorrozou-pc0 bash]$ ./mapfile.sh 
32
root:x:0:0:root:/root:/bin/bash
bin:x:1:1:bin:/bin:/usr/bin/nologin
daemon:x:2:2:daemon:/:/usr/bin/nologin
...
```




### yum

安装指定版本：

```
yum list gitlab-ce --showduplicates
yum install gitlab-ce-8.8.4-ce.0.el7  #指定版本
```

列出installed：

```
yum list installed |grep gitlab-ce
```


### 系统初始

```
sed -i 's/SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config 

```

- 阿里源


```
1、备份
 
mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup
 
2、下载新的 CentOS-Base.repo 到 / etc/yum.repos.d/
 

CentOS 6
curl -O http://mirrors.aliyun.com/repo/Centos-6.repo

CentOS 7 
curl -O http://mirrors.aliyun.com/repo/Centos-7.repo

3、yum update

```



- ntp


```
yum install ntp
ntpdate us.pool.ntp.org
```

- 必装

```
yum install tree net-tools gcc lrzsz vim
```


### PS1 设置


```
#查看当前设置
echo $PS1 


#修改
vim ~/.bashrc
PS1='[\u@\h \w]\n\$ '
```
 
### strace 进程跟踪
 
通用的完整用法：
```
strace -o output.txt -T -tt -e trace=all -p 28979
```
上面的含义是 跟踪28979进程的所有系统调用（-e trace=all），并统计系统调用的花费时间，以及开始时间（并以可视化的时分秒格式显示），最后将记录结果存在output.txt文件里面。
用strace看一下在启动 dcopserver时到底程序做了什么：
```
strace -f -F -o ~/dcop-strace.txt dcopserver
```
这里 -f -F选项告诉strace同时跟踪fork和vfork出来的进程，-o选项把所有strace输出写到~/dcop-strace.txt里 面，dcopserver是要启动和调试的程序。
 
 
### dmesg
查看系统启动的信息
 
 
### du
打印当前目录下所有文件的大小
du -sh *  


搜寻当前目录下最大的目录
du -kx | egrep -v "\./.+/" | sort -n



### kill
kill -USR2 26701    #重启php-fpm  进程
kill -3 pid    #输出java线程信息到catalina.out
 
 
### sar
sar -o 23   #第一次运行，23为23号，会在/var/log/sa下面生成sa23文件
sar -f file    #查看采集的信息
_**sar -b 3 5   #I/O信息**_
tps：每秒钟物理设备的 I/O 传输总量
rtps：每秒钟从物理设备读入的数据总量
wtps：每秒钟向物理设备写入的数据总量
bread/s：每秒钟从物理设备读入的数据量，单位为 块/s
bwrtn/s：每秒钟向物理设备写入的数据量，单位为 块/s
_**sar -n DEV   #网卡流量信息**_
_**sar -u 3 5    #CPU信息**_
_**sar -r  3 5   #内存监控**_
_**sar -q  3 5   #进程队列长度和平均负载状态监控**_
runq-sz：运行队列的长度（等待运行的进程数）
plist-sz：进程列表中进程（processes）和线程（threads）的数量
ldavg-1：最后1分钟的系统平均负载（System load average）
ldavg-5：过去5分钟的系统平均负载
ldavg-15：过去15分钟的系统平均负载
怀疑CPU存在瓶颈，可用 sar -u 和 sar -q 等来查看
怀疑内存存在瓶颈，可用 sar -B、sar -r 和 sar -W 等来查看
怀疑I/O存在瓶颈，可用 sar -b、sar -u 和 sar -d 等来查看
 
 
### ps

参数：
`-l`　　进程数


列举出系统中所有不是由你运行的程序:
`ps aux | grep -v $(whoami)`

或者，更巧妙些的是，为什么不列出最占用时间的前十个程序呢：
> ps aux --sort=-%cpu | grep -m 11 -v \`whoami\`

查找僵尸进程并kill:
`ps -A -o stat,ppid,pid,cmd | grep -e '^[Zz]' | awk '{print $2}' | xargs kill -9`  

查看pid：`ps --pid 6619`

查看进程开始时间，运行时长：`ps -eo pid,lstart,etime | grep 17649`


使用top实时查看 `top -Hp 进程号`

pgrep
> look up or signal processes based on name and other attributes

pidof
> find the process ID of a running program


查看某个进程有多少端口：`netstat -anp |grep 32022`



```
ps -e -o 'pid,comm,args,pcpu,rsz,vsz,stime,user,uid' | grep oracle |  sort -nrk5   #其中rsz为实际内存，上例实现按内存排序，由大到小
-A 参数列出所有进程
-o 自定义输出字段 我们设定显示字段为 stat（状态）, ppid（进程父id）, pid(进程id)，cmd（命令）这四个参数

ps aux | sort -k3nr | head -n 10  #查占用cpu最多的进程
ps aux | sort -k4nr | head -n 10  #查占用内存最多的进程

```

### pstree

`-A` 各进程间连接用 ASCII 字符连接   
`-U` 该进程之间连接用 utf8 字符连接   
`-p` 同时显示 PID   
`-u` 同时列出每个进程的所属账号名称

`pstree -Aup`

### top

`-c`  显示完整的程序命令

`-H`  显示线程
`-p 22`  只监控指定进程
`-b -n 1`  批处理模式输出一次退出

按f键，可选显示列

参数说明
d 指定每两次屏幕信息刷新之间的时间间隔。当然用户可以使用s交互命令来改变之。
u 只查看指定用户名的进程
p 通过指定监控进程ID来仅仅监控某个进程的状态
n 设置退出前屏幕刷新的次数
b 将top输出编排成适合输出到文件的格式，可以使用这个选项创建进程日志
q 该选项将使top没有任何延迟的进行刷新。如果调用程序有超级用户权限，那么top将以尽可能高的优先级运行
c 显示整个命令行而不只是显示命令名
S 指定累计模式
s 使top命令在安全模式中运行。这将去除交互命令所带来的潜在危险。
i 使top不显示任何闲置或者僵死进程。


### 用户和组


- useradd参数：

```
-d home_dir  新 帐 号 每 次 登 入 时 所 使 用 的 home_dir

-M  不 建 立 使 用 者 目 录
-m  使 用 者 目 录 如 不 存 在 则 自 动 建 立

-g group   名 称 或 以 数 字 来 做 为 使 用 者 登 入 起 始 群 组 (group) 。群 组 名 须 为 现 有 存 在 的 名 称 。

-G group,[...]    定 义 此 使 用 者 为 此 一 堆 groups 的 成 员 。每 个 群 组 使 用 "," 区 格 开 来

-s /bin/sh 指定登录shell

-r：创建system账户；

```

查看hero用户所属组：
> groups hero

添加组mysql，将mysql用户加进mysql组中：
> groupadd mysql
useradd -s /sbin/nologin -M -g mysql mysql

添加sam用户并指定主目录（-d和-m选项用来为用户sam产生一个主目录）
> useradd -d /usr/sam -m sam


- usermod参数：

```
-d home_dir    更 新 使 用 者 新 的 登 入 目 录 。 如 果 给 定 -m 选 项 ， 使 用 者 旧 目 录 会 搬 到 新 的 目 录 去 ，如 旧 目 录 不 存 在 则 建 个 新 的 。

-g initial_group  更 新 使 用 者 新 的 起 始 登 入 群 组 。 群 组 名 须 已 存 在 。

-s shell   指 定 新 登 入 shell 。

-L 锁定一个用户的帐号. 这个操作是放一个感叹号在你的密码前,禁用密码.你不能配合-p或-U使用.

-U 解锁一个用户的帐号.这个操作是在加密密码前取消感叹号,恢复帐号登录.你不能配合-p或-L使用.

```

### head
-n,       显示每个文件的前 行内容；
-c,     显示每个文件的前K 字节内容；

### wget
 
```
wget -T 5 --spider -nv www.qq.com
```
T : 超时时间
--spider   模拟蜘蛛，不下载任何数据
q：安静模式（不输出信息）
nv：关闭详细输出模式，但不进入安静模式
-P  指定下载目录
-o  指定下载文件名，当请求url特别长的时候很有用
```
wget --spider -Y on -e "http_proxy=http://192.168.1.122:1080" "www.google.com"    #使用代理
```
 
 
### curl

查看本机出口IP：`curl http://members.3322.org/dyndns/getip`
 
```
curl --data hello 'http://localhost:8080/main'
```
`--data` 选项，指定 `hello` 作为我们的请求体数据，同时 `--data` 选项会自动让发送的请求使用 `POST` 请求方法
 
```
curl -d "param1=value1¶m2=value2" "http://www.baidu.com"    #发送post
```
-v  显示详细过程
 
```
curl --user-agent "[User Agent]" [URL]
curl --socks5-hostname 192.168.1.122:1080 http://www.google.com
curl --socks5 192.168.1.122 http://ifconfig.me
curl -x 192.168.1.122 http://members.3322.org/dyndns/getip
```

```
查看公网IP
curl http://members.3322.org/dyndns/getip
curl ifconfig.me
```



### RAR
 
wget http://www.rarsoft.com/rar/rarlinux-3.9.3.tar.gz 
tar -xvf rarlinux-3.9.3.tar.gz 
cd rar 
make
看见下面这些信息就是安装成功了
mkdir -p /usr/local/bin
mkdir -p /usr/local/lib
cp rar unrar /usr/local/bin
cp rarfiles.lst /etc
cp default.sfx /usr/local/lib
cp rar_static /usr/local/bin/rar
解压：rar x vpsyou.rar
 
 
### fuser
fuser：查阅某个文件系统底下有多少程序正在占用该文件系统
-v ：可以列出每个文件与程序还有命令的完整相关性
-k  :  杀死进程
-m：检查分区被哪些程序占用    fuser -m /dev/sda1
lsof：查出某个程序开启或者使用的文件与装置
-u ：后面接 username，列出该使用者相关程序所开启的文件；
lsof abc.txt 显示开启文件abc.txt的进程
lsof -i :22 知道22端口现在运行什么程序
lsof -c abc 显示abc进程现在打开的文件
❤lsof -p 12  看进程号为12的进程打开了哪些文件
 
lsof +d /usr/local/ 显示目录下被进程开启的文件
lsof |grep delete   #查看已被删除但仍然被某个进程占用的文件
pidof：查看进程pid
[root@Rener60 ~]# pidof sshd
69230 1284 1049
[root@Rener60 ~]# ls -al /proc/69230/exe 
lrwxrwxrwx 1 root root 0 Mar  2 21:17 /proc/69230/exe -> /usr/sbin/sshd
 
 
 
### tar

-z 解压 gz 文件
-j 解压 bz2 文件
-J 解压 xz 文件

-c：--create 创建一个新归档
-f：--file=ARCHIVE 使用归档文件或 ARCHIVE 设备
-x：--extract, --get 从归档中解出文件
-t：--list 列出归档内容
--add-file=文件 添加指定的 FILE 至归档(如果名字以 -开始会很有用的)
-C：--directory=DIR 改变至目录 DIR
-p：保持文件属性
假设 test目录下有 1 2 3 4 5 这5个目录
现在要将 3 4 5目录tar打包,1和2目录不要
命令如下：
tar -zcvf test.tar.gz --exclude=1 --exclude=2 test
或
tar -zcvf test.tar.gz --exclude=test/1 --exclude=test/2 test
看man tar帮助,--exclude后面跟的好像是正则
注意: 要打包的test必须在命令最后,不然没有效果.




### scp

scp -C -c blowfish /home/yankay/data yankay01:/home/yankay/data  #压缩算法

-p：保持属性   -P  端口   -i  使用密钥
scp ./ilanni.tar.gz root@192.168.1.102:/ks   #本地文件到远程
scp -r ./ilanni root@192.168.1.102:/ks        #本地目录到远程
scp root@192.168.1.102:/ks/ks.cfg ./        #远程文件到本地
scp -r root@192.168.1.102:/ks/ilanni ./     #远程目录到本地
rsync -azv -e "ssh -i /etc/ssl/kp-7spdnxj2 -p 2280" date.log 121.201.8.48:/tmp   #通过密钥传输

### ssh

```
#在远程执行命令
ssh -p10022 sun@192.168.8.211 "/sbin/ip a"

#如果是sudo，需要加-t
ssh -p10022 -t hero@114.55.39.156 sudo /sun/shell/de.sh
```

### openssl

自签名证书：

见`nginx/配置说明2.md`

### sshpass

安装

```
wget http://jaist.dl.sourceforge.net/project/sshpass/sshpass/1.06/sshpass-1.06.tar.gz

tar xf
cd sshpass
./configure
make
make install
```

使用

```
#在远程执行命令：
sshpass -p 123.com ssh -o StrictHostKeyChecking=no root@192.168.8.236 "ip a"

#从远程scp到本地
sshpass -p 123.com scp -o StrictHostKeyChecking=no root@192.168.8.236:/etc/passwd /tmp/

#把密码放在文件里，避免直接显示密码出来
sshpass -f /tmp/pass scp -o StrictHostKeyChecking=no root@192.168.8.236:/etc/passwd /tmp/
```

### chattr
修改文件或者目录的文件属性能够提高系统的安全性
[http://linux.51yip.com/search/chattr](http://linux.51yip.com/search/chattr)


### sort uniq
- sort
-n, --numeric-sort 根据字符串数值比较
-r, --reverse 逆序输出排序结果
-k, --key=位置1[,位置2]
 
 
- uniq
-c, --count 在每行前加上表示相应行目出现次数的前缀编号
-d, --repeated 只输出重复的行
-u, --unique 只显示唯一的行
uniq的一个特性，检查重复行的时候，只会检查相邻的行。重复数据，肯定有很多不是相邻在一起的，
sort test.txt |uniq -c #这样就可以解决问题
 
 
###seq




