---
title: Fluid主题美化
category_bar: true
tags:
  - Hexo
  - Fluid
categories:
  - Hexo Blog Building
excerpt: Fluid 主题美化记录1.0——无侵入式全站美化
index_img: /_posts/Fluid主题美化/image.webp
date: 2025-06-21 13:05:20
---

# 前言

上一篇博客提到过，我在Fluid、Solitude、Matery、ShokaX等一众主题中选择了Fluid主题，但对于其他主体内置的一些功能，我还是十分眼馋的。那怎么办呢，当然是自己进行美化了。当然，作为一个新手，大部分美化都是参考其他博客的经验进行的，部分自己摸索的美化方式也比较粗糙，不够优雅，参考需谨慎。

在开始配置主题以及美化前，建议将 `themes/fluid/_config.yml` 文件复制到根目录下，并改名为 `_config.fluid.yml`，后续修改均在 `_config.fluid.yml` 文件中进行，此处的配置会覆盖主题内置的 `_config.yml` 文件中的配置，这样可以避免在主题更新时丢失配置。

# 黑暗模式下修改加粗字体和斜体样式

由于个人习惯在黑暗模式下阅读，且发现Fluid主题在黑暗模式下加粗字体和并不明显，相比之下Matery主题修改了加粗字体的颜色，深得我心，于是决定对Fluid主题进行类似的修改。

{% fold info @此方式已被弃用，改用无侵入的方法实现 %}
首先在博客根目录下的 `_config.fluid.yml` 文件对 `color` 进行修改，增加以下内容
```yaml
color：
  # 原有内容，下面是新加的

  # 文章正文加粗/斜体字体色
  # Color of post text
  my-post_text_color: "#2c3e50"
  my-post_text_color_dark: "#feeed6"
```

接着需要修改 `themes/fluid/source/css/_pages/_base/base.styl` 文件，在 `body` 选择器下添加以下内容
```stylus
body
  // 原有内容，下面是新加的
  strong
    color var(--my-post-text-color)
  em
    color var(--my-post-text-color)
```

修改 `themes/fluid/source/css/_pages/_base/color-schema.styl` 文件，分别在 `:root` 和 `dark-colors` 下增加以下内容
```stylus
:root
  --my-post-text-color $my-post-text-color

dark-colors()
  --my-post-text-color $my-post-text-color-dark
```

然后修改 `themes/fluid/source/css/_variables/base.styl` 文件，在 `post` 注释处增加以下内容
```stylus
// post
$my-post-text-color = theme-config("color.my_post_text_color", "#2c3a46")
$my-post-text-color-dark = theme-config("color.my_post_text_color_dark", "#feeed6")
```
{% endfold %}

首先在 `source/css/` 目录下新建一个 `StrongInDark.css` 文件（如果不存在该目录则需要先创建），代码如下：
```css
:root {
  --my-post-text-color: #2c3e50;
}
[data-user-color-scheme="dark"] {
  --my-post-text-color: #feeed6;
}


.page-content strong, .post-content strong {
    color: var(--my-post-text-color);
}
.page-content em, .post-content em {
    color: var(--my-post-text-color);
}
```
并在 `_config.fluid.yml` 文件的 `custom_css` 部分添加以下内容：
```yaml
custom_css:
  - /css/StrongInDark.css
```

至此，黑暗模式下加粗字体和斜体样式的修改就完成了。

# 博客标题霓虹灯效样式

{% fold info @此方式已被弃用，改用无侵入的方法实现 %}
由于我对Fluid的各种设置不太了解，导致我在上一步修改加粗字体和斜体样式后，博客的标题也被修改了颜色，因此我又单独调整了博客标题的颜色。

首先在 `themes/fluid/source/css/_pages/_base/_widget/header.styl` 文件中进行修改，追加以下内容
```stylus
.navbar-title
  outline none
  --c lightseagreen
  text-shadow 0 0 10px var(--c),0 0 20px var(--c),0 0 40px var(--c),0 0 80px var(--c),0 0 160px var(--c)
  animation animate 5s linear infinite
  color var(--navbar_text_color)

@keyframes animate{
  to{
      filter: hue-rotate(360deg)
  }
}
```
其中 `color var(--navbar_text_color)` 是为了将博客标题的颜色恢复为我们在 `_config.fluid.yml` 文件中设置的颜色。
{% endfold %}

标题的霓虹灯效果是参考KEVIN'S BLOG的实现并进行修改。

<a href="https://blog.kevinchu.top/2023/07/17/hexo-theme-fluid-modify/" name="https://static.kevinchu.top/blog/assets/img/avatar_03.jpg" class="LinkCard">Hexo博客Fluid主题魔改记录</a>

首先在 `source/css/` 目录下新建一个 `TitleNeon.css` 文件（如果不存在该目录则需要先创建），代码如下：
```css
.navbar-title {
  outline: none;
  --c: lightseagreen;
  text-shadow: 0 0 10px var(--c), 0 0 20px var(--c), 0 0 40px var(--c), 0 0 80px var(--c), 0 0 160px var(--c);
  animation: animate 5s linear infinite;
}
@keyframes animate{
  to{
      filter: hue-rotate(360deg);
  }
}
```

然后在 `_config.fluid.yml` 文件的 `custom_css` 部分添加以下内容：
```yaml
custom_css:
  - /css/TitleNeon.css
```

当然，为了使博客标题的霓虹灯效果生效，还是不可避免的需要对主题文件进行修改。

需要修改的是 `themes/fluid/layout/_partials/header/navigation.ejs` 文件，在最前面几行找到对应导航栏标题的标签内容进行修改即可：
```diff
-<strong><%= theme.navbar.blog_title || config.title %></strong>
+<strong class="navbar-title"><%= theme.navbar.blog_title || config.title %></strong>
```

