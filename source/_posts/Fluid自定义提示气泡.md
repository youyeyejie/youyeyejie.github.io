---
title: Fluid自定义提示气泡
category_bar: true
date: 2025-12-31 14:51:39
tags:
  - Hexo
  - Fluid
categories:
  - Hexo Blog Building
excerpt: Fluid 主题美化记录7.0——无侵入式自定义提示气泡
index_img: /_posts/Fluid自定义提示气泡/image.webp
---

# 前言

本期美化同样贯彻了前几期美化的原则：**无侵入式美化**，即不修改主题的源代码，只通过修改配置文件、自定义样式以及Hexo注入器来实现美化。前几期的美化可以点击下方的链接卡片查看。

<a href="/tags/Fluid/" logourl="/img/avatar/avatar.webp" class="LinkCard">Fluid主题美化</a>

在本期中，我们将为Fluid主题实现自定义提示气泡功能，并作为其他美化的组件使用，提升博客的美观性和用户体验。


# 实现

首先，在博客的 `scripts/injector.js` 文件中添加以下代码，以在页面的 `<body>` 开始位置注入一个提示气泡的容器：

```javascript
hexo.extend.injector.register("body_begin", `<div id="tooltip" class="tooltip"></div>`);
```

接着，我们需要为这个提示气泡容器添加相应的样式。为此，我们在博客的 `source/css` 目录下创建一个名为 `Tooltip.css` 的 CSS 文件，代码如下：

```css
/* 信息提示框 */
:root {
    /* 默认info类型（基础样式） */
    --tooltip-info-bg: #181c27a4;
    --tooltip-info-text: #fff;
    --tooltip-info-border: 1px solid #2d3446;

    /* warning类型（警告样式：黄色系） */
    --tooltip-warning-bg: #f5a623a4;
    --tooltip-warning-text: #fff;
    --tooltip-warning-border: 1px solid #f7c04a;

    /* error类型（错误样式：红色系，额外扩展，增强实用性） */
    --tooltip-error-bg: #e53e3ea4;
    --tooltip-error-text: #fff;
    --tooltip-error-border: 1px solid #f56565;

    /* success类型（成功样式：绿色系，额外扩展，增强实用性） */
    --tooltip-success-bg: #305f46a4;
    --tooltip-success-text: #fff;
    --tooltip-success-border: 1px solid #305f46;
}

/* 暗黑模式适配（反转各类型样式对比度） */
[data-user-color-scheme="dark"] {
    --tooltip-info-bg: #eeeeeec0;
    --tooltip-info-text: #181c27;
    --tooltip-info-border: 1px solid #dcdcdc;

    --tooltip-warning-bg: #f5a623c0;
    --tooltip-warning-text: #fff;
    --tooltip-warning-border: 1px solid #f7c04a;

    --tooltip-error-bg: #e53e3ec0;
    --tooltip-error-text: #fff;
    --tooltip-error-border: 1px solid #f56565;

    --tooltip-success-bg: #3b7154a4;
    --tooltip-success-text: #fff;
    --tooltip-success-border: 1px solid #305f46;
}


.tooltip {
    position: fixed;
    top: 13%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 10px 25px;
    border-radius: 5px;
    opacity: 0;
    z-index: 99;
    transition: opacity 1s ease-in-out;
    pointer-events: none;
}

.show-tooltip {
    opacity: 0.9;
}

.info {
    background: var(--tooltip-info-bg);
    color: var(--tooltip-info-text);
    border: var(--tooltip-info-border);
}

.warning {
    background: var(--tooltip-warning-bg);
    color: var(--tooltip-warning-text);
    border: var(--tooltip-warning-border);
}

.error {
    background: var(--tooltip-error-bg);
    color: var(--tooltip-error-text);
    border: var(--tooltip-error-border);
}

.success {
    background: var(--tooltip-success-bg);
    color: var(--tooltip-success-text);
    border: var(--tooltip-success-border);
}
```

接着，我们需要添加 JavaScript 代码来控制提示气泡的显示和隐藏。在博客的 `source/js` 目录下创建一个名为 `Tooltip.js` 的 JavaScript 文件，代码如下：

