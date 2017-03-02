

*可参考：*

1. https://about.gitlab.com/2016/08/11/building-an-elixir-release-into-docker-image-using-gitlab-ci-part-1/
2. http://docs.gitlab.com/ce/ci/yaml/README.html


## YAML的一些规范

- 使用空格代替tab
- 任务名是任意的，通常会包含`script`字段，在`Runner`里面被执行
- 每个任务都是独立的

## `.gitlab-ci.yml` 实例：

```
image: maven
before_script:
  - \cp settings.xml /usr/share/maven/conf/
  - eval $(ssh-agent -s)
  - ssh-add <(echo "$SSH_PRIVATE_KEY")
  - mkdir -p ~/.ssh

stages:
  - deploy

staging-deploy:
  stage: deploy
  script:
    - mvn clean package -P test
    - scp -o StrictHostKeyChecking=no target/website.war root@192.168.8.234:/tmp
    - ssh -o StrictHostKeyChecking=no root@192.168.8.234 /sun/shell/ci.sh
    - echo ok
```

## `environment`配置


```
stages:
  - test
  - build
  - deploy

test:
  stage: test
  script: echo "Running tests"

build:
  stage: build
  script: echo "Building the app"

deploy_staging:
  stage: deploy
  script:
    - echo "Deploy to staging server"
  environment:
    name: staging
    url: https://staging.example.com
  only:
  - master

deploy_prod:
  stage: deploy
  script:
    - echo "Deploy to production server"
  environment:
    name: production
    url: https://example.com
  when: manual
  only:
  - master
```

设置了`when: manual`，需要在`pipelines`页面里手动启动任务。