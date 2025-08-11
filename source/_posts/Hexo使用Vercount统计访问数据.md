---
title: Hexo使用Vercount统计访问数据
tags:
  - Hexo
  - Fluid
categories:
  - Hexo Blog Building
excerpt: 使用Vercount代替Busuanzi统计Hexo博客访问数据，提供更稳定准确的访问统计信息。
category_bar: true
index_img: /_posts/Hexo使用Vercount统计访问数据/image.webp
date: 2025-07-20 12:19:01
---

# 前言

在我使用的 fluid 主题中，支持 Busuanzi、Leancloud 和 Umami 三种访问统计方式的配置，其中后两者需要额外的配置和部署，比较麻烦，因此我起初选用了 Busuanzi 用以统计访问数据。然而，Busuanzi 在访问量较大时会出现数据不准确的情况，加之前些天服务不稳定，于是我便决定更换为 Vercount 进行访问统计。

<a href="https://vercount.one" name=./image.webp class="LinkCard">Vercount官网</a>

Vercount 初始化自动同步所有不蒜子的数据，兼容不蒜子的 span 标签，理论上可以无痛切换；且使用 POST 请求进行统计，页面浏览量每访问一次加一，独立访客量通过用户的 UserAgent 和 IP 地址判断，因此数据更加准确。而在我更换到 Vercount 后，Vercount 又新增了自定义访客数据的功能，因此我决定写一篇文章来记录一下切换到 Vercount 的过程以及如何使用它来统计访问数据。

# 配置
## 替换脚本

如果只是希望简单的统计数据，那么只需要用 Vercount 的脚本替换掉 Busuanzi 的脚本即可。如果你没有对 fluid 主题进行过修改，那么只需要在主题的 `_config.fluid.yml` 文件底部找到 Busuanzi 相关的配置项并进行替换。

```diff
- busuanzi: https://busuanzi.ibruce.info/busuanzi/2.3/
+ busuanzi: https://events.vercount.one/js?i=
```

如果你像我一样自定义了页脚内容，那么只需要将页脚注入中 Busuanzi 的相关代码替换为 Vercount 的代码即可。

```diff
- <script defer src="https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script>
+ <script defer src="https://events.vercount.one/js"></script>
```

<a href="/_posts/fluid页脚美化" name="/img/avatar/avatar.webp" class="LinkCard">fluid页脚美化</a>

由于 Vercount 兼容 `vercount_value_` 和 `busuanzi_value_` 的 span 标签，因此无需修改 HTML 模板中的相关标签。

## 自定义访客数据

如果你希望更进一步，自定义访客数据，或者和我一样由于在 Busuanzi 服务瘫痪时切换到 Vercount，未能成功同步原有的数据，那么你可以参考下面的步骤来进行配置。

首先，你需要在 [Vercount仪表盘](https://www.vercount.one/dashboard) 中关联你的站点。如果你和我一样，使用 Github Pages 站点托管服务，那么可以选择第二种认证方式——"File Upload"，在站点根目录下创建一个验证文件。为了避免每次部署都需要手动上传验证文件，你可以在 `scripts/` 目录下创建一个脚本，自动上传验证文件。

```javascript
const fs = require('fs');
const path = require('path');

const content = '<your-vercount-verify-content>'; // 替换为你的 Vercount 验证码
const filePath1 = path.join(__dirname, '../.deploy_git/.well-known/<your-vercount-verify-filename>'); // 替换为你的 Vercount 验证文件名
const filePath2 = path.join(__dirname, '../.deploy_git/.nojekyll');

fs.mkdirSync(path.dirname(filePath1), { recursive: true });
fs.writeFileSync(filePath1, content);

fs.writeFileSync(filePath2, '');
```

其中

- \<your-vercount-verify-content\> 形如 `vercount-domain-verify=<your-domain>,<verify-code>`
- \<your-vercount-verify-filename\> 形如 `vercount-verify-<something else>.txt`。

你可以在 Vercount 仪表盘中找到相应的验证信息。

由于 Github Pages 默认启用了 Jekyll，屏蔽了以 `.` 开头的目录和文件，因此需要在站点根目录下创建一个 `.nojekyll` 文件来禁用 Jekyll 的处理，脚本中也已经实现。

## Vercount 与 Busuanzi 的数据对比

<table style="text-align: center; width: 100%;">
    <thead>
        <tr>
            <th scope="col" style="width: 16%;">&nbsp;<i class="fa-solid fa-cloud"></i> Service </th>
            <th scope="col" style="width: 16%;">&nbsp;<i class="fa-solid fa-eye"></i> Site PV &nbsp;</th>
            <th scope="col" style="width: 16%;">&nbsp;<i class="fas fa-user-friends"></i> Site UV &nbsp;</th>
            <th scope="col" style="width: 16%;">&nbsp;<i class="fa-solid fa-file-lines"></i> Page PV &nbsp;</th>
            <th scope="col" style="width: 36%;"><i class="fa-solid fa-clock"></i> Update Time</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong><a href="https://vercount.one" target="_blank">Vercount</a></strong></td>
            <td><em><span id="show_vercount_value_site_pv">loading</span></em></td>
            <td><em><span id="show_vercount_value_site_uv">loading</span></em></td>
            <td><em><span id="show_vercount_value_page_pv">loading</span></em></td>
            <td><em><span id="show_vercount_time">loading</span></em></td>
        </tr>
        <tr>
            <td><strong><a href="https://busuanzi.ibruce.info" target="_blank">Busuanzi</a></strong></td>
            <td><em><span id="show_busuanzi_value_site_pv">loading</span></em></td>
            <td><em><span id="show_busuanzi_value_site_uv">loading</span></em></td>
            <td><em><span id="show_busuanzi_value_page_pv">loading</span></em></td>
            <td><em><span id="show_busuanzi_time">loading</span></em></td>
        </tr>
    </tbody>
</table>

<script defer src="/js/BusuanziAndVercount.js"></script>

{% fold info @数据问题已修复，见评论区 %}
前文提到，Vercount 每次调用都会自动同步 Busuanzi 的数据，但只会返回 Vercount 自身的数据，因此要想获取到 Busuanzi 的数据，还需要自行调用 Busuanzi 的 API。因此，每次访问一个页面，Busuanzi 的数据会自增二，从而造成一定误差。
{% endfold %}

# 总结

Vercount 提供了一个简单易用的访问统计服务，兼容 Busuanzi 的数据格式，支持自定义访客数据，并且使用 POST 请求进行统计，数据更加准确。通过简单的配置和脚本，你可以轻松地将 Hexo 博客的访问统计从 Busuanzi 切换到 Vercount。