至此，博客标题的霓虹灯效果就完成了。

# 标题颜色渐变样式

实现标题颜色渐变效果的代码同样参考了的是EmoryHuang's Blog的实现并进行修改。

<a href="https://emoryhuang.cn/blog/1729600336.html" name="https://emoryhuang.cn/img/friend_404.gif" class="LinkCard">EmoryHuang's Blog</a>

在 `source/css/` 目录下新建一个 `TitleGradient.css` 文件（如果不存在该目录则需要先创建），代码如下：
```css
#subtitle {
    background: linear-gradient(-45deg, #0f76c1, #3a8dc0, #80d2ef, #ffffff);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
```

并在 `_config.fluid.yml` 文件的 `custom_css` 部分添加以下内容：
```yaml
custom_css:
  - /css/TitleGradient.css
```

# 修改滚动条样式

原本页面右侧的滚动条和默认代码块、行间公式的滚动条样式都比较朴素，因此我参考了EmoryHuang's Blog的代码并进行了一些修改，为滚动条添加了样式。

在 `source/css/` 目录下新建一个 `ScrollBar.css` 文件（如果不存在该目录则需要先创建），代码如下：
```css
::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

::-webkit-scrollbar-thumb {
    background-color: #679ed9;
    background-image: -webkit-linear-gradient( 45deg, rgba(255, 255, 255, 0.4) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0.4) 75%, transparent 75%, transparent);
    border-radius: 2em;
}

::-webkit-scrollbar-corner {
    background-color: transparent;
}

::-moz-selection {
    color: #fff;
    background-color: #7095da;
}
```

并在 `_config.fluid.yml` 文件的 `custom_css` 部分添加以下内容：
```yaml
custom_css:
  - /css/ScrollBar.css
```

# 使用 Mac 风格代码块样式

{% fold info @此方式已被弃用，博主采用另一种方式实现 %}
原本的代码块风格比较朴素，因此我参考KEVIN'S BLOG的代码块样式，修改为MAC风格。

<a href="https://blog.kevinchu.top/2023/07/17/hexo-theme-fluid-modify/" name="https://static.kevinchu.top/blog/assets/img/avatar_03.jpg" class="LinkCard">Hexo博客Fluid主题魔改记录</a>

在 `source/css/` 目录下新建一个 `MacPanel.styl` 文件，内容如下：
```stylus
.highlight
    background: #21252b
    border-radius: 5px
    box-shadow: 0 10px 30px 0 rgba(0, 0, 0, .4)
    padding-top: 30px

    &::before
      background: #fc625d
      border-radius: 50%
      box-shadow: 20px 0 #fdbc40, 40px 0 #35cd4b
      content: ' '
      height: 12px
      left: 12px
      margin-top: -20px
      position: absolute
      width: 12px
```

并在 `_config.fluid.yml` 文件的 `custom_css` 部分添加以下内容：
```yaml
custom_css:
  - /css/MacPanel
```
{% endfold %}

起初我使用的是上面被折叠的方式，但是在写这篇文章时发现存在一个问题：代码块不具备折叠功能！这导致了一旦插入长代码，就会占用大量页面空间，既不美观也不方便阅读。因此，我参考了4rozeN的实现方法，将渲染器更换为 Hexo Shiki Plugin。此处感谢4rozeN的答疑解惑。

<a href="https://4rozen.github.io/archives/Hexo/41513.html" name="https://4rozen.github.io/img/avatar/avatar.jpg" class="LinkCard">Hexo 博客 Fluid 主题实现代码折叠和文字遮盖效果</a>

Hexo Shiki Plugin是一个Hexo插件，仓库地址见下方。

<a href="https://github.com/nova1751/hexo-shiki-plugin/" name="https://avatars.githubusercontent.com/u/97817985?v=4" class="LinkCard">Hexo Shiki Plugin</a>

具体安装额和使用方法如下：

1. 在博客根目录下执行以下命令安装插件：
    ```bash
    npm install hexo-shiki-plugin --save
    ```
2. 修改博客根目录下的 `_config.yml` 文件：
    ```yaml
    syntax_highlighter: # 留空
    highlight:
      enable: false
    prismjs:
      enable: false
    shiki:
      theme: one-dark-pro # highlight-theme：one-dark-pro / github-light / github-dark / material-theme-palenight
      line_number: true # whether to show the line_number
      beautify: true # whether to add highlight tool true or false
      highlight_copy: true # copy button
      highlight_lang: true # show the code language
      highlight_height_limit: 360 # code-block max height,unit: px
      is_highlight_shrink: false # true: shrink the code blocks / false: expand the code blocks | none: expand code blocks and hide the button
      copy: # copy message
        success: 'Copy Success'
        error: 'Copy Error'
        no_support: 'Browser Not Support'
	```
3. 修改 `_config.fluid.yml` 文件，修改 `code` 中的 `highlight` 部分：
	```yaml
	code:
	  copy_btn: false
	  language:
		enable: false
	  highlight:
		enable: false
	```
4. 在 `_config.fluid.yml` 文件的 `custom_css` 部分添加以下内容以引入font-awesome图标库：
	```yaml
	custom_css:
	  - https://lib.baomitu.com/font-awesome/6.1.2/css/all.min.css
	```
