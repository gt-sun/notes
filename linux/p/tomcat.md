[TOC]

[置顶]


- 问题追踪和监控

https://wiki.apache.org/tomcat/FAQ/Troubleshooting_and_Diagnostics


## tomcat 注意事项

- war包不能在tomcat运行时删除，否则会删除自动解压的工程。你可以停止tomcat后删除war包。
- webapps 目录下新建的目录不能访问 html 文件？

当我们新建一个子目录时，却并不能在浏览器里正常访问。就连 HTML 文件也访问不了。为什么会出现这种情况呢？

原来，在 Tomcat 中，每一个 webapps 下的子目录都被认为是一个 JSP 站点。因此，该子目录必需要有 JSP 站点的必要结构才行。也就是，在创建的子目录下，必需有 WEB_INF 目录以及 WEB_INF 下的 web.xml 文件。WEB_INF 目录以及其下的 web.xml 文件，是 JSP 用来配置站点用的。

以 test 子目录为例，以下就是正确配置 Tomcat 子目录的目录结构：

```
webapps\
            ┝ ROOT\
            │        │
            │        ┕ …
            ┕ test\
                        │
                        ┝ index.html
                        │
                        ┕ WEB_INFO\
                                    │
                                    ┕  web.xml
```


空的 web.xml 文件内容如下：

```
<?xml version="1.0" encoding="utf-8"?>

<web-app xmlns="http://java.sun.com/xml/ns/j2ee" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://java.sun.com/xml/ns/j2ee http://java.sun.com/xml/ns/j2ee/web-app_2_4.xsd" version="2.4">  
  <display-name>Welcome to Tomcat</display-name>  
  <description>Welcome to Tomcat</description> 
</web-app>
```

## 配置部分

### 环境变量


```
JAVA_HOME=/opt/jdk1.8.0_92
PATH=$JAVA_HOME/bin:$PATH
export JAVA_HOME PATH
```

### 使用`X-Real-IP`记录用户IP

```
<Valve className="org.apache.catalina.valves.AccessLogValve" directory="logs"
               prefix="localhost_access_log." suffix=".txt"
               pattern="%{X-Real-IP}i %h %l %u %t &quot;%r&quot; %s %b" />
```

使用nginx反向代理tomcat，通过修改`server.xml` 在tomcat日志中记录真实IP。

附nginx配置：

```
location / {
            proxy_set_header Host $host;
            proxy_set_header X-Real-Ip $remote_addr;
            proxy_set_header X-Forwarded-For $remote_addr;
            proxy_pass http://aaaa/;
        }
```

### 开启gzip

PS：nginx开启了gzip后，tomcat就不需要再开启了。

vim conf/server.xml

```
<Connector port="80" protocol="HTTP/1.1"
           connectionTimeout="20000"
           redirectPort="8443"
           compression="on" />
```


### 用户登录

使用自带的manager管理后台。

`vi conf/tomcat-users.xml `

```
<role rolename="manager"/>  
<role rolename="manager-gui"/>  
<role rolename="admin"/>  
<role rolename="admin-gui"/>  
<role rolename="manager-script"/>  
<role rolename="manager-jmx"/>  
<role rolename="manager-status"/>  
<user username="admin" password="123456" roles="admin-gui,admin,manager-gui,manager,manager-script,manager-jmx,manager-status"/> 
```

### 访问控制

`vi server.xml`

```
<Valve className="org.apache.catalina.valves.RemoteAddrValve" 
   addConnectorPort="true"
   allow="127\.\d+\.\d+\.\d+;\d*|::1;\d*|0:0:0:0:0:0:0:1;\d*|.*;8443"/>
```

解释：To allow unrestricted access for the clients connecting from localhost but for all other clients only to port 8443:

### 支持软连接

vim conf/context.xml

```
<!-- Tomcat 7: -->
<Context allowLinking="true" />

<!-- Tomcat 8: -->
<Context>
  <Resources allowLinking="true" />
</Context>
```

### 隐藏版本号信息

- 响应头

修改`$CATALINA_HOME/conf/server.xml`, 在 `Connector` 节点添加 `server` 字段，示例如下：`server=WWS1.0`，效果可通过curl命令查看。

- 404页面的版本号隐藏

方式1 修改jar包

`$CATALINA_HOME/lib/catalina.jar::org/apache/catalina/util/ServerInfo.properties`

