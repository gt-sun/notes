[TOC]

## 目录

- [Dockerfile 手册](https://docs.docker.com/engine/reference/builder/)
- [dockerfile_best-practices](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/)


## 使用

### RUN

### CMD

3种格式：
- `CMD ["executable","param1","param2"]` (exec form, this is the preferred form)
- `CMD ["param1","param2"]` (as default parameters to ENTRYPOINT)
- `CMD command param1 param2` (shell form)


只能有一个；

**The main purpose of a CMD is to provide defaults for an executing container. **
These defaults can include an executable, or they can omit the executable, in which case you must specify an ENTRYPOINT instruction as well.


> Note: If CMD is used to provide default arguments for the ENTRYPOINT instruction, both the CMD and ENTRYPOINT instructions should be specified with the JSON array format.


If you use the *shell form* of the CMD, then the `<command>` will execute in `/bin/sh -c`.
Unlike the *shell form*, the *exec form* does not invoke a command shell. 
For example, `CMD [ "echo", "$HOME" ]` will not do variable substitution on `$HOME`. If you want shell processing then either use the *shell form* or execute a shell directly, for example: `CMD [ "sh", "-c", "echo $HOME" ]`. 


If you would like your container to run the same executable every time, then you should consider using `ENTRYPOINT` in combination with `CMD`. 


If the user specifies arguments to `docker run` then they will override the default specified in `CMD`.


> Note: Don’t confuse `RUN` with `CMD`. `RUN` actually runs a command and commits the result; `CMD` does not execute anything at build time, but specifies the intended command for the image.