5. 此时我发现折叠代码下方的折叠按钮很不明显，因此在 `source/css/` 目录下新建一个 `CodeBlock.css` 文件（如果不存在该目录则需要先创建），代码如下：
	```css
	.markdown-body code,
	.markdown-body pre {
	  font-family: "JetBrains Mono", "Fira Code", "Noto Sans SC", "Source Code Pro", monospace !important;
	  line-height: 1 !important;
	}

	/* 以下样式给 shiki 代码块使用 */
	.code-expand-btn i {
	  color: #ffffff !important; /* 展开或隐藏代码块的按钮颜色 */
	}
	:root {
	  --hlnumber-color: #a5a5a5 !important; /* 行号颜色 */
	  --hl-bg: #1f1f1f !important; /* 代码块背景颜色 */
	  --hlnumber-bg: #1f1f1f !important; /* 行号背景颜色 */
	  --hlexpand-bg: linear-gradient(
		180deg, 
		rgba(255, 255, 255, 0.1), 
		rgba(40, 44, 52, 0.9));
	}
	pre code {
	  color: #b9b9b9; /* 没有颜色方案的代码语言的表现色 */
	}
	```
	并在 `_config.fluid.yml` 文件的 `custom_css` 部分添加以下内容：
	```yaml
	custom_css:
	  - /css/CodeBlock.css
	```

# 修改行内代码样式

这个功能实现起来非常简单，只需要在 `source/css/` 目录下新建一个 `CodeInLine.css` 文件（如果不存在该目录则需要先创建），代码如下：
```css
.markdown-body code, .markdown-body pre {
  font-family: "JetBrains Mono", "Fira Code", "Noto Sans SC", "Source Code Pro", monospace !important;
  line-height: 1 !important;
  color: #E05B35;
}
```

并在 `_config.fluid.yml` 文件的 `custom_css` 部分添加以下内容：
```yaml
custom_css:
  - /css/CodeInLine.css
```

# 文章界面背景毛玻璃样式

谁知道我到底有多喜欢毛玻璃！因此我又为文章界面添加了毛玻璃样式，这部分参考的是4rozeN的博客，并进行了部分修改。

<a href="https://4rozen.github.io/archives/Hexo/60191.html" name="https://4rozen.github.io/img/avatar/avatar.jpg" class="LinkCard">Hexo fluid 全屏背景图随日夜模式切换以及正文底页毛玻璃效果</a>

首先在 `source/css/` 目录下新建一个 `FrostedGlassBg.css` 文件（如果不存在该目录则需要先创建），代码如下：
```css
#board {
  -webkit-backdrop-filter: blur(15px);
  backdrop-filter: blur(15px);
}
```

然后修改 `_config.fluid.yml` 文件的中的主面板背景色
```diff
-board_color: "#ffffff"
-board_color_dark: "#151722"
+board_color:  "#ffffff80"
+board_color_dark: "#15172280"
```

当然，也需要在 `_config.fluid.yml` 文件的 `custom_css` 部分添加以下内容：
```yaml
custom_css:
  - /css/FrostedGlassBg.css
```

这样我们就实现了文章界面的毛玻璃样式。4rozeN在博客中还实现了背景图全屏显示以及随日夜模式切换的效果，但由于我个人认为这样或许会使得显示比较杂乱，因此暂时未加入此功能。

# 链接卡片样式

在Fluid主题中，没有内置的链接卡片样式，因此参照丁丁の店的处理方式，并进行了一些修改和优化，为链接添加了卡片样式，使其背景颜色能跟随主题的日夜模式切换，且鼠标悬停时有放大效果。

<a href="https://blog.butanediol.me/2020/06/03/Hexo%20改良版知乎外链卡片/" name="https://blog.butanediol.me/media/avatar.png" class="LinkCard">Hexo 改良版知乎“外链卡片”</a>

