[TOC]

在终端中输入 tmux 就可以打开一个新的 tmux session，tmux 的所有操作必须先使用一个前缀键（默认是 ctrl + b）进入命令模式，或者说进入控制台，就像 vim 中的 esc。

## 基本操作

###  信息查询

`tmux list-keys` 列出所有可以的快捷键和其运行的 tmux 命令
`tmux list-commands` 列出所有的 tmux 命令及其参数
`tmux info` 流出所有的 session, window, pane, 运行的进程号，等。

### 窗口控制

- session 会话：session 是一个特定的终端组合。输入 tmux 就可以打开一个新的 session
    - `tmux new -s session_name` 创建一个叫做 session_name 的 tmux session
    - `tmux attach -t session_name` 重新开启叫做 session_name 的 tmux session
    - `tmux switch -t session_name` (在tmux里执行)转换到叫做 session_name 的 tmux session
    - `tmux ls` 列出现有的所有 session
    - `tmux detach` 离开当前开启的 session
    - `tmux kill-server` 关闭所有 session

- window 窗口：session 中可以有不同的 window（但是同时只能看到一个 window）
      + `tmux new-window` 创建一个新的 window
      + `tmux list-windows`
      + `tmux select-window -t :0-9` 根据索引转到该 window
      + `tmux rename-window` 重命名当前 window

- pane 面板：window 中可以有不同的 pane（可以把 window 分成不同的部分）
    - `tmux split-window` 将 window 垂直划分为两个 pane
    - `tmux split-window -h` 将 window 水平划分为两个 pane
    - `tmux swap-pane -[UDLR]` 在指定的方向交换 pane
    - `tmux select-pane -[UDLR]` 在指定的方向选择下一个 pane

更常用的是在 tmux 中直接通过默认前缀 `ctrl + b`之后输入对应命令来操作，具体如下（这里只列出输入默认前缀之后需要输入的操作）：

- 基本操作
    - `?` 列出所有快捷键；按 q 返回
    - `d` 脱离当前会话, 可暂时返回 Shell 界面
    - `s` 选择并切换会话；在同时开启了多个会话时使用
    - `D` 选择要脱离的会话；在同时开启了多个会话时使用
    - `:` 进入命令行模式；此时可输入支持的命令，例如 kill-server 关闭所有 tmux 会话
    - `[` 复制模式，光标移动到复制内容位置，空格键开始，方向键选择复制，回车确认，q/Esc 退出
    - `]` 进入粘贴模式，粘贴之前复制的内容，按 q/Esc 退出
    - `~` 列出提示信息缓存；其中包含了之前 tmux 返回的各种提示信息
    - `t` 显示当前的时间
    - `ctrl + z` 挂起当前会话

- 窗口操作
    - `c` 创建新窗口
    - `&` 关闭当前窗口
    - `[0-9]` 数字键切换到指定窗口
    - `p` 切换至上一窗口
    - `n` 切换至下一窗口
    - `l` 前后窗口间互相切换
    - `w` 通过窗口列表切换窗口
    - `,` 重命名当前窗口，便于识别
    - `.` 修改当前窗口编号，相当于重新排序
    - `f` 在所有窗口中查找关键词，便于窗口多了切换


## 配置

我们可以先进行一些简单的配置，修改 `~/.tmux.conf` 即可，让整个使用更方便。

```
#-- base --#
set -g default-terminal "screen-256color"
set -g display-time 3000
set -g history-limit 10000
set -g base-index 1
set -g pane-base-index 1
set -s escape-time 0
set -g mouse on

#-- bindkeys --#
# split windows like vim.  - Note: vim's definition of a horizontal/vertical split is reversed from tmux's
unbind s
bind s split-window -v
bind S split-window -v -l 40
bind v split-window -h
bind V split-window -h -l 120

# navigate panes with hjkl
bind h select-pane -L
bind j select-pane -D
bind k select-pane -U
bind l select-pane -R

# key bindings for horizontal and vertical panes
unbind %
bind | split-window -h      # 使用|竖屏，方便分屏
unbind '"'
bind - split-window -v      # 使用-横屏，方便分屏

# swap panes
bind ^u swapp -U
bind ^d swapp -D
bind q killp
bind ^e last
unbind r
bind r source-file ~/.tmux.conf \; display "Configuration Reloaded!"

#-- statusbar --#
set -g status-justify centre
set -g status-left "#[fg=red]s#S:w#I.p#P#[default]"
set -g status-right '[#(whoami)#(date +" %m-%d %H:%M ")]'
set -g status-left-attr bright
set -g status-left-length 120
set -g status-right-length 120
set -g status-utf8 on
set -g status-interval 1
set -g visual-activity on
setw -g monitor-activity on
setw -g automatic-rename off

# default statusbar colors
set -g status-bg colour235 #base02
set -g status-fg colour136 #yellow
set -g status-attr default

# default window title colors
setw -g window-status-fg colour244
setw -g window-status-bg default

#setw -g window-status-attr dim

# active window title colors
setw -g window-status-current-fg colour166 #orange
setw -g window-status-current-bg default

#setw -g window-status-current-attr bright

# window title string (uses statusbar variables)
set -g set-titles-string '#T'
set -g status-justify "centre"
set -g window-status-format '#I #W'
set -g window-status-current-format ' #I #W '

# pane border
set -g pane-active-border-fg '#55ff55'
set -g pane-border-fg '#555555'

# message text
set -g message-bg colour235 #base02
set -g message-fg colour166 #orange

# pane number display
set -g display-panes-active-colour colour33 #blue
set -g display-panes-colour colour166 #orange

# clock
setw -g clock-mode-colour colour64 #green

# 修改进入命令模式按键
# remap prefix to Control + a
# set -g prefix C-a
# unbind C-b
# bind C-a send-prefix
```

转自: http://wdxtub.com/2016/03/30/tmux-guide/