方式2 创建文件

`cd $TOMCAT_HOME/lib`
`mkdir -p org/apache/catalina/util`
`cd org/apache/catalina/util`
`vim ServerInfo.properties`

```
server.info=XXX
```

### 自动部署

默认会自动解包

如果不需要自动部署，建议关闭自动部署功能。在`$CATALINA_HOME/conf/server.xml`中的 `host` 字段，修改`unpackWARs="false" autoDeploy="false"`。

### AJP 端口管理

默认的8009端口

AJP 是为 Tomcat 与 HTTP 服务器之间通信而定制的协议，能提供较高的通信速度和效率。如果 tomcat 前端放的是 apache 的时候，会使用到 AJP 这个连接器。前端如果是由 nginx 做的反向代理的话可以不使用此连接器，因此需要注销掉该连接器。


### 使用`Nio`连接器

> In order to configure tomcat to use the Non-blocking NIO connector instead of the default blocking BIO one simply change the value of the protocol attribute of the connector tag in the server.xml from HTTP/1.1 to org.apache.coyote.http11.Http11NioProtocol

```
<Connector port="8080" protocol="org.apache.coyote.http11.Http11NioProtocol"
    connectionTimeout="20000"
    maxThreads="1000"
    redirectPort="8443"
    compression="on"  
    URIEncoding="UTF-8"
    server="WWS1.0"
/>
```

To verify that you indeed are using the NIO connector, take a look at the startup logs. You should see lines similar to this.

```
Mar 28, 2014 3:59:04 PM org.apache.coyote.AbstractProtocol init
INFO: Initializing ProtocolHandler ["http-nio-8080"]
Mar 28, 2014 3:59:04 PM org.apache.tomcat.util.net.NioSelectorPool getSharedSelector
```

Use VisualVM to look at the threads being created in both cases. You’ll find NIO to use threads much more efficiently.

### `JAVA_OPTS`参数

`vim catalina.sh`

```
JAVA_OPTS="$JAVA_OPTS -server -Xms1024m -Xmx1024m -XX:PermSize=256m -XX:MaxPermSize=512m
```

### 优化`SecureRandom`

>28-Jun-2016 18:38:54.698 INFO [localhost-startStop-1] org.apache.catalina.util.SessionIdGeneratorBase.createSecureRandom Creation of SecureRandom instance for session ID generation using [SHA1PRNG] took [13,225] milliseconds.

SecureRandom 导致非常慢。

`vim bin/setenv.sh`

```
#!/bin/bash
export CATALINA_OPTS="-Djava.security.egd=file:/dev/./urandom"
```


### 加快application的启动速度

链接：https://wiki.apache.org/tomcat/HowTo/FasterStartUp

`vim webapps/Calendar/WEB-INF/web.xml`

```
<web-app metadata-complete="true">
 <display-name>gwt-Calendar Compiled: Sun Jan 27 06:17:26 GMT 2008</display-name>
 <description>Google Web Toolkit Project</description>

 <absolute-ordering />
</web-app>
```

### 以普通用户运行tomcat

`more /app/tomcat/bin/startup.sh`

```sh
#!/bin/bash
JAVA_HOME=/usr/java/jdk1.7.0_75
PATH=$JAVA_HOME/bin:$PATH
export JAVA_HOME PATH

if [ $(id -g) != "0" ];then
        /bin/sh /app/tomcat/bin/up.sh
else
        su - hero -c"/app/tomcat/bin/up.sh"
fi
```

授予hero用户kill权限，使其能够杀掉tomcat进程
`hero    ALL=(ALL) /bin/kill`


### 关于core日志文件

通过修改`/proc/sys/kernel/core_pattern`可以控制core文件保存位置和文件格式。
例如：将所有的core文件生成到`/corefile`目录下，文件名的格式为`core-命令名-pid-时间戳`. 
`echo "/corefile/core-%e-%p-%t" > /proc/sys/kernel/core_pattern`

- jstack命令

`jstack PID > outfile`

`jstack -J-d64 -m pid`

`sudo -u hero /usr/java/jdk1.7.0_75/bin/jstack -J-d64 2918`


## 使用JSVC守护进程的方式运行容器

原理：
使用jsvc来运行服务，没有了默认8005的shutdown端口；
主进程pid为1，fork 2个进程

运行方式参考：http://commons.apache.org/proper/commons-daemon/jsvc.html


