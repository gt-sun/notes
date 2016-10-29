## 理解 Linux/Unix 登录脚本

- /etc/profile

默认情况下，Debian 提供 / etc/profile 文件，这个文件用来设置 $PATH 变量（$PATH 通常用来声明命令的搜索路径），可以立即生效。下面的代码是 / etc/profile 的一部分。

```
if [ "`id -u`" -eq 0 ]; then
    PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
else
    PATH="/usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/games"
fi
export PATH
```

为了方便，root 用户（ID 为 0）和其他任何用户的路径都不同。这是因为系统二进制目录（sbin 目录）位置传统上是作为系统管理程序、或必须以 root 身份运行的程序存放的保留位置。而 games 路径对于 root 用户来说是省略的，因为不到非必要的时候，绝不可能使用 root 用户来运行游戏程序。

- ~/.bash_profile, ~/.bash_login, and ~/.profile

`/etc/profile` 存在的一个潜在问题是，它位于系统范围的路径中。这意味着修改它会影响这个系统上的所有用户。在个人计算机上，这可能不是太大的问题，但是修改它同时还需要 root 权限。由于这些原因，每个单独的 Bash 用户账户可以创建`~/.bash_profile`, `~/.bash_login` 和 `~/.profil` 这几个文件中的任意一个作为 Bash 的配置文件来源。在列出的顺序中第一个被找到的文件会被作为配置文件，其余的都会被忽略。