{% fold info @此方式已被弃用，改用样式与功能分离的方法实现 %}
在 `source/js/` 目录下新建一个 `LinkCard.js` 文件（如果不存在该目录则需要先创建），代码如下：
```javascript
window.onload = function () {
    function isDarkMode() {
        const htmlElement = document.documentElement;
        const userScheme = htmlElement.getAttribute('data-user-color-scheme');
        const defaultScheme = htmlElement.getAttribute('data-default-color-scheme');
        
        // 如果用户手动设置了主题，优先使用用户设置
        if (userScheme) {
            return userScheme === 'dark';
        }
        
        // 否则使用默认主题设置
        if (defaultScheme) {
            return defaultScheme === 'dark';
        }
        
        // 如果都没有设置，检查系统偏好
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    
    // 监听主题切换，动态更新卡片背景色
    function updateLinkCardStyle() {
        setTimeout(() => {
            const style = document.getElementById('LinkCardStyle');
            if (style) {
                const color = isDarkMode() ? '#242a38' : '#eeefef';
                style.innerHTML = style.innerHTML.replace(
                    /(\.LinkCard-content\s*\{[^}]*background-color:\s*)(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgba?\([^)]+\));/,
                    `$1${color};`
                );
            }
        }, 60);
    }

    // 监听自定义事件和系统主题变化
    const observer = new MutationObserver(updateLinkCardStyle);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-user-color-scheme', 'data-default-color-scheme'] });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateLinkCardStyle);
    var LinkCards = document.getElementsByClassName('LinkCard');
    for (var i = 0; i < LinkCards.length; i++) {
        if (!document.getElementById('LinkCardStyle')) {
            var style = document.createElement('style');
            style.id = 'LinkCardStyle';
            const color = isDarkMode() ? '#242a38' : '#eeefef';
            style.innerHTML = `
            .LinkCard, .LinkCard:hover {
                text-decoration: none;
                border: none !important;
                color: inherit !important;
            }
            .LinkCard {
                position: relative;
                display: block;
                margin: 1em auto;
                width: 60%;
                box-sizing: border-box;
                border-radius: 12px;
                max-width: 100%;
                overflow: hidden;
                color: inherit;
                text-decoration: none;
            }
            .ztext { word-break: break-word; line-height: 1.6; }
            .LinkCard-content {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px;
                border-radius: inherit;
                background-color: ${color};
            }
            .LinkCard-text { overflow: hidden; }
            .LinkCard-title {
                display: -webkit-box;
                -webkit-line-clamp: 2;
                overflow: hidden;
                text-overflow: ellipsis;
                max-height: calc(16px * 1.25 * 2);
                font-size: 16px;
                font-weight: 500;
                line-height: 1.25;
                color: inherit;
            }
            .LinkCard-meta {
                display: flex;
                margin-top: 4px;
                font-size: 14px;
                line-height: 20px;
                color: #999;
                white-space: nowrap;
            }
            .LinkCard-imageCell {
                margin-left: 8px;
                border-radius: 6px;
            }
            .LinkCard-image {
                display: block;
                width: 60px;
                height: auto;
                border-radius: inherit;
                margin-bottom: 0 !important;
            }
            `;
            document.head.appendChild(style);
        }

        // 截断链接
        var truncateLink = function(url, maxLength) {
            if (url.length <= maxLength) return url;
            return url.slice(0, maxLength) + '...';
        };

        var LinkCard = LinkCards[i];
        var link = LinkCard.href;
        var title = LinkCard.innerText;
        var logourl = LinkCard.name;
        var displayLink = truncateLink(link, 32);

        LinkCard.innerHTML =
            `<span class="LinkCard-content">
                <span class="LinkCard-text">
                    <span class="LinkCard-title">${title}</span>
                    <span class="LinkCard-meta">
                        <span style="display:inline-flex;align-items:center">
                            <svg class="Zi Zi--InsertLink" fill="currentColor" viewBox="0 0 24 24" width="17" height="17">
                                <path d="M6.77 17.23c-.905-.904-.94-2.333-.08-3.193l3.059-3.06-1.192-1.19-3.059 3.058c-1.489 1.489-1.427 3.954.138 5.519s4.03 1.627 5.519.138l3.059-3.059-1.192-1.192-3.059 3.06c-.86.86-2.289.824-3.193-.08zm3.016-8.673l1.192 1.192 3.059-3.06c.86-.86 2.289-.824 3.193.08.905.905.94 2.334.08 3.194l-3.059 3.06 1.192 1.19 3.059-3.058c1.489-1.489 1.427-3.954-.138-5.519s-4.03-1.627-5.519-.138L9.786 8.557zm-1.023 6.68c.33.33.863.343 1.177.029l5.34-5.34c.314-.314.3-.846-.03-1.176-.33-.33-.862-.344-1.176-.03l-5.34 5.34c-.314.314-.3.846.03 1.177z" fill-rule="evenodd"></path>
                            </svg>
                        </span>
                        <a href="${link}" title="${link}" style="color:inherit;text-decoration:none;">${displayLink}</a>
                    </span>
                </span>
                <span class="LinkCard-imageCell">
                    <img class="LinkCard-image" alt="logo" src="${logourl}">
                </span>
            </span>`;
    }
}
```

然后在 `_config.fluid.yml` 文件的 `custom_js` 部分添加以下内容：
```yaml
custom_js:
  - /js/LinkCard.js
```
{% endfold %}

为了实现样式与功能分离，并为链接卡片添加鼠标悬浮时的效果，我将该博主的代码进行了修改：

在 `source/css/` 目录下新建一个 `LinkCard.css` 文件（如果不存在该目录则需要先创建），代码如下：
```css
:root {
  --linkcard-bg-color: #eeefef;
}
[data-user-color-scheme="dark"] {
  --linkcard-bg-color: #242a38;
}

.LinkCard, .LinkCard:hover {
    text-decoration: none;
    border: none !important;
    color: inherit !important;
}
.LinkCard {
    position: relative;
    display: block;
    margin: 1em auto;
    width: 60%;
    box-sizing: border-box;
    border-radius: 12px;
    max-width: 100%;
    overflow: hidden;
    color: inherit;
    text-decoration: none;
    background: var(--linkcard-bg-color);
    transition: transform 0.4s ease-in;
}
.ztext { word-break: break-word; line-height: 1.6; }
.LinkCard-content {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    border-radius: inherit;
    background-color: var(--linkcard-bg-color);
}
.LinkCard-text { overflow: hidden; }
.LinkCard-title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    max-height: calc(16px * 1.25 * 2);
    font-size: 16px;
    font-weight: 500;
    line-height: 1.25;
    color: inherit;
}
.LinkCard-meta {
    display: flex;
    margin-top: 4px;
    font-size: 14px;
    line-height: 20px;
    color: #999;
    white-space: nowrap;
}
.LinkCard-imageCell {
    margin-left: 8px;
    border-radius: 6px;
}
.LinkCard-image {
    display: block;
    width: 60px !important;
    height: auto !important;
    border-radius: inherit;
    margin-bottom: 0 !important;
}
.LinkCard:hover {
    transform: translate3d(0, -2px, 0);
    box-shadow: 0 0 16px 0 rgba(34, 135, 250, 0.8);
}
```

