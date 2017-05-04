
http://docs.gitlab.com/ce/ci/README.html



- example

https://gitlab.com/gitlab-org/gitlab-ci-yml


- 项目需发布至不同的环境

首先一个环境对应一个Runner，
定义Runner的tags，在.gitlab-ci.yml中使用不同的tags。


- 使用策略

    - You can now merge automatically after a build has passed
    - add `[ci skip]` to each commit message for skip build.
    - 使用`only`、`except`来指定分支进行构建。https://docs.gitlab.com/ce/ci/yaml/#only-and-except