```javascript
/**
 * 对外暴露的提示框调用函数
 * @param {Object} options - 配置参数
 * @param {string} [options.type='info'] - 提示类型，可选值：info/warning/error/success
 * @param {string} [options.message=''] - 提示文本内容
 * @param {number} [options.duration=3000] - 提示框显示时长（毫秒），默认3秒
 */
function showTooltip({ type = "info", message = "", duration = 3000 } = {}) {
    // 1. 校验提示类型的合法性，默认回退到info
    const validTypes = ["info", "warning", "error", "success"];
    const targetType = validTypes.includes(type) ? type : "info";

    // 2. 获取或创建提示框DOM元素（确保元素唯一，避免重复创建）
    let tooltip = document.getElementById("tooltip");
    if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.id = "tooltip";
        document.body.appendChild(tooltip);
    }

    // 3. 重置提示框样式（移除旧的类型类名和显示类名，避免样式叠加）
    validTypes.forEach((validType) => {
        tooltip.classList.remove(validType);
    });
    tooltip.classList.remove("show-tooltip");

    // 4. 设置提示框内容和当前类型样式
    tooltip.innerHTML = message;
    tooltip.classList.add(targetType);

    // 5. 强制触发重排（解决过渡效果不生效的问题）
    void tooltip.offsetWidth;

    // 6. 添加显示类名，触发淡入过渡
    tooltip.classList.add("show-tooltip");

    // 7. 定时隐藏提示框，触发淡出过渡
    setTimeout(() => {
        tooltip.classList.remove("show-tooltip");
    }, duration);
}
```

- 在上面的代码中，我们定义了一个 `showTooltip` 函数，它接受一个配置对象作为参数。该函数会根据传入的类型、消息内容和持续时间来显示相应的提示气泡。
- 提示气泡支持四种类型：`info`（信息）、`warning`（警告）、`error`（错误）和 `success`（成功）。每种类型都对应了前面在 CSS 中定义的不同样式。
- 因此，如果需要在博客中显示一个提示气泡，只需调用 `showTooltip` 函数并传入相应的参数即可。例如：

```javascript
showTooltip({
    type: "warning",
    message: "这是一个警告提示！",
    duration: 5000
});
```

在实现了上述代码后，我们需要确保它在页面加载时被执行。为此，我们需要在博客的 `_config.fluid.yml` 文件中添加以下配置：

```yaml
custom_js:
  - /js/Tooltip.js # 自定义提示气泡脚本
custom_css:
  - /css/Tooltip.css # 自定义提示气泡样式
```

# 效果展示
点击下面的按钮，即可看到不同类型的提示气泡效果：

<a class="btn" style="background: var(--tooltip-info-bg); color: var(--tooltip-info-text);" onclick="showTooltip({type: 'info', message: '这是一个<strong>信息</strong>气泡！', duration: 3000});">Info</a>
<a class="btn" style="background: var(--tooltip-warning-bg); color: var(--tooltip-warning-text);" onclick="showTooltip({type: 'warning', message: '这是一个<strong>警告</strong>气泡！', duration: 3000});">Warning</a>
<a class="btn" style="background: var(--tooltip-error-bg); color: var(--tooltip-error-text);" onclick="showTooltip({type: 'error', message: '这是一个<strong>错误</strong>气泡！', duration: 3000});">Error</a>
<a class="btn" style="background: var(--tooltip-success-bg); color: var(--tooltip-success-text);" onclick="showTooltip({type: 'success', message: '这是一个<strong>成功</strong>气泡！', duration: 3000});">Success</a>

# 对自定义右键菜单的优化
在前几期的美化中，我们实现了自定义右键菜单功能，具体实现可以参考下面这篇文章：

<a href="/_posts/Fluid自定义右键菜单/" logourl="/img/avatar/avatar.webp" class="LinkCard">Fluid自定义右键菜单</a>

在之前的实现中，我们在每处需要显示提示气泡的地方都直接编写了类似的调用代码。为了提升代码的可维护性和复用性，我们可以将其改为调用我们刚刚实现的 `showTooltip` 函数。

