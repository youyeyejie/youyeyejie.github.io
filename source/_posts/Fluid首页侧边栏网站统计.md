---
title: Fluid首页侧边栏网站统计
category_bar: true
date: 2025-08-01 14:51:42
tags:
  - Hexo
  - Fluid
categories:
  - Hexo Blog Building
excerpt: Fluid 主题美化记录5.0——无侵入实现Fluid首页侧边栏网站数据统计
index_img: /_posts/Fluid首页侧边栏网站统计/image.webp
---

# 前言

本期美化同样贯彻了前几期美化的原则：**无侵入式美化**，即不修改主题的源代码，只通过修改配置文件、自定义样式以及Hexo注入器来实现美化。前几期的美化可以点击下方的链接卡片查看。

<a href="/tags/Fluid/" name="/img/avatar/avatar.webp" class="LinkCard">Fluid主题美化</a>

在浏览其他人的博客时，我发现许多主题在首页都会有一个侧边栏，展示一些网站的统计数据，比如文章总数、全站字数、总访问量、总访客数、建站时长和上次更新等信息，而 Fluid 主题却不具备这样的功能。因此，在本期中，我们将在 Fluid 主题的首页实现一个侧边栏，在其中展示网站的统计数据。

# 实现
## JavaScript 脚本

首先，我们需要在博客的 `source/js` 目录下创建一个名为 `Sidebar.js` 的 JavaScript 文件，代码如下：

```javascript
function lastUpdate() {
    fetch('/sitemap.xml')
    .then(response => response.text())
    .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
    .then(data => {
        const lastmodDates = Array.from(data.querySelectorAll('url > lastmod')).map(node => new Date(node.textContent));
        const mostRecentDate = new Date(Math.max(...lastmodDates));
        const now = new Date();
        const diffTime = Math.abs(now - mostRecentDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 0) {
            document.getElementById('sidebar-site-update').innerText = `今天`;
        } else {
            document.getElementById('sidebar-site-update').innerText = `${diffDays}天前`;
        }
    })
}

function updateSidebar() {
    document.getElementById('sidebar-word-count').innerHTML = document.getElementById('g-total-word-id').innerText;
    document.getElementById('sidebar-post-count').innerHTML = document.getElementById('g-total-posts-id').innerText;
    document.getElementById('sidebar-site-age').innerHTML = document.getElementById('time-day').innerText + '天';
    document.getElementById('sidebar-site-pv').innerHTML = document.getElementById('vercount_value_site_pv').innerText;
    document.getElementById('sidebar-site-uv').innerHTML = document.getElementById('vercount_value_site_uv').innerText;
    lastUpdate(); 
}

function createSidebar() {
    const main = document.querySelector('main');

    const sideCol = document.createElement('div');
    sideCol.className = "side-col d-none d-lg-block col-lg-2";
    sideCol.style.paddingTop = "60px";
    sideCol.style.float = "right";
    sideCol.style.position = "sticky";
    sideCol.style.top = "2rem";

    const sideBar= `
        <aside class="sidebar" id="site-stats">
            <div class="sidebar-element">
                <span><i class="fas fa-file-alt"></i> &nbsp;文章总数</span>
                <span id="sidebar-post-count"></span>
            </div>
            <div class="sidebar-element">
                <span><i class="fas fa-chart-bar" style="font-size: 0.8rem;"></i> &nbsp;全站字数</span>
                <span id="sidebar-word-count"></span>
            </div>
            <div class="sidebar-element">
                <span><i class="fas fa-eye" style="font-size: 0.8rem;"></i> &nbsp;总访问量</span>
                <span id="sidebar-site-pv"></span>
            </div>
            <div class="sidebar-element">
                <span><i class="fas fa-user"></i> &nbsp;总访客数</span>
                <span id="sidebar-site-uv"></span>
            </div>
            <div class="sidebar-element">
                <span><i class="fas fa-calendar-alt"></i> &nbsp;建站时长</span>
                <span id="sidebar-site-age"></span>
            </div>
            <div class="sidebar-element">
                <span><i class="fa-solid fa-pen-nib"></i> &nbsp;上次更新</span>
                <span id="sidebar-site-update"></span>
            </div>
        </aside>
    `;
    sideCol.innerHTML = sideBar;
    main.insertBefore(sideCol, main.firstChild);
    updateSidebar();
    judgeSidebarHidden();

    const sidebar_pv = document.getElementById('sidebar-site-pv').innerHTML;
    if (sidebar_pv === '1314') {
        var vercount_pv = document.getElementById('vercount_value_site_pv').innerHTML;
        var intervalId = setInterval(() => {
            vercount_pv = document.getElementById('vercount_value_site_pv').innerHTML;
            if (vercount_pv !== '1314') {
                updateSidebar();
                clearInterval(intervalId);
            }
        }, 100);
    }
}

function judgeSidebarHidden() {
    const boardRect = document.getElementById('board').getBoundingClientRect();
    const sideColRect = document.querySelector('.side-col.d-none.d-lg-block.col-lg-2').getBoundingClientRect();
    const sideBar = document.getElementById('site-stats');
    // console.log(boardRect.right, sideColRect.left);
    if (boardRect.right > sideColRect.left) {
        sideBar.style.display = 'none';
    } else {
        sideBar.style.display = 'block';
    }
}

if (document.querySelector('meta[property="og:url"][content="https://youyeyejie.github.io/index.html"]')) {
    document.addEventListener('DOMContentLoaded', createSidebar);
    window.addEventListener('resize', () => {
        judgeSidebarHidden();
    });
}
```

