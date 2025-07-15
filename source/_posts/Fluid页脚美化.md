---
title: Fluid页脚美化
category_bar: true
tags:
  - Hexo
  - Fluid
categories:
  - Hexo Blog Building
excerpt: Fluid 主题美化记录2.0——无侵入式页脚美化
index_img: /posts/Fluid页脚美化/image.webp
date: 2025-06-29 01:47:43
---

# 前言

本期美化同样贯彻了上期美化的原则：**无侵入式美化**，即不修改主题的源代码，只通过修改配置文件、自定义样式以及Hexo注入器来实现美化。上一期的美化包括以下内容，可以点击下方的链接卡片查看。

{% note secondary %}
- 黑暗模式下修改加粗字体和斜体样式
- 博客标题霓虹灯效样式
- 标题颜色渐变样式
- 修改滚动条样式
- 使用 Mac 风格代码块样式
- 修改行内代码样式
- 文章界面背景毛玻璃样式
- 链接卡片样式
- 统一文章图片宽度
- 首页文章滑入动效
- 首页文章图片悬浮鼠标悬停动效
- 彩虹加载动效
- 背景动态线条动效
- 标签页根据焦点切换显示
{% endnote %}

<a href="/posts/Fluid主题美化1-0/" name="/img/avatar/avatar.webp" class="LinkCard">Fluid主题美化1.0</a>

# 关于页添加 Github 热力图

这个功能的实现比较简单，可以直接调用Github Chart API来实现。项目地址见下方。

<a href="https://github.com/2016rshah/githubchart-api" name="https://avatars.githubusercontent.com/u/6821244?v=4" class="LinkCard">Github Chart API</a>

只需要在 `source/about/index.md` 文件中添加一行代码即可在关于页添加Github热力图：   

```html
<img src="https://ghchart.rshah.org/0d6aae/用户名" alt="图表名" />
```

