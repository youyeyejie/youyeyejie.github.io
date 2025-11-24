---
title: Fluid全屏背景
date: 2025-11-24 21:30:29
category_bar: true
tags:
  - Hexo
  - Fluid
categories:
  - Hexo Blog Building
excerpt: Fluid 主题美化记录6.0——无侵入实现全屏背景
index_img: /_posts/Fluid全屏背景/image.webp
---

# 前言

本期美化同样贯彻了前几期美化的原则：**无侵入式美化**，即不修改主题的源代码，只通过修改配置文件、自定义样式以及Hexo注入器来实现美化。前几期的美化可以点击下方的链接卡片查看。

<a href="/tags/Fluid/" name="/img/avatar/avatar.webp" class="LinkCard">Fluid主题美化</a>

在本期中，我们将为Fluid主题实现全屏背景功能，提升博客的视觉效果。

# 实现

首先，在博客的 `scripts/injector.js` 文件中添加以下代码，以在页面的 `<body>` 开始位置注入一个全屏背景容器：

```javascript
hexo.extend.injector.register("body_begin", `<div id="web_bg"></div>`);
```

接着，我们需要为这个全屏背景容器添加相应的样式。为此，我们在博客的 `source/css` 目录下创建一个名为 `Background.css` 的 CSS 文件，代码如下：

```css
#web_bg {
    filter: brightness(0.5);
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-size: cover;
    inset: 0;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}
```

- 在上面的样式中，我们为 `web_bg` 容器设置了全屏覆盖的样式，并通过 `filter: brightness(0.5);` 调整了背景的亮度，以确保内容的可读性。`z-index: -1;` 确保背景容器位于其他内容的下方。

最后，在博客的 `source/js` 目录下创建一个名为 `Background.js` 的 JavaScript 文件，代码如下：

```javascript
document
    .querySelector('#web_bg')
    .style.backgroundImage = `${document.querySelector('.banner').style.background.split(' ')[0]}`;

document
    .querySelector("#banner")
    .style.background = 'url()'

document
    .querySelector("#banner .mask")
    .style.backgroundColor = 'rgba(0,0,0,0)'

```

- 在上面的代码中，我们首先通过 `document.querySelector('#web_bg')` 选择了我们在注入器中添加的全屏背景容器 `web_bg`，并将其背景图片设置为当前文章页的 `banner` 背景图片。这样，无论文章页的 `banner` 背景图片如何变化，全屏背景都会与之保持一致。
- 接着，我们将 `banner` 的背景图片清空，并将其遮罩层的背景颜色设置为透明，以确保全屏背景能够完整显示。

在实现了上述代码后，我们需要确保它在页面加载时被执行。为此，我们需要在博客的 `_config.fluid.yml` 文件中添加以下配置：

```yaml
custom_js:
  - /js/Background.js # 全屏背景
custom_css:
  - /css/Background.css # 全屏背景样式
```

需要注意的是，如果在此前的随机背景美化中已经添加了 `RandomBanner.js`，则在 `_config.fluid.yml` 中的 `custom_js` 配置项中需要注意顺序，确保 `Background.js` 在 `RandomBanner.js` 之后加载，以便全屏背景能够正确获取到更新后的 `banner` 背景图片。

<a href="/_posts/Fluid随机背景/" name="/_posts/Fluid随机背景/image.webp" class="LinkCard">Fluid主题随机背景美化</a>

最后的最后，将打开/关闭全屏背景的代码添加到此前自定义的右键菜单中即可。具体方法已更新至往期文章。

<a href="/_posts/Fluid自定义右键菜单/" name="/_posts/Fluid自定义右键菜单/image.webp" class="LinkCard">Fluid自定义右键菜单</a>

# 总结

通过以上步骤，我们成功为 Fluid 主题实现了全屏背景的功能。无论是在文章页还是其他页面，全屏背景都能与当前的 `banner` 背景图片保持一致，提升了博客的视觉效果和用户体验。
