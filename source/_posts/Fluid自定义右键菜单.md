---
title: Fluid自定义右键菜单
category_bar: true
date: 2025-07-14 13:20:46
tags:
  - Hexo
  - Fluid
categories:
  - Hexo Blog Building
excerpt: Fluid 主题美化记录3.0——无侵入式自定义右键菜单
index_img: /posts/Fluid自定义右键菜单/image.png
---

# 前言

本期美化同样贯彻了前两美化的原则：**无侵入式美化**，即不修改主题的源代码，只通过修改配置文件、自定义样式以及Hexo注入器来实现美化。前两期的美化可以点击下方的链接卡片查看。

<a href="/posts/Fluid主题美化/" name="/img/avatar/avatar.jpg" class="LinkCard">Fluid主题美化</a>
<a href="/posts/Fluid页脚美化/" name="/img/avatar/avatar.jpg" class="LinkCard">Fluid页脚美化</a>

在本期中，我们将实现一个自定义的右键菜单，我参考了苍岚和loyeh两位博主的实现方式，在他们的基础上进行了改进和扩展，最终实现了一个更加美观和实用的右键菜单。如果不关心实现，可以直接跳转至 [总结](#总结) 获取完整代码和使用方法。

<a href="https://www.zywvvd.com/notes/hexo/theme/fluid/fluid-custom-rightmenu/fluid-custom-rightmenu/" name="https://www.zywvvd.com/image/avatar.png" class="LinkCard">Fluid-39-自定义右键菜单</a>
<a href="https://lo-y-eh.github.io/posts/92dc.html" name="https://lo-y-eh.github.io/medias/avatar.jpg" class="LinkCard">右键菜单</a>

# 功能设计

在设计这个右键菜单时，我主要考虑了我个人的使用习惯，兼顾访客可能存在的需求。最终，我设计了以下功能：

1. 在覆盖浏览器原本的右键菜单时，必须留有使用浏览器原生右键菜单的入口。
2. 提供常用的功能，如前进、后退、刷新等
3. 提供快速返回顶部和快速跳转到页脚的功能
4. 应对各种情况做出不同的响应，如：
    - 选中文本时，提供复制文本、必应搜索等功能
    - 在图片上，提供复制图片链接、下载图片等功能
    - 在链接上，提供打开链接等功能
5. 常驻功能中，提供复制当前页面链接的功能和切换主题昼夜模式的功能
6. 提供站内搜索、快速访问博客分类和文章标签的入口
7. 为访客提供随机访问文章的功能

综上，我们只需要依次设计实现这些功能即可。

# 实现步骤

1. 创建右键菜单的 HTML 结构
2. 使用 Hexo 注入器将 HTML 结构注入到页面中
3. 使用 CSS 美化右键菜单
4. 使用 JavaScript 实现右键菜单的显示与隐藏
5. 使用 JavaScript 实现右键菜单的各项功能

## 创建右键菜单的 HTML 结构

在 Hexo 的 `source/html` 目录下创建一个 `RightMenu.html` 文件，内容如下：

```html
<div id="tooltip-rightmenu" class="tooltip-rightmenu">如需原始右键菜单请按下 <strong>Ctrl+右键</strong></div>
<div id="tooltip-rightmenu-return" class="tooltip-rightmenu">图片已下载</div>

<div id="rightmenu-wrapper">
  <ul class="list-v rightmenu" id="rightmenu-content">
	    <li class="navigation menuNavigation-Content">
            <a class="nav icon-only fix-cursor-default" onclick="history.back()"><i class="fa-solid fa-chevron-left"></i></a>
            <a class="nav icon-only fix-cursor-default" onclick="history.forward()"><i class="fa-solid fa-chevron-right"></i></a>
            <a class="nav icon-only fix-cursor-default" onclick="window.location.reload()"><i class="fa-solid fa-rotate-right"></i></a>
            <a class="nav icon-only fix-cursor-default" aria-label="TOP" href="#" role="button"><i class="fa-solid fa-chevron-up"></i></a>
            <a class="nav icon-only fix-cursor-default" aria-label="bottom" href="javascript:void(0);" role="button" onclick="window.scrollTo(0, document.body.scrollHeight);"><i class="fa-solid fa-chevron-down"></i></a>
	    </li>

        <hr class="menuLoad-Content" style="display: block;" id="top-line" hidden>

        <li class="menuLoad-Content" style="display: block;" id="copy-selected-text" hidden>
            <a class="vlts-menu fix-cursor-default" target="_self" onclick="copySelectedText();">
                <span>
                    <i class="fa-solid fa-copy"></i>
                    &nbsp;复制选中
                </span>
            </a>
        </li>

        <li class="menuLoad-Content" style="display: block;" id="search-selected-text-BING" hidden>
            <a class="vlts-menu fix-cursor-default" target="_blank" onclick="searchSelectedTextBing();">
                <span>
                    <i class="fa-solid fa-magnifying-glass-arrow-right"></i>
                    &nbsp;必应搜索
                </span>
            </a>
        </li>

        <li class="menuLoad-Content" style="display: block;" id="go-to-link" hidden>
            <a class="vlts-menu fix-cursor-default" target="_blank" onclick="goToLink();">
                <span>
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    &nbsp;转到链接
                </span>
            </a>
        </li>

        <li class="menuLoad-Content" style="display: block;" id="download-image" hidden>
            <a class="vlts-menu fix-cursor-default" target="_self" onclick="downloadImage();">
                <span>
                    <i class="fa-solid fa-image"></i>
                    &nbsp;下载图片
                </span>
            </a>
        </li>

        <li class="menuLoad-Content" style="display: block;" id="copy-image-link" hidden>
            <a class="vlts-menu fix-cursor-default" target="_self" onclick="copyImageLink();">
                <span>
                    <i class="fa-solid fa-link"></i>
                    复制图片链接
                </span>
            </a>
        </li>

		<hr class="menuLoad-Content" style="display: block;">

        <li class="menuLoad-Content" style="display: block;">
		    <a class="vlts-menu fix-cursor-default" target="_self" onclick="RandomGo()">
		        <span>
			        <i class="fa-solid fa-paper-plane"></i>
                    &nbsp;随便看看
		        </span>
		    </a>
	    </li>
	    <li class="menuLoad-Content" style="display: block;">
		    <a class="vlts-menu fix-cursor-default" target="_self" href="javascript:;" data-toggle="modal" data-target="#modalSearch" aria-label="Search">
		        <span>
			        <i class="fa-solid fa-magnifying-glass"></i>
                    &nbsp;站内搜索
		        </span>
		    </a>
	    </li>
        <li class="menuLoad-Content" style="display: block;">
		    <a class="vlts-menu fix-cursor-default" target="_self" href="/categories/">
		        <span>
			        <i class="iconfont icon-category-fill"></i>
                    &nbsp;博客分类
		        </span>
		    </a>
	    </li>
        <li class="menuLoad-Content" style="display: block;">
		    <a class="vlts-menu fix-cursor-default" target="_self" href="/tags/">
		        <span>
			        <i class="fa-solid fa-tags"></i>
                    &nbsp;文章标签
		        </span>
		    </a>
	    </li>
        
	    <hr class="menuLoad-Content" style="display: block;">

        <li class="menuLoad-Content" style="display: block;">
            <a class="vlts-menu fix-cursor-default" target="_self" onclick="copyLink();">
                <span>
                    <i class="fa-solid fa-copy"></i>
                    &nbsp;复制链接
                </span>
            </a>
        </li>
        <li class="menuLoad-Content" style="display: block;">
            <a class="vlts-menu fix-cursor-default" target="_self" onclick="document.getElementById('color-toggle-btn').click();">
            <span>
                <i class="fa-solid fa-circle-half-stroke"></i>
                &nbsp;切换昼夜
            </span>
            </a>
        </li>
    </ul>
</div>

<script src="/js/RightMenu.js" type="text/javascript"></script>
<link href="/css/RightMenu.css"type="text/css"rel="stylesheet"/>
```

其中 `tooltip-rightmenu` 和 `tooltip-rightmenu-return` 是用于提示用户如何使用右键菜单的元素，`rightmenu-wrapper` 是右键菜单的容器，`rightmenu-content` 是右键菜单的内容列表，也是我们需要实现的功能项。

在代码的最后，我们引入了 `RightMenu.js` 和 `RightMenu.css` 文件，这两个文件将分别用于实现右键菜单的逻辑和样式，因此我们不必在 `_config.fluid.yml` 中再进行额外的配置。

## 使用 Hexo 注入器将 HTML 结构注入到页面中

在 Hexo 的 `scripts/injector.js` 文件中添加以下代码：

```javascript
hexo.extend.filter.register('theme_inject', function(injects) {
  // 右键菜单
  injects.bodyBegin.file('default', "source/html/RightMenu.html");
});
```

这段代码将 `RightMenu.html` 文件注入到页面的 `<body>` 标签开始的位置。这样，当页面加载时，右键菜单的 HTML 结构就会被插入到页面中。

## 使用 CSS 美化右键菜单

接下来我们将实现右键菜单的样式。在 `source/css` 目录下创建一个 `RightMenu.css` 文件，内容如下：

```css
div#rightmenu-wrapper {
    display: -webkit-box /* OLD - iOS 6-, Safari 3.1-6 */;
    display: -moz-box /* OLD - Firefox 19- (buggy but mostly works) */;
    display: none;
    position: fixed;
    z-index: 2147483648;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}
ul.list-v.rightmenu {
    display: -webkit-box /* OLD - iOS 6-, Safari 3.1-6 */;
    display: -moz-box /* OLD - Firefox 19- (buggy but mostly works) */;
    display: block;
    background-color: var(--body-bg-color);
    opacity: 0.9;
    max-width: 240px;
    overflow: hidden;
}
ul.list-v {
    z-index: 1;
    display: -webkit-box /* OLD - iOS 6-, Safari 3.1-6 */;
    display: -moz-box /* OLD - Firefox 19- (buggy but mostly works) */;
    display: none;
    position: absolute;
    box-shadow: 0 12px 4px 0px rgba(0,0,0,0.8), 0 4px 8px 0px rgba(0,0,0,0.08), 0 8px 16px 0px rgba(0,0,0,0.08);
    -webkit-box-shadow: 0 2px 4px 0px rgba(0,0,0,0.08), 0 4px 8px 0px rgba(0,0,0,0.08), 0 8px 16px 0px rgba(0,0,0,0.08);
    margin-top: -6px;
    border-radius: 4px;
    -webkit-border-radius: 4px;
    padding: 8px 0;
}
ul.list-v.rightmenu li.navigation, ul.list-v.rightmenu li.music {
    display: -webkit-box /* OLD - iOS 6-, Safari 3.1-6 */;
    display: -moz-box /* OLD - Firefox 19- (buggy but mostly works) */;
    display: -ms-flexbox /* TWEENER - IE 10 */;
    display: -webkit-flex /* NEW - Chrome */;
    display: flex /* NEW, Spec - Opera 12.1, Firefox 20+ */;
    display: flex;
    margin: 0 12px 0 12px;
    justify-content: space-between;
    -webkit-justify-content: space-between;
    -khtml-justify-content: space-between;
    -moz-justify-content: space-between;
    -o-justify-content: space-between;
    -ms-justify-content: space-between;
}
ul.list-v >li {
    white-space: nowrap;
    word-break: keep-all;
}
ul.list-v hr {
    margin-top: 8px;
    margin-bottom: 8px;
}
ul.list-v.rightmenu li.navigation a.nav i, ul.list-v.rightmenu li.music a.nav i {
    margin: 0;
    width: 16px;
    line-height: 32px;
}
ul.list-v >li {
    white-space: nowrap;
    word-break: keep-all;
}
ul.list-v.rightmenu a.vlts-menu {
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: 36px;
    font-weight: normal;
    margin-left: 10px;
}
.rightmenu-icon{
	margin: 0 110px 0 8px;
}

ul.list-v >li>a {
    transition: all 0.28s ease;
    -webkit-transition: all 0.28s ease;
    -khtml-transition: all 0.28s ease;
    -moz-transition: all 0.28s ease;
    -o-transition: all 0.28s ease;
    -ms-transition: all 0.28s ease;
    display: -webkit-box /* OLD - iOS 6-, Safari 3.1-6 */;
    display: -moz-box /* OLD - Firefox 19- (buggy but mostly works) */;
    display: block;
    color: var(--text-color);
    font-size: 1rem;
    font-weight: bold;
    line-height: 36px;
    padding: 0 8px 0 8px;
    text-overflow: ellipsis;
    border-radius: 4px;
    -webkit-border-radius: 4px;
}
ul.list-v >li>a :hover{
    color: var(--link-hover-color)
}
ul.list-v.rightmenu a {
    cursor: default;
}


/* 信息提示框 */
.tooltip-rightmenu {
    position: fixed;
    top: 13%;
    left: 50%;
    transform: translate(-50%, -50%); /* 居中 */
    background: var(--tooltip-bg-color);
    color: var(--tooltip-text-color);
    padding: 10px 25px;
    border-radius: 5px;
    opacity: 0;
    z-index: 99;
    transition: opacity 1s ease-in-out;
}
.show-tooltip {
    opacity: 0.8;
}
```

如果你想要更改右键菜单的样式，可以借助浏览器的开发者工具选择对应的元素，修改其 CSS 属性。

## 使用 JavaScript 实现右键菜单的显示与隐藏

为了让我们自定义的右键菜单能够在用户右键点击时显示，我们需要使用 JavaScript 来实现这一功能。在 `source/js` 目录下创建一个 `RightMenu.js` 文件，内容如下：

```javascript
// 右键菜单
var right_click_num = 0;
var rect = document.getElementById("rightmenu-content").getBoundingClientRect();
window.oncontextmenu = function(e){
	// 检查是否按下了Ctrl键
	if (e.ctrlKey) {
		return true;
	}

	e.preventDefault(); //阻止浏览器自带的右键菜单显示
	var menu = document.getElementById("rightmenu-wrapper");
	menu.style.display = "block"; //将自定义的“右键菜单”显示出来
    if (e.clientX + rect.width > window.innerWidth) {
        menu.style.left = e.clientX - rect.width + "px"; // 如果超出屏幕宽度，则调整位置
    } else {
        menu.style.left = e.clientX + "px"; // 设置位置，跟随鼠标
    }
    if (e.clientY + rect.height > window.innerHeight) {
        menu.style.top = e.clientY - rect.height + "px"; // 如果超出屏幕高度，则调整位置
    } else {
        menu.style.top = e.clientY + "px"; // 设置位置，跟随鼠标
    }

	right_click_num = right_click_num + 1; //右键点击次数加1

	if(right_click_num == 1){
        const tooltip = document.getElementById('tooltip-rightmenu');
        tooltip.classList.add('show-tooltip');

        // 3秒后隐藏提示框
        setTimeout(() => {
		    tooltip.classList.remove('show-tooltip');
        }, 3000);
	}
}
window.onclick = function(e){ //点击窗口，右键菜单隐藏
	var menu = document.getElementById("rightmenu-wrapper");
	menu.style.display = "none";
}
```

这样，我们就实现了一个基本的右键菜单显示与隐藏功能。当用户右键点击时，自定义的右键菜单会显示在鼠标位置，并且如果用户按下了 `Ctrl` 键，则会显示浏览器原生的右键菜单。

## 使用 JavaScript 实现右键菜单的各项功能

在上一步中，我们已经实现了右键菜单的显示与隐藏功能，但其中的部分选项仍旧是一个空壳。接下来，我们将为这些选项添加功能。同样是在 `RightMenu.js` 文件中，我们将添加以下代码：

```javascript
// 更新提示框样式
function updateTooltipStyle() {
    const userColorScheme = document.documentElement.getAttribute('data-user-color-scheme');
    if (userColorScheme === 'dark') {
        document.documentElement.style.setProperty('--tooltip-bg-color', '#eeeeeea4');
        document.documentElement.style.setProperty('--tooltip-text-color', '#181c27');
    } else {
        document.documentElement.style.setProperty('--tooltip-bg-color', '#181c27a4');
        document.documentElement.style.setProperty('--tooltip-text-color', '#eeeeee');
    }
}
if (window.MutationObserver) {
    new MutationObserver(updateTooltipStyle).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-user-color-scheme', 'data-default-color-scheme']
    });
}

// 监听鼠标右键按下事件
document.addEventListener('contextmenu', function(event) {
    rect = document.getElementById("rightmenu-content").getBoundingClientRect();
    
    // 检查是否有选中的文本
    const copySelectedTextItem = document.getElementById('copy-selected-text');
    const searchSelectedTextItem = document.getElementById('search-selected-text-BING');
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        copySelectedTextItem.hidden = false;
        searchSelectedTextItem.hidden = false;
    } else {
        copySelectedTextItem.hidden = true;
        searchSelectedTextItem.hidden = true;
    }

    // 检查是否有链接被点击
    const goToLinkItem = document.getElementById('go-to-link');
    const link = event.target.closest('a[href]');
    if (link) {
        goToLinkItem.hidden = false;
        goToLinkItem.querySelector('a').setAttribute('href', link.href);
    } else {
        goToLinkItem.hidden = true;
    }

    //检查是否有图片被点击
    const downloadImageItem = document.getElementById('download-image');
    const copyImageItem = document.getElementById('copy-image-link');
    const img = event.target.closest('img') || event.target.closest('svg');
    if (img) {
        downloadImageItem.hidden = false;
        if (img.tagName.toLowerCase() === 'img') {
        copyImageItem.hidden = false;
        downloadImageItem.querySelector('a').setAttribute('onclick', `downloadImage('${img.src}')`);
        copyImageItem.querySelector('a').setAttribute('onclick', `copyImageLink('${img.src}')`);
        } else if (img.tagName.toLowerCase() === 'svg' && img.classList.contains('custom-gallery-svg')) {
            const backgroundImage = img.style.backgroundImage;
            const urlMatch = backgroundImage.match(/url\(["']?(.*?)["']?\)/);
            if (urlMatch && urlMatch[1]) {
            const imageUrl = urlMatch[1];
            downloadImageItem.querySelector('a').setAttribute('onclick', `downloadImage('${imageUrl}')`);
            copyImageItem.querySelector('a').setAttribute('onclick', `copyImageLink('${imageUrl}')`);
            }
        }
    } else {
        downloadImageItem.hidden = true;
        copyImageItem.hidden = true;
    }

    // 根据前三者判断第一栏是否有元素，需要分割线
    const topLineItem = document.getElementById('top-line');
    if (copySelectedTextItem.hidden && !link && !img) {
        topLineItem.hidden = true;
    } else {
        topLineItem.hidden = false;
    }
});

// 复制选中-复制选中文本功能
function copySelectedText() {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
        navigator.clipboard.writeText(selectedText);
        const tooltip = document.getElementById('tooltip-rightmenu-return');
        tooltip.textContent = '选中文本已复制到剪贴板';
        tooltip.classList.add('show-tooltip');
        setTimeout(() => {
            tooltip.classList.remove('show-tooltip');
        }, 1500);
    }
}

// 必应搜索-在Bing上搜索选中文本功能
function searchSelectedTextBing() {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        const bingSearchUrl = `https://www.bing.com/search?q=${encodeURIComponent(selectedText)}`;
        window.open(bingSearchUrl, '_blank');
    }
}

