---
title: Tmux Notes
tags:
  - Tmux
categories:
  - Misc
excerpt: 最近接触到一些需要用到Tmux的场景，顺手记录一些笔记
date: 2025-12-26 16:38:51
---

# Tmux 简介

<a href="https://github.com/tmux/tmux/wiki" name="https://raw.githubusercontent.com/tmux/tmux/refs/heads/master/logo/icons/128x128/tmux.png" class="LinkCard">Tmux 官方 Wiki</a>

Tmux 是一个终端复用器（terminal multiplexer），可以让你在一个终端窗口中运行多个会话，并且可以在这些会话之间切换、分割窗口等。

所谓“会话”，可以理解为一个独立的终端环境。会话的一个重要特点就是窗口与其中启动的进程是相互绑定的：打开窗口则开启会话；关闭窗口则结束会话，其中进程也会随之终止。因此，当我们使用 SSH 连接到远程服务器时，如果直接在终端中运行某个程序（例如长时间运行的脚本或交互式程序），一旦 SSH 连接断开，程序也会随之终止。

而 Tmux 则可以帮助我们解决这个问题：Tmux 将会话与窗口解耦，使得会话可以在后台持续运行。这样，即使 SSH 连接断开，Tmux 会话仍然保持运行状态，程序也不会终止。我们可以在重新连接到服务器后，通过 Tmux 恢复之前的会话，继续操作。

在 Tmux 中，一个**会话**（session）里面可以包含多个**窗口**（window），每个**窗口**又可以分割成多个窗格（pane）。

## Tmux 的安装
在大多数 Linux 发行版中，可以通过包管理器安装 Tmux。
```bash
# Ubuntu/Debian
sudo apt-get install tmux

# CentOS/RHEL
sudo yum install tmux

# macOS (使用 Homebrew)
brew install tmux
```

## Tmux 的基本使用
### 启动和退出
使用下面的命令可以快速启动 Tmux，相当于创建一个新的会话并进入该会话的第一个窗口：
```bash
tmux
```

按下 `Ctrl + d` 或直接输入 `exit` 可以退出当前的 Tmux 窗口。如果这是该会话中的最后一个窗口，整个会话也会结束。

### 配置文件
Tmux 的配置文件位于用户主目录下的 `.tmux.conf` 文件中。可以通过编辑该文件来定制 Tmux 的行为和外观。下面是一个简单的配置文件示例：
```txt
# 设置前缀键为 Ctrl + a
set -g prefix C-a
unbind C-b
bind C-a send-prefix

# 启用鼠标支持（可以鼠标点击切换面板/窗口）
set -g mouse on

# 设置状态栏颜色
set -g status-bg black
set -g status-fg white

# 设置面板边框颜色
set -g pane-border-style fg=green
set -g pane-active-border-style fg=red

# 设置窗口从1开始编号（默认是0）
set -g base-index 1
setw -g pane-base-index 1
```

修改配置后，需要重新加载配置文件才能生效。可以在 Tmux 会话中使用以下命令重新加载配置文件：
```bash
tmux source-file ~/.tmux.conf
```

我在实际使用中，只自定义配置**启用鼠标支持**这一项，开启后可以通过鼠标点击来切换窗格和窗口，长按右键拖动选中来执行对应操作等，非常方便。

### 快捷键
Tmux 窗口有大量的快捷键。所有快捷键都要通过前缀键唤起。默认的前缀键是 `Ctrl+b`，按下这个组合键后，可以使用其他快捷键来执行各种操作，下面均记作 `Ctrl+b <key>`。

如果需要了解所有快捷键，可以使用 `list-keys` 命令查看：
```bash
tmux list-keys
```

### 帮助文档
可以使用 `list-commands` 命令查看所有 Tmux 命令及参数：
```bash
tmux list-commands
```

也可以使用按下 `Ctrl+b ?` 来查看帮助文档。

### 命令模式
Tmux 还提供了命令模式，可以通过前缀键 `Ctrl+b :` 进入命令模式。在命令模式下，可以输入各种 Tmux 命令来执行操作，相当于直接在命令行中运行 `tmux <command>`。

### 复制模式
Tmux 提供了复制模式，可以让用户在 Tmux 窗口中滚动查看历史输出，并且可以复制文本。

首先使用 `Ctrl+b [` 进入复制模式，然后可以使用方向键或 `Page Up`/`Page Down` 键移动光标，然后按下 `Space` 键开始选择文本，移动光标选择需要复制的文本后，按下 `Enter` 键完成复制。复制的文本会被保存到 Tmux 的缓冲区中，可以使用 `Ctrl+b ]` 粘贴复制的文本。

# 会话管理
## 新建会话
此前我们提到，直接运行 `tmux` 命令会新建一个会话并进入该会话的第一个窗口。默认情况下，Tmux 会为新建的会话分配一个编号，编号从 0 开始递增，也可以通过 `-s` 参数指定名称：
```bash
tmux new -s <session-name>
```

## 重命名会话
如果已经创建了一个会话，但想要更改它的名称，可以使用 `rename-session` 命令把名为 `<old-name>` 的会话重命名为 `<new-name>`：
```bash
tmux rename-session -t <old-name> <new-name>
```

也可以使用快捷键 `Ctrl+b $` 来重命名当前会话。

## 列举会话
要查看当前所有的 Tmux 会话，可以使用 `list-sessions` 命令（简写为 `ls`）：
```bash
tmux ls
```

也可以使用快捷键 `Ctrl+b s` 来列出所有会话。

