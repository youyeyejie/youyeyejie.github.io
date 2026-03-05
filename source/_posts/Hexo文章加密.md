---
title: Hexo文章加密
category_bar: true
date: 2025-12-31 15:04:44
tags:
  - Hexo
  - Fluid
categories:
  - Hexo Blog Building
excerpt: Hexo 使用 hexo-blog-encrypt 插件实现文章加密功能，并对 Fluid 主题进行适配和美化。
index_img: /_posts/Hexo文章加密/image.webp
---

# 前言
hexo-blog-encrypt 是一款应用于 Hexo 博客框架的加密插件，可用于加密单独某篇文章或某个 Tag 下的所有文章。但是在使用过程中，我发现网上的一些信息已经比较过时了，因此决定亲自尝试并记录下整个过程，以便为其他用户提供参考。

<a href="https://github.com/D0n9X1n/hexo-blog-encrypt" target="_blank" logourl="https://github.githubassets.com/assets/apple-touch-icon-144x144-b882e354c005.png" class="LinkCard">hexo-blog-encrypt GitHub 仓库</a>

在本文中，我将介绍如何在 Hexo 博客中使用 hexo-blog-encrypt 插件实现文章加密功能，并对 Fluid 主题进行适配和美化。

# 安装并配置 hexo-blog-encrypt 插件
## 安装
使用 npm 安装 hexo-blog-encrypt 插件：

```bash
npm install hexo-blog-encrypt --save
```

## 全局配置
然后，在 Hexo 博客的 `_config.yml` 文件中添加以下配置：

```yaml
# hexo-blog-encrypt
encrypt:
  enable: true
  abstract: "本文已加密，请输入密码查看完整内容"
  message: "请输入密码"
  tags:
    - [name: "", password: ""]
  wrong_pass_message: "密码错误，请重试！"
  wrong_hash_message: "内容损坏"
  silent: true
  theme: shrink
```

对上面的配置进行说明：

- `enable`: 启用或禁用加密功能。
- `abstract`: 显示在加密文章摘要中的提示信息。
- `message`: 提示用户输入密码的消息。
- `tags`: 定义需要加密的文章标签及其对应的密码。
- `wrong_pass_message`: 用户输入错误密码时显示的消息。
- `wrong_hash_message`: 哈希校验失败时显示的消息。
- `silent`: 是否禁用日志输出。
- `theme`: 定义加密界面的主题样式，具体主题的样式可以参考下面的博客。

<a href="https://mhexo.github.io/" logourl="https://avatars1.githubusercontent.com/u/3142935?v=3&s=466%20or%20file" target="_blank" class="LinkCard">mHexo 博客</a>

## 单独文章配置
如果需要对单独某篇文章进行加密，可以在该文章的 Front Matter 中添加以下配置：

```yaml
password: test
abstract: This article has been encrypted, please enter your password to view the full content
message: Please enter the password
wrong_pass_message: Sorry, the password seems incorrect, please try again.
wrong_hash_message: Sorry, this article's content seems to be corrupted.
```

而对于在上面全局配置中定义的加密标签，如果不希望加密，只需要在文章的 Front Matter 中添加 `password: ""` 即可。

# 适配 Fluid 主题
在安装并配置好 hexo-blog-encrypt 插件后，我发现其自带的样式与 Fluid 主题不太匹配。并且在输入错误密码时，使用的是浏览器的默认 alert 弹窗，显得比较突兀。因此，我决定对其进行适配和美化。

由于上一篇文章我们已经自定义了提示气泡组件，这次我们将利用该组件来替换默认的 alert 弹窗。

<a href="/_posts/Fluid自定义提示气泡/" logourl="/_posts/Fluid自定义提示气泡/image.webp" class="LinkCard">Fluid 自定义提示气泡</a>

首先在 `source/js/` 目录下创建一个新的 JavaScript 文件 `Crypto.js`，并添加以下代码：