*centos 7*

- 1、建立 Jsvc

Jsvc 是专为  Java  应用程序开发的一个工具包，其目标是把 Java 应用程序的普通运行转换为以 Unix 守护进程的方式运行。这样的话，可以很方便地启动 / 停止应用程序。Tomcat 安装包的 bin 子目录下就包含了 Jsvc 工具包的源码，整个建立过程很方便，如下。

本文的脚本以 Tomcat 8.0.27，CentOS 7 为例。假定我的 JAVA 8 安装到 / opt/jdk8 处。

```sh
$ cd /opt/tomcat8/bin
$ sudo tar zvxf commons-daemon-native.tar.gz
$ cd commons-daemon-1.0.15-native-src/unix
$ sudo ./configure --with-java=/opt/jdk8
$ sudo make
$ sudo cp jsvc ../..
```

- 2、创建 Tomcat 用户

下面的命令会创建一个专门的用户来运行 Tomcat 实例，并会把 / opt/tomcat 目录及其文件的所有权赋予新创建的 tomcat 用户。

```sh
$ sudo useradd -r -s /sbin/nologin tomcat
$ sudo chown -R tomcat: /opt/tomcat8
```

- 3、创建系统服务


3.1 创建一个名为 tomcat.service 的系统服务脚本。
vim /usr/lib/systemd/system/tomcat.service

```
[Unit]
Description=Apache Tomcat 8 Web Application Container
After=network.target

[Service]
Type=forking
PIDFile=/var/run/tomcat.pid
Environment=CATALINA_PID=/var/run/tomcat.pid
Environment=JAVA_HOME=/opt/jdk8
Environment=CATALINA_HOME=/opt/tomcat8
Environment=CATALINA_BASE=/opt/tomcat8
Environment=CATALINA_OPTS=

ExecStart=/opt/tomcat/bin/jsvc \
            -Dcatalina.home=${CATALINA_HOME} \
            -Dcatalina.base=${CATALINA_BASE} \
            -cp ${CATALINA_HOME}/bin/commons-daemon.jar:${CATALINA_HOME}/bin/bootstrap.jar:${CATALINA_HOME}/bin/tomcat-juli.jar \
            -user tomcat \
            -java-home ${JAVA_HOME} \
            -pidfile /var/run/tomcat.pid \
            -errfile SYSLOG \
            -outfile SYSLOG \
            $CATALINA_OPTS \
            org.apache.catalina.startup.Bootstrap

ExecStop=/opt/tomcat8/bin/jsvc \
            -pidfile /var/run/tomcat.pid \
            -stop \
            org.apache.catalina.startup.Bootstrap

[Install]
WantedBy=multi-user.target
```

开发者可以修改 CATALINA_OPTS 选项以满足自己的需要。

3.2 让 Tomcat 服务在启动后就自动运行：

```
$ sudo systemctl enable /usr/lib/systemd/tomcat.service
ln -s '/usr/lib/systemd/tomcat.service' '/etc/systemd/system/multi-user.target.wants/tomcat.service'
ln -s '/usr/lib/systemd/tomcat.service' '/etc/systemd/system/tomcat.service'
```

3.3 使用下面的命令启动、重启、停止 Tomcat 服务

```
$ systemctl start tomcat
$ systemctl stop tomcat
$ systemctl restart tomcat
$ systemctl status tomcat
```

来源：  http://blog.csdn.net/chszs/article/details/49153881



*centos 6*

主要利用了提供的daemon.sh 脚本

添加tomcat 用户：
useradd -r -s /sbin/nologin tomcat


vim /etc/init.d/tomcat

```sh
#!/bin/bash

#JAVA_HOME=/opt/zimbra/jdk-1.7.0_51
TOMCAT_HOME=/usr/local/tomcat

################################################

start_tomcat=$TOMCAT_HOME/bin/daemon.sh
stop_tomcat=$TOMCAT_HOME/bin/daemon.sh

start() {
    echo -n "Starting tomcat: "
    ${start_tomcat} start
    echo "tomcat start ok"
}

stop() {
    echo -n "Shutdown tomcat"
    ${stop_tomcat} stop
    echo "tomcat stop ok"
}

#how we were called
case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        stop
        sleep 10
        start
        ;;
    *)
        echo "Usage: $0 {start|stop|restart}"
esac

exit 0
```