// 转到链接-跳转到选中链接功能
function goToLink() {
    const goToLinkItem = document.getElementById('go-to-link');
    const href = goToLinkItem.querySelector('a').getAttribute('href');
    if (href) {
        window.open(href, '_blank');
    }
}

// 下载图片-下载选中图片功能
function downloadImage(imgsrc) {
    if (!imgsrc) {
        console.error('Image source is required');
        return;
    }

    const name = imgsrc.split('/').pop(); // Extract the image name from the path
    fetch(imgsrc)
        .then(response => response.blob())
        .then(blob => {
            const a = document.createElement('a');
            const url = URL.createObjectURL(blob);
            a.href = url;
            a.download = name;
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
            document.body.removeChild(a);
            const tooltip = document.getElementById('tooltip-rightmenu-return');
            tooltip.textContent = '图片已下载';
            tooltip.classList.add('show-tooltip');
            setTimeout(() => {
                tooltip.classList.remove('show-tooltip');
            }, 1500);
        })
        .catch(error => console.error('Error downloading image:', error));
}

// 复制图片链接-复制选中图片链接功能
function copyImageLink(imgsrc) {
    if (imgsrc) {
        navigator.clipboard.writeText(imgsrc);
        const tooltip = document.getElementById('tooltip-rightmenu-return');
        tooltip.textContent = '链接已复制到剪贴板';
        tooltip.classList.add('show-tooltip');
        setTimeout(() => {
            tooltip.classList.remove('show-tooltip');
        }, 1500);
    }
}