然后还需要在 `source/js/` 目录下新建一个 `LinkCard.js` 文件（如果不存在该目录则需要先创建），代码如下：
```javascript
window.onload = function () {
    var LinkCards = document.getElementsByClassName('LinkCard');
    for (var i = 0; i < LinkCards.length; i++) {
        // 截断链接
        var truncateLink = function(url, maxLength) {
            if (url.length <= maxLength) return url;
            return url.slice(0, maxLength) + '...';
        };

        var LinkCard = LinkCards[i];
        var link = LinkCard.href;
        var title = LinkCard.innerText;
        // 如果没有指定logo地址，则使用默认的loading图片
        var logourl = LinkCard.name ? LinkCard.name : '/img/loading/loading1.gif';
        var displayLink = truncateLink(link, 32);

        LinkCard.innerHTML =
            `<span class="LinkCard-content">
                <span class="LinkCard-text">
                    <span class="LinkCard-title">${title}</span>
                    <span class="LinkCard-meta">
                        <span style="display:inline-flex;align-items:center">
                            <svg class="Zi Zi--InsertLink" fill="currentColor" viewBox="0 0 24 24" width="17" height="17">
                                <path d="M6.77 17.23c-.905-.904-.94-2.333-.08-3.193l3.059-3.06-1.192-1.19-3.059 3.058c-1.489 1.489-1.427 3.954.138 5.519s4.03 1.627 5.519.138l3.059-3.059-1.192-1.192-3.059 3.06c-.86.86-2.289.824-3.193-.08zm3.016-8.673l1.192 1.192 3.059-3.06c.86-.86 2.289-.824 3.193.08.905.905.94 2.334.08 3.194l-3.059 3.06 1.192 1.19 3.059-3.058c1.489-1.489 1.427-3.954-.138-5.519s-4.03-1.627-5.519-.138L9.786 8.557zm-1.023 6.68c.33.33.863.343 1.177.029l5.34-5.34c.314-.314.3-.846-.03-1.176-.33-.33-.862-.344-1.176-.03l-5.34 5.34c-.314.314-.3.846.03 1.177z" fill-rule="evenodd"></path>
                            </svg>
                        </span>
                        <a href="${link}" title="${link}" style="color:inherit;text-decoration:none;">${displayLink}</a>
                    </span>
                </span>
                <span class="LinkCard-imageCell">
                    <img class="LinkCard-image" alt="logo" src="${logourl}" onerror="this.src='/img/loading/loading1.gif'">
                </span>
            </span>`; // 如果获取指定logo地址失败，则使用默认的loading图片
    }
}
```

并在 `_config.fluid.yml` 文件的 `custom_css` 和 `custom_js` 部分添加以下内容：
```yaml
custom_css:
  - /css/LinkCard.css
custom_js:
  - /js/LinkCard.js
```

使用时只需在文章中添加以下内容即可：
```markdown
<a href="" name="" class="LinkCard">标题</a>
```

其中:

- `href` 是链接地址，不填就只会收获一张空卡片哦
- `name` 是链接的logo地址，若不指定或留空，则使用脚本中指定的默认logo地址（记得手动调整哦）
- `class` 处为链接卡片的样式类名，必须为 `LinkCard`，否则无法应用样式。
- `标题` 处为连接卡片显示的标题。

同时在使用中我还发现了一个“特性”：对于外部链接，点击链接卡片中的标题时，浏览器会在新的标签页中打开链接，而点击连接卡片中的链接地址时，则会在当前标签页中打开链接；而对于内部链接，则始终在当前标签页中打开链接。（奇怪的知识增加了.jpg）

# 统一文章图片宽度

在发了若干篇文章后，我发现由于我笔记中插入的图片分辨率不一致，导致在文章列表中呈现出来的图片宽度不统一，观感较差。为了解决这个问题，我在 `source/css/` 目录下新建一个 `UnifyImgWidth.css` 文件（如果不存在该目录则需要先创建），强制统一文章图片的宽度。

```css
.markdown-body p > img,
.markdown-body p > a > img,
.markdown-body figure > img,
.markdown-body figure > a > img {
  width: 70%; /* 强制宽度为页面的70% */
  height: auto; /* 保持图片比例 */
  display: block; 
  margin-left: auto; 
  margin-right: auto; /* 图片居中 */
}
.page-content img, .post-content img {
  width: 70%; /* 强制宽度为页面的70% */
  height: auto; /* 保持图片比例 */
  display: block; 
  margin-left: auto; 
  margin-right: auto; /* 图片居中 */
}
```

并在 `_config.fluid.yml` 文件的 `custom_css` 部分添加以下内容：
```yaml
custom_css:
  - /css/UnifyImgWidth.css
```

# 首页文章滑入动效

在Fluid主题中，首页文章列表的文章卡片是静态显示的，没有任何动效。为了让首页看起来更有活力，我参考QingShang的博客为文章卡片添加了滑入动效。

<a href="https://qingshaner.com/Hexo%20fluid主题首页添加文章滑入动画/" name="https://qingshaner.oss-cn-hangzhou.aliyuncs.com/images/202205021359396.jpg" class="LinkCard">Hexo fluid主题首页添加文章滑入动画</a>

在 `source/js/` 目录下新建一个 `ScrollAnimation.js` 文件（如果不存在该目录则需要先创建），代码如下：
```javascript
const cards = document.querySelectorAll('.index-card')
if (cards.length) {
    document.querySelector('.row').setAttribute('style', 'overflow: hidden;')
    const coefficient = document.documentElement.clientWidth > 768 ? .5 : .3
    const origin = document.documentElement.clientHeight - cards[0].getBoundingClientRect().height * coefficient

    function throttle(fn, wait) {
        let timer = null;
        return function () {
            const context = this;
            const args = arguments;
            if (!timer) {
                timer = setTimeout(function () {
                    fn.apply(context, args);
                    timer = null;
                }, wait)
            }
        }
    }

    function handle() {
        cards.forEach(card => {
            card.setAttribute('style', `--state: ${(card.getBoundingClientRect().top - origin) < 0 ? 1 : 0};`)
        })
    }

    document.addEventListener("scroll", throttle(handle, 100));
}
```

