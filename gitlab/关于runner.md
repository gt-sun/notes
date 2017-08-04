
toml里面可写的内容


**链接**

- http://docs.gitlab.com/ce/ci/runners/README.html
- https://docs.gitlab.com/runner/
- http://docs.gitlab.com/ce/ci/docker/README.html
- [GitLab Runner Commands](https://docs.gitlab.com/runner/commands/README.html)
- [关于 Runner 的 Executors](https://docs.gitlab.com/runner/executors/README.html)
- [使用docker作为Executor](https://docs.gitlab.com/runner/executors/docker.html)
- [using_docker_build](https://docs.gitlab.com/ce/ci/docker/using_docker_build.html)
- [gitlab-ci-multi-runner](https://gitlab.com/gitlab-org/gitlab-ci-multi-runner/tree/master/docs)
- [config.toml配置](https://docs.gitlab.com/runner/configuration/advanced-configuration.html)

```
[[runners]]
  name = "local-kvm"
  url = "http://192.168.200.4/ci"
  token = "edcdb701e2c383ae6830b85c87da22"
  executor = "shell"
  environment = ["STR1=s_2.1", "STR2=依赖包", "STR3=except:", "HARBOR_PW=Harbor12345"]
  pre_build_script = "egrep -q \"${STR1}|${STR2}\" .gitlab-ci.yml || { echo '.gitlab-ci.yml文件有更新，请下载最新文件';exit 1; }\n                        grep -q \"${STR3}\" .gitlab-ci.yml && { echo '.gitlab-ci.yml文件有更新，请下载最新文件';exit 1; }\n"
  [runners.cache]
```

- GitLab and the Runners communicate through an API, so the only requirement is that the Runner's machine has Internet access.
- Runners run your yaml.
- Runner should not be installed on the same machine as GitLab.
- A Runner can be specific to a certain project or serve multiple projects in GitLab. If it serves all projects it's called a Shared Runner.
- **Shared Runners** are useful for jobs that have similar requirements, between multiple projects.
- **Specific Runners** are useful for jobs that have special requirements or for projects with a specific demand. 
- Specific Runners do not get shared with forked projects automatically.
- Whenever a project is forked, it copies the settings of the jobs that relate to it. This means that if you have shared Runners setup for a project and someone forks that project, the shared Runners will also serve jobs of this project.
- If you are an admin on your GitLab instance, you can make any shared Runner a specific Runner, but you can not make a specific Runner a shared Runner.
- You can configure a Runner to assign it exclusively to a project. When a Runner is locked this way, it can no longer be enabled for other projects. This setting is available on each Runner in *Project Settings > Runners*.
- []默认config文件在`/etc/gitlab-runner/config.toml(root)`，你可以指定不同的toml文件来使用不同的配置。
- gitlab-runner 通过yum安装之后，默认会注册为systemd的一个service，通过`systemctl status gitlab-runner`查看。


### Register docker runner 

To use GitLab Runner with docker you need to register a new runner to use the docker executor:

```
gitlab-ci-multi-runner register \
  --url "https://gitlab.com/" \
  --registration-token "PROJECT_REGISTRATION_TOKEN" \
  --description "docker-ruby-2.1" \
  --executor "docker" \
  --docker-image ruby:2.1 \
  --docker-postgres latest \
  --docker-mysql latest
```

The registered runner will use the `ruby:2.1` docker image and will run two services, `postgres:latest` and `mysql:latest`, both of which will be accessible during the build process.[Accessing the services](http://docs.gitlab.com/ce/ci/docker/using_docker_images.html#accessing-the-services)

By default the executor will only pull images from Docker Hub, but this can be configured in the `gitlab-runner/config.toml` by setting the docker pull policy to allow using local images.


### using_docker_build(3种方式)

http://docs.gitlab.com/ce/ci/docker/using_docker_build.html

- shell方式

项目在runner所在的机器上运行，比如构建java项目的话，机器上需安装mvn/gradle环境。

```sh
gitlab-ci-multi-runner register -n \
  --url https://gitlab.com/ci \
  --registration-token REGISTRATION_TOKEN \
  --executor shell \
  --description "My Runner"
```


- docker-in-docker方式

有3个问题：
    1. 使用了`--docker-privileged`的权限安全；
    2. When using docker-in-docker, each job is in a clean environment without the past history. Concurrent jobs work fine because every build gets it's own instance of Docker engine so they won't conflict with each other. But this also means jobs can be slower because there's no caching of layers.（无法使用本地的image，每个job都是一个新的容器，必须要每次都去拉取image）
    3. By default, docker:dind uses --storage-driver vfs which is the slowest form offered. 

要以如下指令注册runner：

```sh
gitlab-ci-multi-runner register -n \
  --url https://git.bvaccc.top/ci \
  --registration-token zkw4X-xNZeK1zpDuuMkX \
  --executor docker \
  --description "My Docker Runner" \
  --docker-image "docker:17" \
  --docker-privileged
```

实例`.gitlab-ci.yml`配置如下：

```yml
image: docker:17

services:
- docker:dind

before_script:
  - docker info

build_image:
  script:
  - cat README.md
  - hostname
```


- 绑定本地的docker socket

注册如下runner：

```sh
sudo gitlab-ci-multi-runner register -n \
  --url https://gitlab.com/ci \
  --registration-token REGISTRATION_TOKEN \
  --executor docker \
  --description "My Docker Runner" \
  --docker-image "docker:latest" \
  --docker-volumes /var/run/docker.sock:/var/run/docker.sock
```

实例：

```yml
image: docker:latest

before_script:
- docker info

build:
  stage: build
  script:
  - docker build -t my-docker-image .
  - docker run my-docker-image /script/to/run/tests
```

存在3个不足：

1. By sharing the docker daemon, you are effectively disabling all the security mechanisms of containers and exposing your host to privilege escalation which can lead to container breakout. For example, if a project ran docker rm -f $(docker ps -a -q) it would remove the GitLab Runner containers.
1. Concurrent jobs may not work; if your tests create containers with specific names, they may conflict with each other.
1. Sharing files and directories from the source repo into containers may not work as expected since volume mounting is done in the context of the host machine, not the build container, e.g.:
```sh
docker run --rm -t -i -v $(pwd)/src:/home/app/src test-image:latest run_app_tests
```

