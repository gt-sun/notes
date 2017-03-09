

*链接*
http://docs.gitlab.com/ce/ci/runners/README.html
https://docs.gitlab.com/runner/
http://docs.gitlab.com/ce/ci/docker/README.html

- GitLab and the Runners communicate through an API, so the only requirement is that the Runner's machine has Internet access.
- A Runner can be specific to a certain project or serve multiple projects in GitLab. If it serves all projects it's called a Shared Runner.


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

The registered runner will use the `ruby:2.1` docker image and will run two services, `postgres:latest` and `mysql:latest`, both of which will be accessible during the build process.

By default the executor will only pull images from Docker Hub, but this can be configured in the `gitlab-runner/config.toml` by setting the docker pull policy to allow using local images.