其中 `用户名` 替换为你的GitHub用户名，`图表名` 替换为你想要的图表名称（可以是任意字符串），`0d6aae` 替换为你想要的颜色代码（可以在[这里](https://www.w3schools.com/colors/colors_picker.asp)选择颜色），如果使用默认颜色则可以省略。

# 文章页添加 Giscus 评论区

Fluid主题多种评论区的支持，我选择了其中基于GitHub Discussion的评论系统的Giscus插件，

<a href="https://giscus.app/" name="https://avatars.githubusercontent.com/in/106117" class="LinkCard">Giscus</a>

具体配置步骤如下：

1. 首先需要确保博客的仓库是公开的，且安装了[Giscus的App](https://github.com/apps/giscus)。
2. 然后你需要在仓库中[启用GitHub Discussions功能](https://docs.github.com/zh/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/enabling-or-disabling-github-discussions-for-a-repository)。
3. 接着你需要在[Giscus的配置页面](https://giscus.app/)中获取相关参数。
    - **注意**：`repo` 字段需要填写你的GitHub仓库地址，格式为 `用户名/仓库名`，而不包含域名部分。
4. 此外你还需要在 `_config.fluid.yml` 文件中开启文章页的评论区服务，并选择Giscus；然后再在下方的 `giscus` 配置中填写上一步获取到的相关参数。

```yaml
post:
  comments:
    enable: true
    type: giscus

# Giscus
giscus:
  repo: [用户名/仓库名]
  repo-id: [仓库ID]
  category: [分类名]
  category-id: [分类ID]
  theme-light: light
  theme-dark: dark
  mapping: pathname
  reactions-enabled: 1
  emit-metadata: 0
  input-position: top
  lang: zh-CN
```

# 页脚处添加网站运行时间

这个功能比较常见，能在许多博客都搜索到相关的教程，这里我参考官方博客Hexo Theme Fluid的实现方式，并进行了一定修改。

<a href="https://hexo.fluid-dev.com/posts/fluid-footer-custom/" name="https://hexo.fluid-dev.com/img/avatar.png" class="LinkCard">Fluid 页脚增加网站运行时长</a>

首先在 `source/js/` 目录下新建一个 `Duration.js` 文件（如果不存在该目录则需要先创建），代码如下：

```javascript
!(function() {
  /** 计时起始时间，自行修改 **/
  var start = new Date("2025/06/19 23:36:01");

  function update() {
    var now = new Date();
    now.setTime(now.getTime()+250);
    days = (now - start) / 1000 / 60 / 60 / 24;
    dnum = Math.floor(days);
    hours = (now - start) / 1000 / 60 / 60 - (24 * dnum);
    hnum = Math.floor(hours);
    if(String(hnum).length === 1 ){
      hnum = "0" + hnum;
    }
    minutes = (now - start) / 1000 /60 - (24 * 60 * dnum) - (60 * hnum);
    mnum = Math.floor(minutes);
    if(String(mnum).length === 1 ){
      mnum = "0" + mnum;
    }
    seconds = (now - start) / 1000 - (24 * 60 * 60 * dnum) - (60 * 60 * hnum) - (60 * mnum);
    snum = Math.round(seconds);
    if(String(snum).length === 1 ){
      snum = "0" + snum;
    }
    document.getElementById("timeDate").innerHTML = "须弥藏芥 已逾&nbsp"+dnum+"&nbsp日";
    document.getElementById("times").innerHTML = hnum + "&nbsp时&nbsp" + mnum + "&nbsp分&nbsp"+ snum + "&nbsp秒";
  }

  update();
  setInterval(update, 1000); 
})();
```

脚本中 `start` 变量的值需要修改为你博客的创建时间，如果是部署在GitHub Pages上的博客，可以在仓库的提交记录中找到创建时间。

在这之后，你还需要修改 `_config.fluid.yml` 文件，在 `footer` 的 `content` 中添加以下内容：

```yaml
footer:
  content: '
    <div style="font-size: 0.85rem">
      <span id="timeDate">Getting date...</span>
      <span id="times">Getting time...</span>
      <script src="/js/Duration.js"></script>
    </div>
  '
```

当然，由于我还在页脚处做了其他的美化，因此 `content` 的内容与此处展示的并不相同，你可以根据自己的需要进行调整，也可以跳转至[总结](#总结)部分查看我的完整配置。

# 页脚处添加全站字数统计

在Fluid主题中，内置了hexo-wordcount插件，可以通过配置 `_config.fluid.yml` 在文章的副标题下方显示该文章的字数统计。因此，要实现全站字数统计，我们只需要在页脚处添加一个显示全站字数的元素，这同样可以通过修改 `_config.fluid.yml` 文件中 `footer` 的 `content` 字段以及Hexo注入器来实现。这部分实现参考了呈呈的小站。

<a href="https://blog.fengcl.com/2022/08/21/fluid-theme/#%E5%85%A8%E7%AB%99%E5%AD%97%E6%95%B0%E7%BB%9F%E8%AE%A1" name="https://blog.fengcl.com/uploads/ef1d0cfcf9284c00f4afb7a7d38dc6c0.png" class="LinkCard">切换到fluid主题的记录</a>

修改 `_config.fluid.yml` 文件如下：

```yaml
footer:
  content: '
    # 原有内容，下面是新加的
    <div style="font-size: 0.85rem">
      <span id="g-total-word-id">Getting word count...</span>
    </div>
  '
```

然后需要在 `source/_inject/` 目录下新建一个 `WordCount.ejs` 文件（如果不存在该目录则需要先创建）来调用hexo-wordcount插件的 `wordtotal` 函数获取全站字数统计，一定要注意路径正确，否则在生成页面时很大概率不会报错：

```html
<script type="text/javascript">
  document.getElementById("g-total-word-id").innerHTML = "全站总字数 <%= wordtotal(site) %>";
</script>
```

接下来在 `scripts` 目录下新建一个 `injector.js` 文件（如果不存在该目录则需要先创建，也可以复用之前的注入器代码），代码如下：

```javascript
// 全站字数统计
hexo.extend.filter.register('theme_inject', function(injects) {
  injects.bodyEnd.file('WordCount', 'source/_inject/WordCount.ejs');
});
```

这样就可以在页脚处显示全站字数统计。

# 页脚处添加全站文章统计

Fluid主题内置了对全站文章统计的支持，但只在归档页显示。由于我并不了解ejs语法，也不愿意修改主题的源代码，因此决定自行实现。

在 `source/js/` 目录下新建一个 `TotalPosts.js` 文件（如果不存在该目录则需要先创建），代码如下：

{% fold info @为了兼容Fluid自定义右键菜单中的其他功能，此方式已弃用，改为下面的实现方式。 %}
```javascript
fetch('/local-search.xml')
.then(response => response.text())
.then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
.then(data => {
    const posts = data.querySelectorAll('entry');
    document.getElementById('g-total-posts-id').textContent = posts.length;
})
```
{% endfold %}

```javascript
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
        document.getElementById('g-total-posts-id').textContent = posts.length;
    })
    .catch(error => console.error('Error fetching sitemap:', error));
} else {
    document.getElementById('g-total-posts-id').textContent = posts.length;
}
```

然后在 `_config.fluid.yml` 文件中修改 `footer` 的 `content` 字段，添加全站文章统计的调用代码：

```yaml
footer:
  content: '
    <div class="total-posts" style="font-size: 0.85rem; margin: 0.15rem 0.15rem;">
      <i class="fas fa-file-alt"></i>
      <span id="g-total-posts-id">Getting total posts...</span>
      <script src="/js/TotalPosts.js"></script>
    </div>
  '
```

这样就可以在页脚处显示全站文章统计了。

# 页脚处添加一言

一言是一个提供一句话服务的网站，Fluid主题内置了对一言的支持，但只能在首页作为副标题显示。而我希望保留首页的副标题，因此决定将一言添加到页脚处。具体的调用可以参考一言开发者中心的文档。

<a href="https://developer.hitokoto.cn/sentence/" name="https://developer.hitokoto.cn/logo.png" class="LinkCard">一言开发者中心</a>

首先在 `source/js/` 目录下新建一个 `Hitokoto.js` 文件（如果不存在该目录则需要先创建），代码如下：

```javascript
async function fetchSlogan() {
    try {
        const res = await fetch('https://v1.hitokoto.cn/?c=i');
        const data = await res.json();
        const hitokotoElem = document.getElementById('hitokoto');
        if (hitokotoElem) {
            hitokotoElem.innerText = `${data.hitokoto}  —— ${data.from_who || ''}《${data.from}》`;
        }
    } catch (err) {
        console.error(err);
    }
}

fetchSlogan();
```

其中请求的参数 `c=i` 表示获取诗词，你可以根据自己的喜好，参考[一言开发者中心](https://developer.hitokoto.cn/sentence/#%E5%8F%A5%E5%AD%90%E7%B1%BB%E5%9E%8B-%E5%8F%82%E6%95%B0)修改为其他类型的内容。


然后在 `_config.fluid.yml` 文件中修改 `footer` 的 `content` 字段，添加一言的调用代码：

```yaml
footer:
  content: '
    <div class="hitokoto" style="font-size: 0.85rem; margin: 0.15rem 0.15rem;">
      <i class="fas fa-quote-left"></i>
      <a href="https://developer.hitokoto.cn/" id="hitokoto_text"><span id="hitokoto">Getting poem...</span></a>
      <script src="/js/Hitokoto.js" defer></script>
    </div>
  '
```

正如一言官网所说：“动漫也好、小说也好、网络也好，不论在哪里，我们总会看到有那么一两个句子能穿透你的心。我们把这些句子汇聚起来，形成一言网络，以传递更多的感动。如果可以，我们希望我们没有停止服务的那一天。”

或许眼前触动你的句子，在某刻也曾击穿他人的心灵。

# 页脚信息添加图标

忘记在哪个博客看到博主为页脚的信息添加了图标，因此这次也对这里进行了美化。由于上一期美化中已经引入了 Font Awesome 图标库，因此只需要在相应的位置添加图标的 HTML 代码即可。

为了添加图标，我们还需要知道图标和其对应的类名。可以在[Font Awesome官网](https://fontawesome.com/icons)上根据版本搜索你想要的图标，并获取其类名。

例如我选用了以下图标：

| 图标预览 | 类名 | 用途说明 |
| :---: | :---: | :---: |
| <i class="fas fa-quote-left"></i> | `fas fa-quote-left` | 一言 |
| <i class="fas fa-chart-bar"></i> | `fas fa-chart-bar` | 全站字数统计 |
| <i class="fas fa-file-alt"></i> | `fas fa-file-alt` | 全站文章统计 |
| <i class="fas fa-eye"></i> | `fas fa-eye` | 总访问量 |
| <i class="fas fa-user-friends"></i> | `fas fa-user-friends` | 总访客数 |
| <i class="fas fa-calendar"></i> | `fas fa-calendar` | 网站运行时间 |

# 总结
{% fold info @如果对当前的样式已经满意，那么主题配置中的代码如折叠中所示。 %}
至此，本次的美化就全部完成了！

最终，`_config.fluid.yml` 文件的 `footer` 的 `content` 和 `statistics` 部分如下所示：

```yaml
footer:
  content: '
    <div class="powered-by">
      <a href="https://hexo.io" target="_blank" rel="nofollow noopener"><span>Hexo</span></a>
      <i class="iconfont icon-love"></i>
      <a href="https://github.com/fluid-dev/hexo-theme-fluid" target="_blank" rel="nofollow noopener"><span>Fluid</span></a>
    </div>
    <div class="info" style="font-size: 0.85rem; margin: 0.15rem 0.15rem;">
      <span id="duration" style="display: inline;">
        <i class="fas fa-calendar"></i>
        <span id="timeDate">Getting date...</span>
        <span id="times">Getting time...</span>
        <script src="/js/Duration.js"></script>
      </span>
      <span id="wordcount" style="display: inline;">
        <i class="fas fa-file-alt"></i>
        <span id="g-post-count-id">Getting word count...</span>
      </span>
    </div>
    <div class="hitokoto" style="font-size: 0.85rem; margin: 0.15rem 0.15rem;">
      <i class="fas fa-quote-left"></i>
      <a href="https://developer.hitokoto.cn/" id="hitokoto_text"><span id="hitokoto">Getting poem...</span></a>
      <script src="/js/Hitokoto.js" defer></script>
    </div>
    '

  statistics:
    enable: true
    source: "busuanzi"
    pv_format: '<i class="fas fa-shoe-prints"></i>  总访问量 {} 次'  # 显示的文本，{}是数字的占位符（必须包含)，下同
    uv_format: '<i class="fas fa-user-friends"></i>  总访客数 {} 人'
```

其中，`content` 部分的第一个 `<div>` 是本博客的框架与主题信息，第二个 `<div>` 是网站运行时间和全站字数统计，第三个 `<div>` 是一言，后两者手动指定了样式。`statistics` 部分是网站的访问量和访客数统计。
{% endfold %}

但是很可惜，我希望把全站字数统计、文章统计和总访问量、总访客数统计在一行内显示，因此不得不继续折腾。

首先把 `_config.fluid.yml` 文件的 `footer` 的 `content` 置空，`statistics` 部分的 `enable` 设置为 `false`，即

```yaml
footer:
  content: ''
  statistics:
    enable: false
```

接着在 `source/html/` 目录下新建一个 `Footer.html` 文件（如果不存在该目录则需要先创建），并添加以下内容：

```html
<div class="footer-inner">
    <div class="powered-by">
        <a href="https://hexo.io" target="_blank" rel="nofollow noopener"><span>Hexo</span></a>
        <i class="iconfont icon-love"></i>
        <a href="https://github.com/fluid-dev/hexo-theme-fluid" target="_blank" rel="nofollow noopener"><span>Fluid</span></a>
    </div>
    <div class="hitokoto">
        <i class="fas fa-quote-left"></i>
        <a href="https://developer.hitokoto.cn/" id="hitokoto_text"><span id="hitokoto">Getting poem...</span></a>
        <script src="/js/Hitokoto.js" defer></script>
    </div>
    <div class="data">
        <span class="total-word-container">
            <i class="fas fa-chart-bar"></i>
            <span id="g-total-word-id"></span>
            字汇长河
        </span>
        &nbsp;
        <span id="total-posts-container">
            <i class="fas fa-file-alt"></i>
            <span id="g-total-posts-id"></span>
            <script src="/js/TotalPosts.js"></script>
            文舟靠岸
        </span>
        &nbsp;
        <span id="busuanzi_container_site_pv">
            <i class="fas fa-eye"></i>
            <span id="busuanzi_value_site_pv"></span>
            目光所及
        </span>
        &nbsp;
        <span id="busuanzi_container_site_uv">
            <i class="fas fa-user-friends"></i>
            <span id="busuanzi_value_site_uv"></span>
            访客驻足
        </span>
        <script src="https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js" defer></script>
    </div>
    <div class="duration">
        <i class="fas fa-calendar"></i>
        <span id="timeDate">Getting date...</span>
        <span id="times">Getting time...</span>
        <script src="/js/Duration.js"></script>
    </div>
</div>

<link href="/css/Footer.css" type="text/css" rel="stylesheet"/>
```

其中，我将页脚分为四行显示：

- `powered-by` 是本博客的框架与主题信息；
- `hitokoto` 是一言；
- `data` 是全站字数统计、文章统计、总访问量和总访客数统计；
- `duration` 是网站运行时间。

然后需要用Hexo注入器将这个文件注入到页脚中。在 `scripts/injector.js` 文件中添加如下内容：

```javascript
hexo.extend.filter.register('theme_inject', function(injects) {
  // 注入页脚
  injects.footer.file('footer', 'source/html/Footer.html');
  // 全站字数统计
  injects.bodyEnd.file('WordCount', 'source/_inject/WordCount.ejs');
});
```

接着修改 `source/_inject/WordCount.ejs` 文件，让其只返回字数统计的部分：

```html
<script type="text/javascript">
  document.getElementById("g-total-word-id").innerHTML = "<%= wordtotal(site) %>";
</script>
```

最后在 `source/css/` 目录下新建一个 `Footer.css` 文件（如果不存在该目录则需要先创建），覆盖原先的页脚样式，代码如下：

```css
.footer-inner {
    padding: 1rem 0 2rem 0;
    font-family: serif !important;
    font-size: 0.85rem !important;
    margin: 0.15rem 0.15rem !important;
}
.powered-by {
    font-size: 1rem !important;
}
span#busuanzi_container_site_pv,
span#busuanzi_container_site_uv,
span#busuanzi_container_page_pv {
    display: inline !important;
}
```

这样就完成了页脚的美化，最终的效果甚得我心！