接着在 `source/css/`目录下新建一个 `ScrollAnimation.css` 文件（如果不存在该目录则需要先创建），代码如下：
```css
.index-card {
  transition: all 0.5s;
  transform: scale(calc(1.5 - 0.5 * var(--state)));
  opacity: var(--state);
  margin-bottom: 2rem;
}

.index-img img {
  margin: 20px 0;
}
```

并在 `_config.fluid.yml` 中载入，在 `custom_js` 和 `custom_css` 部分添加以下内容：
```yaml
custom_js:
  - /js/ScrollAnimation.js
custom_css:
  - /css/ScrollAnimation.css
```

# 首页文章图片悬浮鼠标悬停动效

在实现首页文章滑入动效后，我又参照Hugo@kkl's的博客为首页文章图片添加了鼠标悬停动效

<a href="https://zhangkeliang0627.github.io/2024/07/31/关于Fluid主题拓展的N种配置/README/" name="https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/sys/avatar.png" class="LinkCard">关于Fluid主题拓展的N种配置</a>

在 `source/css/` 目录下新建一个 `IndexImgHover.css` 文件（如果不存在该目录则需要先创建），代码如下：
```css
.index-img {
  /* 动画时间 */
  transition: .4s;
}
.index-card:hover .index-img {
  /* 放大倍数 */
  transform: scale(1.05);
}
```

并在 `_config.fluid.yml` 中载入，在 `custom_css` 部分添加以下内容：
```yaml
custom_css:
  - /css/IndexImgHover.css
```

至此，首页文章图片的动效就完成了。

当然，你也可以借助浏览器开发者工具选取其他样式，并仿照这个方法进行修改。如修改“关于”页的头像与“标签页”的标签：
```css
.about-avatar img {
  transition: .4s;
}
.about-avatar:hover img {
  transform: scale(1.05);
}

.tagcloud a {
  transition: .6s;
}
.tagcloud a:hover {
  transform: scale(1.05);
}
```

# 彩虹加载动效

由于我的博客使用Github Pages托管，因此在加载时偶尔会花费较长时间，这时页面各种效果加载的速度往往并不一致，大大影响了观感。因此，我参考Emberffの小破站，为博客添加了彩虹加载动效。

<a href="https://blog.emb42.com/2024/10/04/Hexo-Fluid%E8%83%8C%E6%99%AF%E5%9B%BA%E5%AE%9A%E4%BB%A5%E5%8F%8A%E6%B7%BB%E5%8A%A0%E5%8A%A0%E8%BD%BD%E5%8A%A8%E7%94%BB/" name="https://blog.emb42.com/img/avatar.png" class="LinkCard">Hexo Fluid背景固定以及添加加载动画</a>

在 `source/js/` 目录下新建一个 `RainbowLoading.js` 文件（如果不存在该目录则需要先创建），代码如下：
```javascript
function loadScript(url, callback) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    script.onload = function() {
        callback();
    };

    document.head.appendChild(script);
}

// 加载 jQuery
loadScript('https://code.jquery.com/jquery-3.6.0.min.js', function() {
    $(function(){
        $("#loader-container").fadeOut(560);
    });
});
```

然后在 `source/css/` 目录下新建一个 `RainbowLoading.css` 文件（如果不存在该目录则需要先创建），代码如下：
```css
#loader-container {
   position: fixed; /* 或 absolute，根据需求 */
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   z-index: 99999; /* 确保在最上层 */
   display: flex;
   justify-content: center;
   align-items: center;
   background: rgba(0, 0, 0, 0.7); /* 可选：添加背景以增加可见性 */
}

.loader,
.loader-inner,
.loader-line-wrap,
.loader-line {
    position: absolute; /* 或 fixed，根据需要选择 */
    z-index: 99999; /* 确保在最上层 */
}

.loader {
   background: #000;
   background: radial-gradient(#222, #000);
   bottom: 0;
   left: 0;
   overflow: hidden;
   position: fixed;
   right: 0;
   top: 0;
   z-index: 99999;
}

.loader-inner {
   bottom: 0;
   height: 60px;
   left: 0;
   margin: auto;
   position: absolute;
   right: 0;
   top: 0;
   width: 100px;
}

.loader-line-wrap {
   animation: 
     spin 2000ms cubic-bezier(.175, .885, .32, 1.275) infinite
  ;
   box-sizing: border-box;
   height: 50px;
   left: 0;
   overflow: hidden;
   position: absolute;
   top: 0;
   transform-origin: 50% 100%;
   width: 100px;
}
.loader-line {
   border: 4px solid transparent;
   border-radius: 100%;
   box-sizing: border-box;
   height: 100px;
   left: 0;
   margin: 0 auto;
   position: absolute;
   right: 0;
   top: 0;
   width: 100px;
}
.loader-line-wrap:nth-child(1) { animation-delay: -50ms; }
.loader-line-wrap:nth-child(2) { animation-delay: -100ms; }
.loader-line-wrap:nth-child(3) { animation-delay: -150ms; }
.loader-line-wrap:nth-child(4) { animation-delay: -200ms; }
.loader-line-wrap:nth-child(5) { animation-delay: -250ms; }

.loader-line-wrap:nth-child(1) .loader-line {
   border-color: hsl(0, 80%, 60%);
   height: 90px;
   width: 90px;
   top: 7px;
}
.loader-line-wrap:nth-child(2) .loader-line {
   border-color: hsl(60, 80%, 60%);
   height: 76px;
   width: 76px;
   top: 14px;
}
.loader-line-wrap:nth-child(3) .loader-line {
   border-color: hsl(120, 80%, 60%);
   height: 62px;
   width: 62px;
   top: 21px;
}
.loader-line-wrap:nth-child(4) .loader-line {
   border-color: hsl(180, 80%, 60%);
   height: 48px;
   width: 48px;
   top: 28px;
}
.loader-line-wrap:nth-child(5) .loader-line {
   border-color: hsl(240, 80%, 60%);
   height: 34px;
   width: 34px;
   top: 35px;
}

@keyframes spin {
   0%, 15% {
     transform: rotate(0);
  }
  100% {
     transform: rotate(360deg);
  }
}
```