// 随便看看-随机跳转到文章
function RandomGo() {
    var posts = JSON.parse(sessionStorage.getItem('posts'));
    const randomIndex = Math.floor(Math.random() * posts.length);
    const randomLink = posts[randomIndex];
    window.location.href = randomLink;
}

// 复制链接-复制当前地址功能
function copyLink() {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    const tooltip = document.getElementById('tooltip-rightmenu-return');
    tooltip.textContent = '链接已复制到剪贴板';
    tooltip.classList.add('show-tooltip');

    // 3秒后隐藏提示框
    setTimeout(() => {
        tooltip.classList.remove('show-tooltip');
    }, 1500);
}
```

这段代码实现了右键菜单的各项功能，包括复制选中文本、必应搜索、跳转到链接、下载图片、复制图片链接、随机跳转到文章以及复制当前页面链接。

其中，随即跳转到文章的功能需要在页面加载时将所有文章链接存储在 `sessionStorage` 中，这一点我在[Fluid页脚美化](/posts/Fluid页脚美化/)中就已经实现了。你可以参考上一期的实现，也可以将 `RightMenu.js` 中的 `RandomGo()` 函数替换为以下代码：

```javascript
function RandomGo() {
    var posts = JSON.parse(sessionStorage.getItem('posts')) || [];
    if (posts.length === 0) {
        fetch('/sitemap.xml')
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data => {
            const entries = data.querySelectorAll('url > loc');
            posts = Array.from(entries)
                .map(entry => entry.textContent)
                .filter(link => link.includes('/posts/'))
                .map(link => link.substring(link.indexOf('/posts/')));
            sessionStorage.setItem('posts', JSON.stringify(posts)); // 保存到 sessionStorage
            console.log('Posts updated:', posts); // 调试输出更新后的链接列表
        })
        .catch(error => console.error('Error fetching sitemap:', error));
        if (posts.length > 0) {
            const randomIndex = Math.floor(Math.random() * posts.length);
            const randomLink = posts[randomIndex];
            window.location.href = randomLink;
        }
    } else {
        const randomIndex = Math.floor(Math.random() * posts.length);
        const randomLink = posts[randomIndex];
        window.location.href = randomLink;
    }
}
```

# 总结

通过以上步骤，我们成功实现了一个无侵入式的自定义右键菜单。这个右键菜单不仅美观，而且功能丰富，能够满足大部分用户的需求。以下是完整的使用方法：

1. 在 Hexo 的 `source/html` 目录下创建 `RightMenu.html` 文件，并将[上述HTML结构](#创建右键菜单的-html-结构)复制到该文件中。
2. 在 Hexo 的 `scripts/injector.js` 文件中添加[上述注入器代码](#使用-hexo-注入器将-html-结构注入到页面中)。
3. 在 Hexo 的 `source/css` 目录下创建 `RightMenu.css` 文件，并将[上述CSS样式](#使用-css-美化右键菜单)复制到该文件中。
4. 在 Hexo 的 `source/js` 目录下创建 `RightMenu.js` 文件，并将上述JavaScript代码复制到该文件中，**注意**需要包括[右键菜单显示和隐藏](#使用-javascript-实现右键菜单的显示与隐藏)和[各项功能实现](#使用-javascript-实现右键菜单的各项功能)两部分代码，必要时需要替换 `RandomGo()` 函数的实现。

如果你想要使用这个右键菜单，只需将上述代码复制到你的 Hexo 博客中即可。你可以根据自己的需求进一步修改和扩展这个右键菜单的功能。如果你对这个右键菜单有任何疑问或建议，欢迎在评论区留言讨论。