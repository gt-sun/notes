tcpdump：理论、自动抓包及业务架构树的生成
http://www.yunweipai.com/archives/7981.html


### tcpdump

`-tttt`  在每行打印的时间戳之前添加日期的打印

(1)tcp: ip icmp arp rarp 和 tcp、udp、icmp这些选项等都要放到第一个参数的位置，用来过滤数据报的类型

(2)-i eth1 : 只抓经过接口eth1的包
(3)-t : 不显示时间戳
(4)-s 0 : 抓取数据包时默认抓取长度为68字节。加上-s 0 后可以抓到完整的数据包  wireshark需要此参数
(5)-c 100 : 只抓取100个数据包
(6)dst port ! 22 : 不抓取目标端口是22的数据包
(7)src net 192.168.1.0/24 : 数据包的源网络地址为192.168.1.0/24
(8)-w ./target.cap : 保存成cap文件，方便用ethereal(即wireshark)分析

```
tcpdump tcp -i eth1 -t -s 0 -c 100 and dst port ! 22 and src net 192.168.1.0/24 -w ./target.cap

tcpdump  -XvvennSs 0 -i eth0 tcp[20:2]=0x4745 or tcp[20:2]=0x4854        #使用tcpdump抓取HTTP包

tcpdump dst port 80 -s 0 -w /dev/shm/tcpdump_dst80.txt   #抓取本机到目的端口是80的数据包
tcpdump host 221.228.228.89 -s 0 -w /dev/shm/tcpdump_228.89.txt  #抓取所有ip的数据包
tcpdump -i eth0 dst host hostname
tcpdump ip host 210.27.48.1 and ! 210.27.48.2
```