然后还需要在 `source/html/` 目录下新建一个 `RainbowLoading.html` 文件（如果不存在该目录则需要先创建），代码如下：
```html
<div id="loader-container"> 
    <div id="loader" class="loader"></div>
    <div class="loader-inner">
        <div class="loader-line-wrap">
            <div class="loader-line"></div>
        </div>
        <div class="loader-line-wrap">
            <div class="loader-line"></div>
        </div>
        <div class="loader-line-wrap">
            <div class="loader-line"></div>
        </div>
        <div class="loader-line-wrap">
            <div class="loader-line"></div>
        </div>
        <div class="loader-line-wrap">
            <div class="loader-line"></div>
        </div>
    </div>
</div>

<script src="/js/RainbowLoading.js" type="text/javascript"></script>
<link href="/css/RainbowLoading.css" type="text/css" rel="stylesheet"/>
```

{% fold info @注：由于在html中已经引入了相关的js和css文件，因此这一步可省略 %}
然后在 `_config.fluid.yml` 文件的 `custom_js` 和 `custom_css` 部分添加以下内容：
```yaml
custom_js:
  - /js/RainbowLoading.js
custom_css:
  - /css/RainbowLoading.css
```
{% endfold %}

在这之后，还需要使用Hexo的注入功能来将加载动画的HTML代码注入到页面中。我们需要在博客根目录下新建 `scripts/` 目录，然后在该目录下新建一个 `injector.js` 文件，代码如下：
```javascript
// 注入彩虹加载动画
hexo.extend.filter.register('theme_inject', function(injects) {
  injects.bodyBegin.file('loader', 'source/html/RainbowLoading.html');
});
```

Hexo注入器的使用可以参考Fluid主题的用户手册。

<a href="https://hexo.fluid-dev.com/docs/advance/#hexo-%E6%B3%A8%E5%85%A5%E4%BB%A3%E7%A0%81" name="https://hexo.fluid-dev.com/docs/fluid_hexo.png" class="LinkCard">Hexo 注入代码</a>

# 背景动态线条动效

但是，现在我又觉得纯色的界面有些单调了，于是我为背景加上了动态线条的效果。参考EmoryHuang's Blog的代码并进行一定修改。

在 `source/js/` 目录下新建一个 `DynamicLine.js` 文件（如果不存在该目录则需要先创建），代码如下：
```javascript
(function() {
    // 检测深色模式的辅助函数 - 直接检查data-user-color-scheme属性
    function isDarkMode() {
        const htmlElement = document.documentElement;
        const userScheme = htmlElement.getAttribute('data-user-color-scheme');
        const defaultScheme = htmlElement.getAttribute('data-default-color-scheme');
        // 如果用户手动设置了主题，优先使用用户设置
        if (userScheme) {
            return userScheme === 'dark';
        }
        // 否则使用默认主题设置
        if (defaultScheme) {
            return defaultScheme === 'dark';
        }
        // 如果都没有设置，检查系统偏好
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // 获取元素属性的辅助函数
    function getAttr(el, attr, defaultValue) {
        return el.getAttribute(attr) || defaultValue;
    }

    // 获取标签元素的辅助函数
    function getTags(tag) {
        return document.getElementsByTagName(tag);
    }

    // 获取配置信息，根据深色模式设置不同的线条颜色
    function getConfig() {
        var scripts = getTags("script");
        var lastScript = scripts[scripts.length - 1];

        // 根据深色模式状态设置线条颜色
        const lineColor = isDarkMode() ? "255,255,255" : "0,0,0";

        return {
            l: scripts.length,
            z: getAttr(lastScript, "zIndex", -1),
            o: getAttr(lastScript, "opacity", 0.5),
            c: getAttr(lastScript, "color", lineColor),
            n: getAttr(lastScript, "count", 99)
        };
    }

    // 设置Canvas尺寸
    function setCanvasSize() {
        width = canvas.width = window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth;
        height = canvas.height = window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight;
    }

    // 绘制函数
    function draw() {
        ctx.clearRect(0, 0, width, height);
        var allPoints = [mouse].concat(points);

        points.forEach(function(p) {
            p.x += p.xa;
            p.y += p.ya;
            p.xa *= (p.x > width || p.x < 0) ? -1 : 1;
            p.ya *= (p.y > height || p.y < 0) ? -1 : 1;
            ctx.fillRect(p.x - 0.5, p.y - 0.5, 1, 1);

            for (var v = 0; v < allPoints.length; v++) {
                var q = allPoints[v];
                if (p !== q && q.x !== null && q.y !== null) {
                    var dx = p.x - q.x;
                    var dy = p.y - q.y;
                    var dist = dx * dx + dy * dy;
                    if (dist < q.max) {
                        if (q === mouse && dist >= q.max / 2) {
                            p.x -= 0.03 * dx;
                            p.y -= 0.03 * dy;
                        }
                        var ratio = (q.max - dist) / q.max;
                        ctx.beginPath();
                        ctx.lineWidth = ratio / 2;
                        ctx.strokeStyle = "rgba(" + config.c + "," + (ratio + 0.2) + ")";
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.stroke();
                    }
                }
            }
            allPoints.splice(allPoints.indexOf(p), 1);
        });

        animation(draw);
    }

    // 主题变化时更新Canvas配置
    function updateCanvasTheme() {
        const newColor = isDarkMode() ? "255,255,255" : "0,0,0";
        if (config.c !== newColor) {
            config.c = newColor;
            console.log("主题已切换，线条颜色更新为:", newColor === "255,255,255" ? "白色" : "黑色");
        }
    }

    var canvas = document.createElement("canvas"),
        config = getConfig(),
        canvasId = "c_n" + config.l,
        ctx = canvas.getContext("2d"),
        width, height,
        animation = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(fn) { window.setTimeout(fn, 1000 / 45); },
        random = Math.random,
        mouse = { x: null, y: null, max: 20000 };

    canvas.id = canvasId;
    canvas.style.cssText =
        "position:fixed;top:0;left:0;z-index:" + config.z + ";opacity:" + config.o;
    getTags("body")[0].appendChild(canvas);

    setCanvasSize();
    window.onresize = setCanvasSize;

    window.onmousemove = function(e) {
        e = e || window.event;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    };
    window.onmouseout = function() {
        mouse.x = null;
        mouse.y = null;
    };

    var points = [];
    for (var i = 0; i < config.n; i++) {
        var x = random() * width,
            y = random() * height,
            xa = 2 * random() - 1,
            ya = 2 * random() - 1;
        points.push({ x: x, y: y, xa: xa, ya: ya, max: 6000 });
    }

    // 初始设置线条颜色
    updateCanvasTheme();

    // 监听data-user-color-scheme和data-default-color-scheme属性变化
    if (window.MutationObserver) {
        new MutationObserver(updateCanvasTheme).observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-user-color-scheme', 'data-default-color-scheme']
        });
    }

    // 监听系统主题变化
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateCanvasTheme);
    }

    setTimeout(function() {
        draw();
    }, 100);
})();
```

