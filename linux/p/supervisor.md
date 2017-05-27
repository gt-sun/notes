[TOC]



## 参考

- [使用exec命令](http://www.cnblogs.com/yjf512/p/6492746.html)

## 插件

- [superlance](http://blog.csdn.net/baidu_zhongce/article/details/49151385)




## 运行zookeeper

```
[program:zookeeper]
command=/usr/local/zookeeper/bin/zkServer.sh start-foreground
user=root
autostart=true
autorestart=true
startsecs=3
```


## 运行mysql

```
[program:mysql]
command=/path/to/pidproxy /path/to/pidfile /path/to/mysqld_safe
```

## 运行Tomcat

```
[program:tomcat]
command=/path/to/tomcat/bin/catalina.sh run
process_name=%(program_name)s
startsecs=5
user=tomcat
redirect_stderr=true
stdout_logfile=/var/log/tomcat.log  #catalina.out
stopasgroup=true
killasgroup=true
```



## 详细说明——运行py服务

- 优势：kill pid 之后会自动重启服务；

- 安装：`pip install supervisor`


- 生成配置文件：` echo_supervisord_conf > /etc/supervisord.conf `


python 2.6的环境可能需要升级依赖包，`pip install 'meld3 == 1.0.1'`


- 修改配置：

　　如需允许 web 界面和命令行访问
 
```
[inet_http_server] 
port=*:9001     ;  这里*表示可以让其他终端访问supervisor web界面
username=username ;  用户名 
password=password  ;  密码 
```

　　配置一个服务
  
```
[program:test_http]
command=python test_http.py 501  ; 被监控的进程路径
directory=/home/admin/soft/supervisor-3.1.3                ; 执行前要不要先cd到目录去，一般不用
priority=1                    ;数字越高，优先级越高
numprocs=1                    ; 启动几个进程
autostart=true                ; 随着supervisord的启动而启动
autorestart=true              ; 自动重启。。当然要选上了
startretries=10               ; 启动失败时的最多重试次数
exitcodes=0                   ; 正常退出代码（是说退出代码是这个时就不再重启了吗？待确定）
stopsignal=KILL               ; 用来杀死进程的信号
stopwaitsecs=10               ; 发送SIGKILL前的等待时间
redirect_stderr=true          ; 重定向stderr到stdout
```

这里 test_http.py 位于 directory（/home/admin/soft/supervisor-3.1.3）目录下

test_http.py:

```
#python 2x

import sys  
import BaseHTTPServer  
from SimpleHTTPServer import SimpleHTTPRequestHandler  
HandlerClass = SimpleHTTPRequestHandler  
ServerClass = BaseHTTPServer.HTTPServer  
Protocol = "HTTP/1.0"  
  
if __name__ == "__main__":
    if sys.argv[1:]:  
        port = int(sys.argv[1])  
    else:  
        port = 8000  

    server_address = ('10.125.24.105', port)  
    HandlerClass.protocol_version = Protocol  
    httpd = ServerClass(server_address, HandlerClass)  
    
    sa = httpd.socket.getsockname()  
    print "Serving HTTP on", sa[0], "port", sa[1], "..."  
    httpd.serve_forever()
```

- 启动

`supervisord -c /etc/supervisord.conf`

- 管理命令

```
sudo supervisorctl
status: 查看当前运行的进程列表
stop xxx: 停止某一个进程(xxx)，xxx为[program:theprogramname]里配置的值。
start xxx: 启动某个进程
restart xxx: 重启某个进程
stop groupworker: 重启所有属于名为groupworker这个分组的进程(start,restart同理)
stop all，停止全部进程，注：start、restart、stop都不会载入最新的配置文件。
reload    载入最新的配置文件，停止原有进程并按新的配置启动、管理所有进程。
update    根据最新的配置文件，启动新配置或有改动的进程，配置没有改动的进程不会受影响而重启。
```

显示用 stop 停止掉的进程，用 reload 或者 update 都不会自动重启。

- 重新加载配置

`supervisorctl -c /etc/supervisord.conf`



## 配置 systemctl 服务

1> 进入 /lib/systemd/system 目录，并创建 `supervisor.service` 文件

```
[Unit]
Description=supervisor
After=network.target

[Service]
Type=forking
ExecStart=/usr/bin/supervisord -c /etc/supervisor/supervisord.conf
ExecStop=/usr/bin/supervisorctl $OPTIONS shutdown
ExecReload=/usr/bin/supervisorctl $OPTIONS reload
KillMode=process
Restart=on-failure
RestartSec=42s

[Install]
WantedBy=multi-user.target
```

2> 设置开机启动

```bash
systemctl enable supervisor.service
systemctl daemon-reload
```