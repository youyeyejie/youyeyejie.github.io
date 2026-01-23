// 注入bing和google验证代码
hexo.extend.injector.register(
    "head_begin",
    '<meta name="msvalidate.01" content="DF9F232801BA9D0CABB002E4774A3228"/>',
    "default",
);
hexo.extend.injector.register(
    "head_begin",
    '<meta name="google-site-verification" content="vOm5Zs9tuUlEh-wVBlpvs_spnOou-q2CoTiFQ1ZV1h4"/>',
    "default",
);
// 注入umami统计代码
hexo.extend.injector.register(
    "head_begin",
    '<script defer src="https://cloud.umami.is/script.js" data-website-id="0369421f-4354-4d7b-99c7-ae077c591b4f"></script>',
    "default",
);
// 注入全屏背景
hexo.extend.injector.register(
    "body_begin", 
    `<div id="web_bg"></div>`,
    "default",
);
// 注入提示气泡
hexo.extend.injector.register(
    "body_begin",
    `<div id="tooltip" class="tooltip"></div>`,
    "default",
);
// 注入侧边栏样式和脚本（仅首页）
hexo.extend.injector.register(
    "head_end",
    "<link rel='stylesheet' href='/css/Sidebar.css'/>",
    "home",
);
hexo.extend.injector.register(
    "head_end",
    "<script src='/js/Sidebar.js'></script>",
    "home",
);

// 主题自定义注入
hexo.extend.filter.register("theme_inject", function (injects) {
    // 注入彩虹加载动画
    injects.bodyBegin.file("loader", "source/html/RainbowLoading.html");
    // 右键菜单
    injects.bodyBegin.file("rightmenu", "source/html/RightMenu.html");
    // 全站字数及文章统计
    injects.bodyEnd.file("footerData", "source/_inject/FooterData.ejs");
    // 注入页脚
    injects.footer.file("footer", "source/html/Footer.html");
});
