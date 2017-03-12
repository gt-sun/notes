[TOC]

## 使用阿里源

```
vim /usr/lib/systemd/system/docker.service

ExecStart=/usr/bin/docker daemon -H fd:// --registry-mirror=https://kodfz8hg.mirror.aliyuncs.com
```