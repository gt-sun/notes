[TOC]


*可参考：*

1. https://about.gitlab.com/2016/08/11/building-an-elixir-release-into-docker-image-using-gitlab-ci-part-1/
2. http://docs.gitlab.com/ce/ci/yaml/README.html



## YAML的一些规范

- 使用空格代替tab
- 任务名是任意的，通常会包含`script`字段，在`Runner`里面被执行
- 每个任务都是独立的
- 任务名不可以是以下名字：http://docs.gitlab.com/ce/ci/yaml/README.html#gitlab-ci-yml

### variables

http://docs.gitlab.com/ce/ci/variables/README.html

### stages字段

1. Jobs of the same stage are run in parallel.
2. Jobs of the next stage are run after the jobs from the previous stage complete successfully.
3. If no `stages` are defined in `.gitlab-ci.yml`, then the `build`, `test` and `deploy` are allowed to be used as job's stage by default.
4. If a job doesn't specify a `stage`, the job is assigned the `test` stage.


### cache

`cache` is used to specify a list of files and directories which should be
cached between jobs. You can only use paths that are within the project
workspace.


举例：

```yaml
stages:
  - test
  - deploy

cache:
  paths:
  - ./data

test:
  stage: test
  script: mkdir -p ./data && echo 123 > ./data/test.log

deploy_staging:
  stage: deploy
  script:
    - cat ./data/test.log
```


> only `/builds` and `/cache` is transferred you have no-way to cache container-local files.
You need to relocate your container-local directory (like: `/root/.cabal`, `/root/.gradle`) to `/cache`. If you put that in /cache you don't need to use the `cache` in `.gitlab-ci.yml` directive then, since this is already preserved between builds.


Cache all Git untracked files:
（比如本次构建新生成了一些文件在项目中，那么下一次git拉取项目的时候不会删除这些文件）

```yml
rspec:
  script: test
  cache:
    untracked: true
```




`cache` is not:
Caching is not designed to pass artifacts between stages.Cache is for runtime dependencies needed to compile the project


### artifacts


一个实例用法：

```yml
build:
  type: build
  script:
  - make binaries
  artifacts:
    paths:
    - my/binaries

test:
  type: test
  script:
  - my/binaries do-something
```

**artifacts 和 cache 区别**

- cache 'node_modules' for the NEXT run (triggered by a commit to the repo) so that they don't have to be installed again (unless the cache gets deleted)
- create an artifact containing 'node_modules' and 'build' in 'job_build', so that 'job_test' in THIS run can use those files

```yml
job_build:
  stage: build
  script:
    - npm install
  cache:
    key: ${CI_BUILD_REF_NAME}
    paths:
      - node_modules/
  artifacts:
    paths:
     - node_modules/
     - build/

job_test:
  stage: test
  script:
    - gulp test:unit
```

artifacts是为下一个job用的；
cache是为下一次构建用的；


### jobs

http://docs.gitlab.com/ce/ci/yaml/README.html#jobs

### services字段

The `services` keyword defines just another docker image that is run during your job and is linked to the docker image that the `image` keyword defines. This allows you to access the service image during build time.

The service image can run any application, but the most common use case is to run a database container, eg. `mysql`. It's easier and faster to use an existing image and run it as an additional container than install `mysql` every time the project is built.

You can see some widely used services examples in the relevant documentation of [CI services examples](http://docs.gitlab.com/ce/ci/services/README.html).


## 在build环境中使用ssh

http://docs.gitlab.com/ce/ci/ssh_keys/README.html

## `.gitlab-ci.yml` 实例

```yaml
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

### A sample of `.gitlab-ci.yml` for a gradle project

```yaml
image: java:8-jdk

stages:
  - build
  - test
  - deploy

before_script:
#  - echo `pwd` # debug
#  - echo "$CI_BUILD_NAME, $CI_BUILD_REF_NAME $CI_BUILD_STAGE" # debug
  - export GRADLE_USER_HOME=`pwd`/.gradle

cache:
  paths:
    - .gradle/wrapper
    - .gradle/caches

build:
  stage: build
  script:
    - ./gradlew assemble
  artifacts:
    paths:
      - build/libs/*.jar
    expire_in: 1 week
  only:
    - master

test:
  stage: test
  script:
    - ./gradlew check

deploy:
  stage: deploy
  script:
    - ./deploy

after_script:
  - echo "End CI"
```

## `environment`配置


```yaml
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