其中：

- `lastUpdate` 函数用于获取博客上一次更新的时间，这依靠的是 sitemap 中记录的博客上次修改时间，因此需要我们每次更新博客时都会更新网站地图，可以使用 `hexo-generator-sitemap` 插件来实现。
- `updateSidebar` 函数用于更新侧边栏中的网站统计数据，为此我还修改了在[Fluid页脚美化](/_posts/Fluid页脚美化/)中网站运行时间的相关代码。
- `createSidebar` 函数用于定位以及创建侧边栏，由于统计数据中的访问量一项的更新可能存在延迟，因此我在函数中还设置了检查逻辑，循环检查直到访问量不等于默认的 1314 时，更新侧边栏数据。
- `judgeSidebarHidden` 函数用于判断侧边栏是否需要隐藏，当侧边栏与内容区重叠时，隐藏侧边栏；当侧边栏与内容区不重叠时，显示侧边栏。
- 最后通过检查页面的元数据，判断该页面是否是首页，从而决定是否插入侧边栏

## CSS 样式

通过上面的脚本，我们已经实现了一个简易的侧边栏，接下来只需要稍微美化一下。

只需要在 `source/css` 目录下创建一个名为 `Sidebar.css` 的 CSS 文件，代码如下：

```css
:root {
    --sitestat-bg-color: #ffffffa4;
}
[data-user-color-scheme="dark"] {
    --sitestat-bg-color: #242a38a4;
}

#site-stats {
    margin-top: 4rem;
    padding: 15px 20px;
    top: 4rem;
    background-color: var(--sitestat-bg-color);
    border-radius: 10px;
    -webkit-backdrop-filter: blur(15px);
    backdrop-filter: blur(15px);
    display: block;
}

.sidebar-element {
    display: flex;
    justify-content: space-between;
    margin: 12px 0 12px 0;
}
```

## 在配置文件中引入

最后，我们需要在博客的 `_config.fluid.yml` 配置文件中引入上面创建的 JavaScript 和 CSS 文件。可以在 `head` 部分添加以下内容：

```yaml
custom_js:
  - js/Sidebar.js
custom_css:
  - css/Sidebar.css
```

# 总结

通过以上步骤，我们成功地在 Fluid 主题的首页实现了一个侧边栏，展示了网站的统计数据。这个侧边栏不仅美观，而且实用，可以让访客更好地了解网站的内容和活跃度。
