---
title: Fluid新增右键功能
tags:
  - Hexo
  - Fluid
categories:
  - Hexo Blog Building
excerpt: Fluid 主题美化记录8.0——新增右键菜单功能，支持随机切换背景图功能和关闭标签页显示功能。
index_img: /_posts/Fluid新增右键功能/image.webp
category_bar: true
date: 2026-01-03 14:33:56
updated:
---

# 前言

在本次美化中，我在之前实现的自定义右键菜单功能基础上，新增了两个实用功能：随机切换背景图功能和关闭标签页显示功能。自定义右键的实现可以参考之前的文章：

<a href="/_posts/Fluid自定义右键菜单/" logourl="/_posts/Fluid自定义右键菜单/image.webp" class="LinkCard">Fluid自定义右键菜单</a>

其中，随即切换背景图功能可以让用户通过右键菜单快速更换博客的背景图片，提升视觉体验。而关闭标签页显示功能则是因为有读者反馈博客的标签页标题切换功能会影响使用体验，如在历史记录中留下大量相同标题的记录，故新增该功能以供用户选择是否启用。

# 实现过程
## 修改自定义右键菜单 HTML 结构
首先，在 `source/html/RightMenu.html` 文件中，新增两个菜单项，分别对应随机切换背景图和切换标签页显示功能：

```html
        <li class="menuLoad-Content" style="display: block;">
            <a class="vlts-menu fix-cursor-default" target="_self" onclick="randomChangeBackground();">
                <span style="margin-left: 1px;">
                    <i id="random-change-background" class="fa-solid fa-image"></i>
                    &nbsp;切换背景
                </span>
            </a>
        </li>
        <li class="menuLoad-Content" style="display: block;">
            <a class="vlts-menu fix-cursor-default" target="_self" onclick="toggleTabDisplay();">
                <span>
                    <i id="toggle-tab-display-icon" class="fa-solid fa-toggle-on" style="margin-right: -1px;"></i>
                    &nbsp;自定义标签
                </span>
            </a>
        </li>
```

## 实现随机切换背景功能
然后，在 `source/js/RightMenu.js` 文件中，添加对应的功能实现代码：

```javascript
// 随机切换背景功能
function randomChangeBackground() {
    const random_banner = imgs[Math.floor(Math.random() * imgs.length)];
    const banner = document.getElementById('banner');
    const web_bg = document.getElementById('web_bg');
    const BackgroundMode = localStorage.getItem('BackgroundMode');
    if (banner && web_bg) {
        if (BackgroundMode === 'true') {
            web_bg.style.backgroundImage = `url(${random_banner})`;
        }
        else {
            banner.style.background = `url(${random_banner}) center center / cover no-repeat`;
        }
    }
}
```

其中，`imgs` 是预定义的背景图片路径数组，`banner` 是  Fluid 博客自带的横幅和，`web_bg` 是自定义的网页背景元素，具体可以参考之前的文章：

<a href="/_posts/Fluid随机背景/" logourl="/_posts/Fluid随机背景/image.webp" class="LinkCard">Fluid随机背景</a>

<a href="/_posts/Fluid全屏背景/" logourl="/_posts/Fluid全屏背景/image.webp" class="LinkCard">Fluid全屏背景</a>

## 实现关闭标签页显示功能
最后，在 `source/js/RightMenu.js` 文件中，添加切换标签页显示功能的实现代码：

```javascript
// 切换自定义标签显示功能
function toggleTabDisplay() {
    const TabDisplayMode = localStorage.getItem('TabDisplayMode');
    if (TabDisplayMode === 'false' || !TabDisplayMode) {
        TabDisplay(true);
        document.getElementById('toggle-tab-display-icon').className = "fa-solid fa-toggle-on";
        localStorage.setItem('TabDisplayMode', 'true');
        showTooltip({
            type: 'info',
            message: '已启用标签页标题切换功能'
        });
    } else {
        TabDisplay(false);
        document.getElementById('toggle-tab-display-icon').className = "fa-solid fa-toggle-off";
        localStorage.setItem('TabDisplayMode', 'false');
        showTooltip({
            type: 'info',
            message: '已禁用标签页标题切换功能'
        });
    }
}
```

然后修改 `source/js/TabDisplay.js` 文件中的代码，对标签页标题切换功能进行封装，以便根据用户选择启用或禁用该功能：

<a href="/_posts/Fluid主题美化/#标签页根据焦点切换显示" logourl="/_posts/Fluid主题美化/image.webp" class="LinkCard">Fluid主题美化——标签页根据焦点切换显示</a>

```javascript
const originalTitle = document.title; // 缓存页面原始标题（全局复用，避免重复获取）
let welcomeTimer = null; // 恢复原标题的定时器

/**
 * 核心：页面可见性变化处理函数（提取为独立函数，方便绑定/移除）
 */
function handleVisibilityChange() {
    // 清除已有定时器，避免定时器叠加
    if (welcomeTimer) {
        clearTimeout(welcomeTimer);
        welcomeTimer = null;
    }

    // 先获取浏览器兼容的可见性属性
    let visibilityProp = '';
    if (typeof document.hidden !== "undefined") {
        visibilityProp = "hidden";
    } else if (typeof document.mozHidden !== "undefined") {
        visibilityProp = "mozHidden";
    } else if (typeof document.webkitHidden !== "undefined") {
        visibilityProp = "webkitHidden";
    }

    // 根据页面可见性切换标题
    if (document[visibilityProp]) {
        document.title = " 你去哪啦(๑•́ ₃ •̀๑) ";
    } else {
        document.title = " 你回来啦(*^▽^*) ";
        welcomeTimer = setTimeout(() => {
            document.title = originalTitle;
        }, 2000);
    }
}

function TabDisplay(enable) {
    // 获取浏览器兼容的事件名和属性名
    let visibilityChangeEvent = '';
    if (typeof document.hidden !== "undefined") {
        visibilityChangeEvent = "visibilitychange";
    } else if (typeof document.mozHidden !== "undefined") {
        visibilityChangeEvent = "mozvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
        visibilityChangeEvent = "webkitvisibilitychange";
    }

    if (enable) {
        // 启用功能：绑定事件监听，更新按钮文案
        if (visibilityChangeEvent) {
            document.addEventListener(visibilityChangeEvent, handleVisibilityChange, false);
        }
    } else {
        // 禁用功能：移除事件监听，清除定时器，恢复原始标题，更新按钮文案
        if (visibilityChangeEvent) {
            document.removeEventListener(visibilityChangeEvent, handleVisibilityChange, false);
        }
        // 清理残留状态
        if (welcomeTimer) {
            clearTimeout(welcomeTimer);
            welcomeTimer = null;
        }
        document.title = originalTitle;
    }
}

jQuery(document).ready(function() {
    const TabDisplayMode = localStorage.getItem('TabDisplayMode');
    if (TabDisplayMode || TabDisplayMode === 'true') {
        TabDisplay(true);
        localStorage.setItem('TabDisplayMode', 'true');
    }
});
```

# 总结
至此，Fluid 主题的右键菜单功能得到了进一步增强，用户可以通过右键菜单快速切换背景图片，或根据个人喜好选择是否启用标签页标题切换功能。这些改进提升了博客的用户体验和个性化设置，使其更加符合读者的使用习惯。
