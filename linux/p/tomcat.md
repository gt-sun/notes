[TOC]

[置顶]


- 问题追踪和监控

https://wiki.apache.org/tomcat/FAQ/Troubleshooting_and_Diagnostics


## 配置部分

### 环境变量


```
JAVA_HOME=/opt/jdk1.8.0_92/
PATH=$JAVA_HOME/bin:$PATH
export JAVA_HOME PATH
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

修改jar包

`$CATALINA_HOME/lib/catalina.jar::org/apache/catalina/util/ServerInfo.properties`

### 自动部署

默认会自动解包

如果不需要自动部署，建议关闭自动部署功能。在`$CATALINA_HOME/conf/server.xml`中的 `host` 字段，修改`unpackWARs="false" autoDeploy="false"`。

### AJP 端口管理

默认的8009端口

AJP 是为 Tomcat 与 HTTP 服务器之间通信而定制的协议，能提供较高的通信速度和效率。如果 tomcat 前端放的是 apache 的时候，会使用到 AJP 这个连接器。前端如果是由 nginx 做的反向代理的话可以不使用此连接器，因此需要注销掉该连接器。

## 使用JSVC守护进程的方式运行容器

原理：
使用jsvc来运行服务，没有了默认8005的shutdown端口；
主进程pid为1，fork 2个进程

运行方式参考：http://commons.apache.org/proper/commons-daemon/jsvc.html


*centos 7*

- 1、建立 Jsvc

Jsvc 是专为  Java  应用程序开发的一个工具包，其目标是把 Java 应用程序的普通运行转换为以 Unix 守护进程的方式运行。这样的话，可以很方便地启动 / 停止应用程序。Tomcat 安装包的 bin 子目录下就包含了 Jsvc 工具包的源码，整个建立过程很方便，如下。

本文的脚本以 Tomcat 8.0.27，CentOS 7 为例。假定我的 JAVA 8 安装到 / opt/jdk8 处。

```
$ cd /opt/tomcat8/bin
$ sudo tar zvxf commons-daemon-native.tar.gz
$ cd commons-daemon-1.0.15-native-src/unix
$ sudo ./configure --with-java=/opt/jdk8
$ sudo make
$ sudo cp jsvc ../..
```

- 2、创建 Tomcat 用户

下面的命令会创建一个专门的用户来运行 Tomcat 实例，并会把 / opt/tomcat 目录及其文件的所有权赋予新创建的 tomcat 用户。

```
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

```
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