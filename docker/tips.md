[TOC]



- 使用不安全的仓库

`docker --insecure-registry=docker-registry.example.com:8080 login https://docker-registry.example.com:8080`

## 使用阿里源

```
vim /usr/lib/systemd/system/docker.service

ExecStart=/usr/bin/docker daemon -H fd:// --registry-mirror=https://kodfz8hg.mirror.aliyuncs.com
```