{% fold info @修改后的代码 %}
```html
<!-- RightMenu.html -->
<div id="rightmenu-wrapper">
  <ul class="list-v rightmenu" id="rightmenu-content">
	    <li class="navigation menuNavigation-Content">
            <a class="nav icon-only fix-cursor-default" aria-label="back" onclick="history.back()"><i class="fa-solid fa-chevron-left"></i></a>
            <a class="nav icon-only fix-cursor-default" aria-label="forward" onclick="history.forward()"><i class="fa-solid fa-chevron-right"></i></a>
            <a class="nav icon-only fix-cursor-default" aria-label="reload" onclick="window.location.reload()"><i class="fa-solid fa-rotate-right"></i></a>
            <a class="nav icon-only fix-cursor-default" aria-label="top" onclick="scrollToTopSmooth();"><i class="fa-solid fa-chevron-up"></i></a>
            <a class="nav icon-only fix-cursor-default" aria-label="bottom" onclick="scrollToBottomSmooth();"><i class="fa-solid fa-chevron-down"></i></a>
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
            <a class="vlts-menu fix-cursor-default" target="_blank">
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
            <a class="vlts-menu fix-cursor-default" target="_self" onclick="toggleColorMode();">
            <span>
                <i id="toggle-color-mode-icon" class="fa-solid fa-circle-half-stroke"></i>
                &nbsp;切换昼夜
            </span>
            </a>
        </li>
        <li class="menuLoad-Content" style="display: block;">
            <a class="vlts-menu fix-cursor-default" target="_self" onclick="toggleBackgroundMode();">
            <span>
                <i id="toggle-background-mode-icon" class="fa-solid fa-toggle-on"></i>
                &nbsp;全屏背景
            </span>
            </a>
        </li>
    </ul>
</div>


<script src="/js/RightMenu.js" type="text/javascript"></script>
<link href="/css/RightMenu.css" type="text/css" rel="stylesheet"/>
```

