---
title: Fluid随机背景
date: 2025-07-15 21:11:24
category_bar: true
tags:
  - Hexo
  - Fluid
categories:
  - Hexo Blog Building
excerpt: Fluid 主题美化记录4.0——无侵入实现Fluid文章页随机背景
index_img: /_posts/Fluid随机背景/image.webp
---

# 前言

本期美化同样贯彻了前几期美化的原则：**无侵入式美化**，即不修改主题的源代码，只通过修改配置文件、自定义样式以及Hexo注入器来实现美化。前几期的美化可以点击下方的链接卡片查看。

<a href="/tags/Fluid/" name="/img/avatar/avatar.webp" class="LinkCard">Fluid主题美化</a>

在本期中，我们将为Fluid主题的文章页添加一个随机背景功能，使每次访问文章时都能看到不同的背景图片。顺带一提，目前我使用的背景图都出自B站的UP主 [Lyasmind](https://space.bilibili.com/33716779) 哦！

# 实现

首先，在博客的 `source/js` 目录下创建一个名为 `RandomBanner.js` 的 JavaScript 文件，代码如下：

```javascript
const imgs = [
    // paths to your banner images
    "/img/banner/banner.webp",
    "/img/banner/banner1.webp",
]

const random_banner = imgs[Math.floor(Math.random() * imgs.length)];
const banner = document.getElementById('banner');
if (banner) {
    const metaOgType = document.querySelector('meta[property="og:type"]');
    console.log(" metaOgType.content: ", metaOgType ? metaOgType.content : "not found");
    if (metaOgType && metaOgType.content === "article") { //判断是否为文章页
        const background = banner.style.background;
        if (background.includes("banner/banner")) { // 特殊判断规则
            banner.style.background = `url(${random_banner}) center center / cover no-repeat`;
        }
    }
}
```

- 在上面的代码中，我们首先定义了一个包含所有背景图片路径的数组 `imgs`。当然如果你要随机的图片较多，也可以通过文件夹的方式来管理，只需要对后续的代码进行相应的调整即可。
- 接着，我们通过检查 `meta` 标签中的 `og:type` 属性来判断当前页面是否为文章页。这是由于博客会通过 `<head>` 中的 `og:type` 来区分页面类型，例如文章页的词条为：
    ```html
    <meta property="og:type" content="article">
    ```
    而其他页面则是
    ```html
    <meta property="og:type" content="website">
    ```
    你也可以通过浏览器的开发者工具来查看当前页面的 `meta` 标签。更进一步，你也可以通过其他方式制定相应规则，判断某个页面是否要进行随机背景的更换，如仅限首页或特定标签页等等。
- 然后，我们通过检查 `banner` 元素的背景样式来判断是否需要更换背景图片。在我的 `_config.fluid.yml` 设置中，文章页的默认 banner 路径是 `img/banner/banner.webp`，而在 front-matter 指定的背景图路径是文章对应文件夹，因此如果当前背景包含 `banner/banner` 这一字符串，则说明其使用了默认路径，可以将其替换为随机选择的背景图片。

在实现了上述代码后，我们需要确保它在页面加载时被执行。为此，我们需要在博客的 `_config.fluid.yml` 文件中添加以下配置：

```yaml
custom_js:
  - /js/RandomBanner.js # 文章页随机 Banner
```

# 总结

通过以上步骤，我们成功为 Fluid 主题的文章页实现了随机背景的功能。每次访问文章时，都可以看到不同的 Banner，从而提升了页面的视觉效果和用户体验。
