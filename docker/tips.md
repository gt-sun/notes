[TOC]



- 使用不安全的仓库

`docker --insecure-registry=docker-registry.example.com:8080 login https://docker-registry.example.com:8080`


## 自签证书问题

docker daemon会检查`/etc/ssl/certs`目录下的证书文件，如果之前有添加过自签的证书，则执行docker命令的时候会报错：`certificate signed by unknown authority`

## 使用阿里源

```
vim /usr/lib/systemd/system/docker.service

ExecStart=/usr/bin/docker daemon -H fd:// --registry-mirror=https://kodfz8hg.mirror.aliyuncs.com
```