

## 要点

- The swarm manager uses **ingress load balancing** to expose the services you want to make available externally to the swarm. If you do not specify a port, the swarm manager assigns the service a port in the 30000-32767 range.
- All nodes in the swarm route ingress connections to a running task instance.(可以通过任一node来访问服务，即使这个服务不在这个node上。)
- Swarm mode has an internal DNS component that automatically assigns each service in the swarm a DNS entry.
- Docker recommends you implement an odd number of  manager nodes according to your organization’s high-availability requirements. 采用的是Raft一致性算法。
- service task container 的区别 
![](https://docs.docker.com/engine/swarm/images/services-diagram.png)

A task is the atomic unit of scheduling within a swarm.

- The diagram below shows how swarm mode accepts service create requests and schedules tasks to worker nodes.
![](https://docs.docker.com/engine/swarm/images/service-lifecycle.png)

- Dynamic IP addresses are OK for worker nodes.管理节点要求固定IP。
- swarm集群现仅支持overlay网络，参见：https://docs.docker.com/engine/extend/plugins_network/#network-driver-plugins-and-swarm-mode



## 搭建swarm

初始化管理节点：

`docker swarm init --advertise-addr <MANAGER-IP>`

输出：

```
Swarm initialized: current node (dxn1zf6l61qsb1josjja83ngz) is now a manager.

To add a worker to this swarm, run the following command:

    docker swarm join \
    --token SWMTKN-1-49nj1cmql0jkz5s954yi3oex3nedyz0fb0xx14ie39trti4wxv-8vxv8rssmk743ojnwacrr2e7c \
    192.168.99.100:2377

To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.
```

查看：
`docker info`
`docker node ls`


添加工作节点：

```
$ docker swarm join \
  --token  SWMTKN-1-49nj1cmql0jkz5s954yi3oex3nedyz0fb0xx14ie39trti4wxv-8vxv8rssmk743ojnwacrr2e7c \
  192.168.99.100:2377

This node joined a swarm as a worker.
```

如果token没了，可以重新获取：

```
$ docker swarm join-token worker

To add a worker to this swarm, run the following command:

    docker swarm join \
    --token SWMTKN-1-49nj1cmql0jkz5s954yi3oex3nedyz0fb0xx14ie39trti4wxv-8vxv8rssmk743ojnwacrr2e7c \
    192.168.99.100:2377
```


注意token的隐私性，并且定期更改，覆盖旧的token：

```sh
$docker swarm join-token  --rotate worker

To add a worker to this swarm, run the following command:

    docker swarm join \
    --token SWMTKN-1-2kscvs0zuymrsc9t0ocyy1rdns9dhaodvpl639j2bqx55uptag-ebmn5u927reawo27s3azntd44 \
    172.17.0.2:2377
```

生成添加manager node的token：

```sh
$ docker swarm join-token manager

To add a manager to this swarm, run the following command:

    docker swarm join \
    --token SWMTKN-1-61ztec5kyafptydic6jfc1i33t37flcl4nuipzcusor96k7kby-5vy9t8u35tuqm7vh67lrz9xp6 \
    192.168.99.100:2377
```

## Deploy a service to the swarm

```sh
$ docker service create --replicas 1 --name helloworld alpine ping docker.com

9uk4639qpg7npwf3fn2aasksr
```

```sh
$ docker service ls

ID            NAME        SCALE  IMAGE   COMMAND
9uk4639qpg7n  helloworld  1/1    alpine  ping docker.com
```

检查服务：

```sh
$ docker service inspect --pretty helloworld

ID:     9uk4639qpg7npwf3fn2aasksr
Name:       helloworld
Service Mode:   REPLICATED
 Replicas:      1
Placement:
UpdateConfig:
 Parallelism:   1
ContainerSpec:
 Image:     alpine
 Args:  ping docker.com
Resources:
Endpoint Mode:  vip
```

扩展服务：

```sh
$ docker service scale helloworld=5

helloworld scaled to 5
```

删除服务：

```sh
$ docker service rm helloworld

helloworld
```


## Apply rolling updates to a service

https://docs.docker.com/engine/swarm/swarm-tutorial/rolling-update/

```sh
$ docker service create \
  --replicas 3 \
  --name redis \
  --update-delay 10s \
  redis:3.0.6

0u6a4s31ybk7yw2wyvtikmu50
```

```sh
$ docker service update --image redis:3.0.7 redis
redis
```

## Drain a node

https://docs.docker.com/engine/swarm/swarm-tutorial/drain-node/

```sh
$ docker node update --availability drain worker1

worker1
```

```sh
$ docker node update --availability active worker1

worker1
```

## ingress 网络模型

暴露一个服务端口：

```sh
$ docker service create \
  --name my-web \
  --publish 8080:80 \
  --replicas 2 \
  nginx
```

When you access port 8080 on any node, the swarm load balancer routes your request to an active container.

图例：
![](https://docs.docker.com/engine/swarm/images/ingress-routing-mesh.png)

![](https://docs.docker.com/engine/swarm/images/ingress-lb.png)

You can publish a port for an existing service using the following command:

```sh
$ docker service update \
  --publish-add <PUBLISHED-PORT>:<TARGET-PORT> \
  <SERVICE>
```


## 管理nodes

使用label

```sh
$ docker node update --label-add foo --label-add bar=baz node-1

node-1
```

The labels you set for nodes using docker node update apply only to the node entity within the swarm. Do not confuse them with the docker daemon labels for dockerd.

## Deploy services to a swarm

2种方式暴露端口

一种是：

```sh
$ docker service create --name my_web \
                        --replicas 3 \
                        --publish 8080:80 \
                        nginx
```

可以通过任一node来访问服务。

另一种是：

```sh
$ docker service create \
  --mode global \
  --mount type=bind,source=/,destination=/rootfs,ro=1 \
  --mount type=bind,source=/var/run,destination=/var/run \
  --mount type=bind,source=/sys,destination=/sys,ro=1 \
  --mount type=bind,source=/var/lib/docker/,destination=/var/lib/docker,ro=1 \
  --publish mode=host,target=8080,published=8080 \
  --name=cadvisor \
  google/cadvisor:latest
```

使用`mode=host`，该服务只会绑定到该node。`--mode global`的意思是在每一个node上都会自动生成这个服务，新加进来的node也会自动运行一个该服务。


## Roll back to the previous version of a service

In case the updated version of a service doesn’t function as expected, it’s possible to roll back to the previous version of the service using `docker service update`’s `--rollback` flag. This will revert the service to the configuration that was in place before the most recent `docker service updated` command.
Other options can be combined with `--rollback`; for example, `--update-delay 0s` to execute the rollback without a delay between tasks:


```sh
$ docker service update \
  --rollback \
  --update-delay 0s
  my_web

my_web
```

## vote 的实例

https://docs.docker.com/engine/extend/plugins_network/#network-driver-plugins-and-swarm-mode