并在 `_config.fluid.yml` 文件的 `custom_js` 部分添加以下内容：
```yaml
custom_js:
  - /js/DynamicLine.js
```

这样，在博客加载时就会自动添加动态线条效果。

# 标签页根据焦点切换显示

在浏览其他人的博客时，我发现有些博客在我切换出标签页时，顶栏会呈现出挽留的效果，然而我实在不知道应该用什么关键词检索相关代码，因此只能自行查阅资料来实现。最终我了解到这样的效果是通过页面可见性事件 `visibilitychange` 监听来实现的。

在 `source/js/` 目录下新建一个 `TabDisplay.js` 文件（如果不存在该目录则需要先创建），代码如下：
```javascript
jQuery(document).ready(function() {
    var b, c, a = document.title;
    var welcomeTimer = null;
    function d() {
        if (document[b]) {
            document.title = " 你去哪啦(๑•́ ₃ •̀๑) ";
            if (welcomeTimer) {
                clearTimeout(welcomeTimer);
                welcomeTimer = null;
            }
        } else {
            document.title = " 你回来啦(*^▽^*) ";
            welcomeTimer = setTimeout(function() {
                document.title = a;
            }, 2000);
        }
    }

    if (typeof document.hidden !== "undefined") {
        b = "hidden";
        c = "visibilitychange";
    } else if (typeof document.mozHidden !== "undefined") {
        b = "mozHidden";
        c = "mozvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
        b = "webkitHidden";
        c = "webkitvisibilitychange";
    }

    if ((typeof document.addEventListener !== "undefined" || typeof document[b] !== "undefined") && c) {
        document.addEventListener(c, d, false);
    }
});
```

并在 `_config.fluid.yml` 文件的 `custom_js` 部分添加以下内容：
```yaml
custom_js:
  - /js/TabDisplay.js
```

# 总结

至此，我的博客就完成了当前所有的美化效果！最终，`_config.fluid.yml` 文件的 `custom_js` 和 `custom_css` 部分如下所示：
```yaml
# 指定自定义 .js 文件路径，支持列表；路径是相对 source 目录，如 /js/custom.js 对应存放目录 source/js/custom.js
# Specify the path of your custom js file, support list. The path is relative to the source directory, such as `/js/custom.js` corresponding to the directory `source/js/custom.js`
custom_js:
  - /js/DynamicLine.js # 动态线条
  - /js/LinkCard.js # 链接卡片效果
  - /js/ScrollAnimation.js # 首页文章滑入动画
  - /js/TabDisplay.js # 标签页根据焦点切换显示

# 指定自定义 .css 文件路径，用法和 custom_js 相同
# The usage is the same as custom_js
custom_css:
  - /css/CodeBlock.css # 代码折叠
  - /css/CodeInLine.css # 行内代码样式
  - /css/FrostedGlassBg.css # 文章界面毛玻璃
  - /css/IndexImgHover.css # 首页文章封面图片悬浮效果
  - /css/LinkCard.css # 链接卡片效果
  - /css/ScrollAnimation.css # 首页文章滑入动画
  - /css/ScrollBar.css # 滚动条颜色
  - /css/StrongInDark.css # 强化暗色模式加粗字体
  - /css/TitleGradient.css # 文章标题颜色渐变效果
  - /css/TitleNeon.css # 博客标题霓虹灯效
  - /css/UnifyImgWidth.css # 统一文章图片宽度
  - https://lib.baomitu.com/font-awesome/6.1.2/css/all.min.css # Font Awesome 图标库
```

具体的代码可以参考我的博客仓库中的 `js` 和 `css` 目录。

<a href="https://github.com/youyeyejie/youyeyejie.github.io" name="/img/avatar/avatar.webp" class="LinkCard">GitHub 仓库</a>