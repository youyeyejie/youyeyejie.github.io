---
title: VSCode Snippets 设置与使用
date: 2026-03-05 22:54:58
tags:
    - VSCode
    - Snippets
categories:
    - Misc
excerpt: 在编写课程笔记时意外发现的一个非常实用的小功能
index_img: /_posts/VSCode-Snippets-设置与使用/image-1.webp
---

# 前言
最近在编写课程笔记时，苦恼于常常需要在 Markdown 中插入 Latex 公式，这意味着我需要来回切换输入法以输入 `$ $` 或 `$$ $$`。此外，Hexo 博客的 Fluid 主题集成的 Tag 插件也需要频繁输入 `{% tag %}` 来标记标签。为了提高效率，我查阅相关资料，发现在 VSCode 中，可以使用自定义**代码片段（Snippets）**快速插入常用代码模板，从而极大地提升了我的写作效率。

# Snippets 的设置
VSCode 的 Snippets 功能允许用户为特定的编程语言或文件类型创建自定义代码片段。以下是设置 Snippets 的步骤：

1. 打开 VSCode，点击左侧的齿轮图标打开命令面板（或在 Windows/Linux 上按 `Ctrl + Shift + P`，在 macOS 上按 `Cmd + Shift + P`）。
2. 输入 Snippets: Configure Snippets，接着可以选择为**全局**、**当前文件夹**或某一特定语言创建 Snippets 设置。
    {% gi 2 2 %}
    ![](VSCode-Snippets-设置与使用/image.webp)
    ![](VSCode-Snippets-设置与使用/image-2.webp)
    {% endgi %}
3. 以 Markdown 语言为例，选中对应选项后会创建并打开一个 `markdown.json` 的文件，在其中可以定义 Snippets，可以参考文件中自带的注释。具体而言，Snippets 的定义参考以下格式：
    ```json
    {
        "Snippet Name": {
            "prefix": "trigger",
            "body": [
                "code to insert"
            ],
            "description": "Description of the snippet",
            "scope": "markdown",
            "include": ["regex/file/name"],
            "exclude": ["regex/file/name"]
        }
    }
    ```

    其中：

    - `Snippet Name` 是代码片段的名称，可以随意命名。
    - `prefix` 是触发代码片段的关键词，当你输入这个关键词时，VSCode 会提示你使用这个代码片段。我尝试后发现一个奇怪的现象：若我使用 `lp` 等纯英文作为 prefix 时，无法在 markdown 文件中触发，而修改为 `/lp` 后就可以正常使用了。
    - `body` 是代码片段的内容，可以是多行代码，使用数组的形式表示。代码支持正则表达式，并可以使用占位符（如 `$0`、`${1:default}`）来定义可编辑的部分。其中，`$0` 表示光标最终停留的位置，`${1:default}` 表示第一个占位符，默认值为 `default`，其余同理，可以使用 `Tab` 键在占位符之间切换。
    - 以及下面几个可选项
        - `description` 是对代码片段的简要描述，方便在提示时识别。
        - `scope` 是代码片段的适用范围，若前面选的是全局配置，则可以在这里指定适用的语言类型。
        - `include` 和 `exclude` 用于进一步细化代码片段的适用范围，可以使用正则表达式或文件路径来限制生效的文件。
4. 此外，也可以使用 [snippet-generator](https://snippet-generator.app/) 这个在线工具快速生成 Snippets 的 JSON 配置，支持多种编程语言和文件类型，非常方便。

# Snippets 的使用
定义好 Snippets 后，在对应的文件中输入前缀，VSCode 会自动提示使用对应代码片段。此时就与大部分编程语言的自动补全一致，可以使用 `Tab` 或 `Enter` 键来选择并插入代码片段，并且在插入后可以通过 `Tab` 键在占位符之间切换，快速编辑代码片段中的内容。

![](VSCode-Snippets-设置与使用/image-1.webp)

# 我的 Snippets 配置
以下是我在 Markdown 文件中使用的 Snippets 配置示例：

```json
{
    "Resizable parentheses": {
        "prefix": "/lp",
        "body": [
            "\\left( $1 \\right)"
        ],
        "description": "Resizable parentheses"
    },
    "Resizable brackets": {
        "prefix": "/lb",
        "body": [
            "\\left[ $1 \\right]"
        ],
        "description": "Resizable brackets"
    },
    "Resizable curly brackets": {
        "prefix": "/lc",
        "body": [
            "\\left\\{ $1 \\right\\\\}"
        ],
        "description": "Resizable curly brackets"
    },
    "Code block": {
        "prefix": "/cb",
        "body": [
            "```$1\n$2\n```"
        ],
        "description": "Code block"
    },
    "Inline code": {
        "prefix": "/ic",
        "body": [
            "`$1`"
        ],
        "description": "Inline code"
    },
    "Latex inline math": {
        "prefix": "/math",
        "body": [
            "$$1$"
        ],
        "description": "Latex inline math"
    },
    "Latex display math": {
        "prefix": "/dmath",
        "body": [
            "$$\n$1\n$$"
        ],
        "description": "Latex display math"
    },
    "Hexo fold":{
        "prefix": "/fold",
        "body": [
            "{% fold info @${1:title} %}\n$2\n{% endfold %}"
        ],
        "description": "Hexo blog fold block"
    },
    "Hexo note":{
        "prefix": "/note",
        "body": [
            "{% note info %}\n$1\n{% endnote %}"
        ],
        "description": "Hexo blog note block"
    },
    "Hexo group image":{
        "prefix": "/gi",
        "body": [
            "{% gi ${1:total} ${2:layout} %}\n$3\n{% endgi %}"
        ],
        "description": "Hexo blog group image block"
    },
    "Hexo linkcard":{
        "prefix": "/lc",
        "body": [
            "<a href=\"$1\" logourl=\"$2\" class=\"LinCard\">$3</a>"
        ],
        "description": "Hexo blog linkcard block"
    },
    "Hexo tag":{
        "prefix": "/tg",
        "body": [
            "{% label primary @${1:text} %}"
        ],
        "description": "Hexo blog tag block"
    }
}
```

# 结语
以上是我在 VSCode 中设置和使用 Snippets 的经验分享。通过自定义 Snippets，终于不用回忆 Fluid 主题中各种标签的写法啦！（~~笑~~）