## 分离会话
在 Tmux 会话中，可以使用 `detach` 命令分离当前会话：
```bash
tmux detach
```

也可以使用快捷键 `Ctrl+b d` 来分离当前会话。分离会话后，Tmux 会话会继续在后台运行，所有的窗口和进程都不会终止。

## 接入会话
要重新接入一个已经存在的 Tmux 会话，可以使用 `attach` 命令。如果只有一个会话，直接运行该命令即可接入该会话；如果有多个会话，则需要通过 `-t` 选项指定要接入的会话编号或名称：
```bash
tmux attach -t <session-name-or-id>
```

## 切换会话
要在多个 Tmux 会话之间切换，可以使用 `switch-client` 命令：
```bash
tmux switch-client -t <session-name-or-id>
```

也可也以使用快捷键 `Ctrl+b s` 来选择并切换到其他会话。

## 结束会话
要结束一个 Tmux 会话，可以使用 `kill-session` 命令。
```bash
tmux kill-session -t <session-name-or-id>
```

# 窗口管理
窗口是 Tmux 会话中的一个重要组成部分，通常呈现为 Tmux 界面底部状态栏中的标签页，用 `*` 号标记当前聚焦的窗口。每个窗口都可以运行一个独立的终端环境。

## 新建窗口
在 Tmux 会话中， `new-window` 命令用于新建一个窗口，可以添加参数 `-n` 来指定窗口名称：
```bash
tmux new-window -n <window-name>
```

也可以使用快捷键 `Ctrl+b c` 来新建一个窗口。

## 切换窗口
在 Tmux 会话中，可以使用 `select-window` 命令切换到指定的窗口：
```bash
tmux select-window -t <window-name-or-id>
```

也可以使用快捷键 `Ctrl+b n` 和 `Ctrl+b p` 来切换到底部状态栏中的下一个和或上一个窗口，或者使用 `Ctrl+b <window-number>` 直接切换到指定编号的窗口，或者使用 `Ctrl+b w` 来列出所有窗口并选择切换。

## 重命名窗口
可以使用 `rename-window` 命令重命名当前窗口：
```bash
tmux rename-window <new-window-name>
```

也可以使用快捷键 `Ctrl+b ,` 来重命名当前窗口。

## 关闭窗口
要关闭当前窗口，可以使用 `kill-window` 命令：
```bash
tmux kill-window
```

也可以使用快捷键 `Ctrl+b &` 来关闭当前窗口。

# 窗格管理
窗格是 Tmux 窗口中的一个子区域，可以通过分割窗口来创建多个窗格，实现同时查看和操作多个终端会话。每个窗格都可以运行一个独立的终端环境。

## 分割窗格
在 Tmux 窗口中，可以使用 `split-window` 命令来分割窗格。默认情况下， `split-window` 会将当前窗格水平分割成两个窗格。可以使用 `-h` 选项进行垂直分割：
```bash
# 水平分割窗格
tmux split-window

# 垂直分割窗格
tmux split-window -h
```

也可以使用快捷键 `Ctrl+b "` 来水平分割窗格，使用 `Ctrl+b %` 来垂直分割窗格。

## 切换窗格
在 Tmux 窗口中，可以使用 `select-pane` 命令切换到指定的窗格：
```bash
tmux select-pane -t <pane-id> # 切换到指定窗格

tmux select-pane -U  # 切换到上方窗格
tmux select-pane -D  # 切换到下方窗格
tmux select-pane -L  # 切换到左侧窗格
tmux select-pane -R  # 切换到右侧窗格
```

也可以使用快捷键 `Ctrl+b ;` 来切换到上一个窗格，或者使用 `Ctrl+b o` 来切换到下一个窗格。还可以使用方向键结合前缀键来切换窗格，例如 `Ctrl+b 上/下/左/右`。

其中 `<pane-id>` 可以通过 `tmux list-panes` 命令查看当前窗口中的所有窗格及其编号，也可以使用 `Ctrl+b q` 快捷键显示所有窗格编号，然后按对应的数字键切换到指定窗格。

## 交换窗格位置
在 Tmux 窗口中，可以使用 `swap-pane` 命令交换当前窗格与指定窗格的位置：
```bash
tmux swap-pane -U  # 当前窗格与上移
tmux swap-pane -D  # 当前窗格与下移
tmux swap-pane -L  # 当前窗格与左移
tmux swap-pane -R  # 当前窗格与右移
```

也可以使用快捷键 `Ctrl+b {` 和 `Ctrl+b }` 来交换当前窗格与左侧或右侧窗格的位置。

## 调整窗格大小
在 Tmux 窗口中，可以使用 `resize-pane` 命令调整当前窗格的大小：
```bash
tmux resize-pane -U 5  # 向上调整当前窗格大小5行
tmux resize-pane -D 5  # 向下调整当前窗格大小5行
tmux resize-pane -L 10 # 向左调整当前窗格大小10列
tmux resize-pane -R 10 # 向右调整当前窗格大小10列
```

也可以使用快捷键 `Ctrl+b Alt+方向键` 来调整当前窗格的大小，例如 `Ctrl+b Alt+上/下/左/右`。

如果开启了鼠标支持，还可以通过鼠标拖动窗格边界来调整大小。

## 关闭窗格
要关闭当前窗格，可以使用 `kill-pane` 命令：
```bash
tmux kill-pane
```

也可以使用快捷键 `Ctrl+b x` 来关闭当前窗格。