```javascript
// 修改输入框显示逻辑
const input = document.getElementById('hbePass');
let value = '';

if (input) {
    input.addEventListener('focus', function () {
        this.value = value;
    });
    input.addEventListener('blur', function () {
        value = this.value; // 保存真实值
        this.value = ''; 
    });
}

// 修改 alert 提示为 tooltip 提示
const hbeMainElement = document.getElementById("hexo-blog-encrypt");
const wrongPassMessage = hbeMainElement?.dataset["wpm"];
const wrongHashMessage = hbeMainElement?.dataset["whm"];

const originalAlert = window.alert;
window.alert = function (message) {
    // 先判断 tooltip 存在 + 消息匹配，避免报错
    if (message === wrongPassMessage) {
        showTooltip({
            type: "error",
            message: message,
            duration: 5000,
        });
    }
    else if (message === wrongHashMessage) {
        showTooltip({
            type: "warning",
            message: message,
            duration: 5000,
        });
    }
    else {
        originalAlert(message);
    }
};

// 解密成功后移除 hbe-prefix 元素
function removePrefixElement() {
    const hbePrefix = document.querySelector('hbe-prefix');
    if (hbePrefix && hbePrefix.parentNode) {
        hbePrefix.parentNode.removeChild(hbePrefix);
    }
}

document.addEventListener("DOMContentLoaded", removePrefixElement);
window.addEventListener('hexo-blog-decrypt', () => {
    showTooltip({
        type: "success",
        message: "已解密!",
        duration: 3000,
    });
    setTimeout(() => {
        removePrefixElement();
        addHighlightTool(); // 重应用 shiki highlight
        generateLinkCard(); // 重新生成 LinkCard
    }, 1);
});
```

其中，利用在解密触发的名为 `hexo-blog-decrypt` 的事件，我们添加回调来重新应用代码高亮和 LinkCard 生成函数。**如果有其他脚本在解密后无法正确应用，也可以在这里添加。**

然后，在 `source/css/` 目录下创建一个新的 CSS 文件 `Crypto.css`，并添加以下代码：

```css
:root {
    --hbe-input-field-color: #818181;
    --hbe-input-label-color: #818181;
    --hbe-btn-bg-color: #dbdddf;
    --hbe-btn-bb-color: #818181;
}
[data-user-color-scheme="dark"] {
    --hbe-input-field-color: #a1a1a1;
    --hbe-input-label-color: #a1a1a1;
    --hbe-btn-bg-color: #353946;
    --hbe-btn-bb-color: #a1a1a1;
}


.hbe-input-field-shrink {
    color: var(--hbe-input-field-color) !important;
}

.hbe-input-label-shrink::after {
    height: 5px !important;
    background: var(--hbe-input-label-color) !important;
}
.hbe-input-label-content {
    font-size: 24px;
    color: var(--hbe-input-label-color) !important;
}

.hbe-button {
    color: var(--hbe-btn-color) !important;
    background: var(--hbe-btn-bg-color) !important;
    border-bottom-color: var(--hbe-btn-bb-color) !important;
    transition: all 0.3s ease-in-out;
    display: inline-block;
    position: relative;
}
.hbe-button:hover {
    transform: translateY(-3px);
}
.hbe-button:after {
    border: 0 !important;
}
```

最后，在 Hexo 博客的 `_config.yml` 文件中添加以下配置，以确保新创建的 JavaScript 和 CSS 文件被正确加载：

```yaml
custom_js:
  - /js/Crypto.js
custom_css:
  - /css/Crypto.css
```

这样，我们就将 alert 弹窗替换为了自定义的提示气泡组件，并且对加密界面的样式进行了美化，使其更符合 Fluid 主题的风格。

# 效果展示
下面是加密文章的效果展示：

<a href="/_posts/An-encrypted-post/" logourl="/_posts/Hexo文章加密/image.webp" class="LinkCard">加密文章示例</a>

# 总结
通过本文的介绍，我们成功地在 Hexo 博客中使用 hexo-blog-encrypt 插件实现了文章加密功能，并对 Fluid 主题进行了适配和美化。希望这篇文章能为其他用户提供参考，帮助他们更好地保护自己的博客内容。

