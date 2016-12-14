
一：安装 vsftpd

```sh
yum -y install vsftpd
```

二：基于虚拟用户的配置
所谓虚拟用户就是没有使用真实的帐户，只是通过映射到真实帐户和设置权限的目的。虚拟用户不能登录 CentOS 系统。

修改配置文件

打开 `/etc/vsftpd/vsftpd.conf`，做如下配置

```
anonymous_enable=NO //设定不允许匿名访问
local_enable=YES //设定本地用户可以访问。注：如使用虚拟宿主用户，在该项目设定为NO的情况下所有虚拟用户将无法访问
chroot_list_enable=YES //使用户不能离开主目录
ascii_upload_enable=YES
ascii_download_enable=YES //设定支持ASCII模式的上传和下载功能
pam_service_name=vsftpd //PAM认证文件名。PAM将根据/etc/pam.d/vsftpd进行认证
以下这些是关于 vsftpd 虚拟用户支持的重要配置项，默认 vsftpd.conf 中不包含这些设定项目，需要自己手动添加

guest_enable=YES //设定启用虚拟用户功能
guest_username=ftp //指定虚拟用户的宿主用户，CentOS中已经有内置的ftp用户了
user_config_dir=/etc/vsftpd/vuser_conf //设定虚拟用户个人vsftp的CentOS FTP服务文件存放路径。存放虚拟用户个性的CentOS FTP服务文件(配置文件名=虚拟用户名
```

进行认证

首先，安装 Berkeley DB 工具，很多人找不到 db_load 的问题就是没有安装这个包。

```sh
yum install db4 db4-utils
```

然后，创建用户密码文本 `/etc/vsftpd/vuser_passwd.txt`，注意奇行是用户名，偶行是密码

```
test
123456
```

接着，生成虚拟用户认证的 db 文件

```
db_load -T -t hash -f /etc/vsftpd/vuser_passwd.txt /etc/vsftpd/vuser_passwd.db
```

随后，编辑认证文件 `/etc/pam.d/vsftpd`，全部注释掉原来语句，再增加以下两句：

```
auth required pam_userdb.so db=/etc/vsftpd/vuser_passwd
account required pam_userdb.so db=/etc/vsftpd/vuser_passwd
```

最后，创建虚拟用户配置文件

```sh
mkdir /etc/vsftpd/vuser_conf/
vi /etc/vsftpd/vuser_conf/test  //文件名等于vuser_passwd.txt里面的账户名，否则下面设置无效
```

内容如下

```
local_root=/ftp/www  //虚拟用户根目录,根据实际情况修改
write_enable=YES  //可写
anon_umask=022 //掩码
anon_world_readable_only=YES
anon_upload_enable=YES
anon_mkdir_write_enable=YES
anon_other_write_enable=YES
```


设置 FTP 根目录权限：

mkdir /ftp/www   //创建目录
chmod R 755 /ftp
chmod R 755 /ftp/www
chown root:root /ftp/www
cd www
chown -R ftp:ftp .

touch /etc/vsftpd/chroot_list
