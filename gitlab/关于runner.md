
toml里面可写的内容


*链接*
http://docs.gitlab.com/ce/ci/runners/README.html
https://docs.gitlab.com/runner/
http://docs.gitlab.com/ce/ci/docker/README.html
[GitLab Runner Commands](https://docs.gitlab.com/runner/commands/README.html)
[关于 Runner 的 Executors](https://docs.gitlab.com/runner/executors/README.html)
[使用docker作为Executor](https://docs.gitlab.com/runner/executors/docker.html)



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