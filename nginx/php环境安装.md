[TOC]


## 通过yum快速安装

### 安装第三方源

```
wget http://www.atomicorp.com/installers/atomic  #下载 atomic yum 源
sh ./atomic   #安装
yum check-update  #更新 yum 软件包
```

### 安装php

```
yum install php

安装 PHP 组件，使 PHP 支持 MySQL、PHP 支持 FastCGI 模式
yum install php-mysql php-gd libjpeg* php-imap php-ldap php-odbc php-pear php-xml php-xmlrpc php-mbstring php-mcrypt php-bcmath php-mhash libmcrypt libmcrypt-devel php-fpm 
```

### 配置

vi /etc/nginx/nginx.conf

```
user  nginx  nginx;  # 修改 nginx 运行账号为：nginx 组的 nginx 用户


location ~ \.php$ {
   root          html;
   fastcgi_pass   127.0.0.1:9000;
   fastcgi_index  index.php;
   fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
   include       fastcgi_params;
 }
# 取消 FastCGI server 部分 location 的注释, 并要注意 fastcgi_param 行的参数, 改为 $document_root$fastcgi_script_name, 或者使用绝对路径

```


vi /etc/php.ini   #编辑

```
date.timezone= PRC

expose_php = Off        #在 432 行 禁止显示 php 版本的信息
```

vi /etc/php-fpm.d/www.conf

```
user = nginx   #修改用户为 nginx
group = nginx   #修改组为 nginx
```

phpinfo.php

```
<?php
     phpinfo();
?>
```