```javascript
// RightMenu.js
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
    if (e.clientX + rect.width > window.innerWidth) { // 如果超出屏幕右边
        if (e.clientX - rect.width < 0) {
            menu.style.left = "0px"; // 如果超出屏幕左边，则调整位置到左侧贴边
        } else {
            menu.style.left = e.clientX - rect.width + "px"; // 否则调整到鼠标位置的左侧
        }
    } else {
        menu.style.left = e.clientX + "px"; // 设置位置，跟随鼠标
    }
    if (e.clientY + rect.height > window.innerHeight) { // 如果超出屏幕底部
        if (e.clientY - rect.height < 0) {
            menu.style.top = "0px"; // 如果超出屏幕顶部，则调整位置到顶部
        } else {
            menu.style.top = e.clientY - rect.height + "px"; // 否则调整到鼠标位置的上方
        }
    } else {
        menu.style.top = e.clientY + "px"; // 设置位置，跟随鼠标
    }

	right_click_num = right_click_num + 1; //右键点击次数加1

	if(right_click_num == 1){
        showTooltip({
            type: 'info',
            message: '如需原始右键菜单请按下 <strong>Ctrl+右键</strong>'
        });
	}
}

window.onclick = function(e){ //点击窗口，右键菜单隐藏
	var menu = document.getElementById("rightmenu-wrapper");
	menu.style.display = "none";
}

// 监听鼠标右键按下事件
document.addEventListener('contextmenu', function(event) {    
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
    
    // 更新尺寸相关参数
    rect = document.getElementById("rightmenu-content").getBoundingClientRect();
});

// 平滑滚动到顶部
function scrollToTopSmooth() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 平滑滚动到底部
function scrollToBottomSmooth() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
}

// 复制选中-复制选中文本功能
function copySelectedText() {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
        navigator.clipboard.writeText(selectedText);
        showTooltip({
            type: 'success',
            message: '选中文本已复制到剪贴板'
        });
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
            showTooltip({
                type: 'success',
                message: '图片已下载'
            });
        })
        .catch(error => console.error('Error downloading image:', error));
}

// 复制图片链接-复制选中图片链接功能
function copyImageLink(imgsrc) {
    if (imgsrc) {
        navigator.clipboard.writeText(imgsrc);
        showTooltip({
            type: 'success',
            message: '链接已复制到剪贴板'
        });
    }
}

// 随便看看-随机跳转到文章
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
                .filter(link => link.includes('/_posts/'))
                .map(link => link.substring(link.indexOf('/_posts/')));
            sessionStorage.setItem('posts', JSON.stringify(posts)); // 保存到 sessionStorage
            console.log('Posts updated:', posts); // 调试输出更新后的链接列表
            const randomIndex = Math.floor(Math.random() * posts.length);
            const randomLink = posts[randomIndex];
            window.location.href = randomLink;       
        })
        .catch(error => console.error('Error fetching sitemap:', error));
    } else {
        const randomIndex = Math.floor(Math.random() * posts.length);
        const randomLink = posts[randomIndex];
        window.location.href = randomLink;
    }
}

// 复制链接-复制当前地址功能
function copyLink() {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    showTooltip({
        type: 'success',
        message: '链接已复制到剪贴板'
    });
}

// 切换昼夜模式功能
function toggleColorMode() {
    document.getElementById('color-toggle-btn').click();
    if (document.documentElement.getAttribute('data-user-color-scheme') === 'dark' ||
        (document.documentElement.getAttribute('data-user-color-scheme') === 'auto' &&
         window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.getElementById('toggle-color-mode-icon').className = "iconfont icon-dark";
    }
    else {
        document.getElementById('toggle-color-mode-icon').className = "iconfont icon-light";
    }
}

// 切换全屏背景功能
function toggleBackgroundMode() {
    const BackgroundMode = localStorage.getItem('BackgroundMode');
    if (BackgroundMode === 'false' || !BackgroundMode) {
        document.querySelector('#web_bg').style.backgroundImage = `${document.querySelector('.banner').style.background.split(' ')[0]}`;
        document.querySelector("#banner").style.background = 'url()';
        document.querySelector("#banner .mask").style.backgroundColor = 'rgba(0,0,0,0)';
        document.getElementById('toggle-background-mode-icon').className = "fa-solid fa-toggle-on";
        ['#toc', '.category-list'].forEach(selector => {
            if (document.querySelector(selector)) {
                document.querySelector(selector).style.backgroundColor = "var(--board-bg-color)";
            }
        });
        localStorage.setItem('BackgroundMode', 'true');
    }
    else {
        document.querySelector("#banner").style.background = document.querySelector('#web_bg').style.backgroundImage + " center center / cover no-repeat";
        document.querySelector('#web_bg').style.backgroundImage = 'url()';
        document.querySelector("#banner .mask").style.backgroundColor = 'rgba(0,0,0,0.3)';
        document.getElementById('toggle-background-mode-icon').className = "fa-solid fa-toggle-off";
        ['#toc', '.category-list'].forEach(selector => {
            if (document.querySelector(selector)) {
                document.querySelector(selector).style.removeProperty('background-color');
            }
        });
        localStorage.setItem('BackgroundMode', 'false');
    }
}

// 页面加载完毕后初始化图标状态和提示
window.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('DarkNightMode') === 'true') {
        document.getElementById("toggle-color-mode-icon").className = "iconfont icon-light";
    } else {
        document.getElementById("toggle-color-mode-icon").className = "iconfont icon-dark";
    }
    if (localStorage.getItem('BackgroundMode') === 'true') {
        document.getElementById('toggle-background-mode-icon').className = "fa-solid fa-toggle-on";
    } else {
        document.getElementById('toggle-background-mode-icon').className = "fa-solid fa-toggle-off";
    }

    // 显示提示气泡
    showTooltip({
        type: 'info',
        message: '如需原始右键菜单请按下 <strong>Ctrl+右键</strong>'
    });
});
```

```css
/* RightMenu.css */
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
    transition: all 0.4s ease;
}
ul.list-v.rightmenu a.vlts-menu:hover {
    padding-left: 30px;
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
```
{% endfold %}

# 总结
通过本期的美化，我们成功为Fluid主题实现了一个无侵入式的自定义提示气泡功能。该功能不仅提升了博客的美观性，还增强了用户体验，使得用户在与博客交互时能够获得即时的反馈信息。