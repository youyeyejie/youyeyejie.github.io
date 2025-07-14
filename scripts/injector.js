// 注入bing和google验证代码
hexo.extend.injector.register('head_begin', '<meta name="msvalidate.01" content="DF9F232801BA9D0CABB002E4774A3228" />\n', 'default');
hexo.extend.injector.register('head_begin', '<meta name="google-site-verification" content="vOm5Zs9tuUlEh-wVBlpvs_spnOou-q2CoTiFQ1ZV1h4" />\n', 'default');

hexo.extend.filter.register('theme_inject', function(injects) {
  // 注入彩虹加载动画
  injects.bodyBegin.file('loader', 'source/html/RainbowLoading.html');
  // 右键菜单
  injects.bodyBegin.file('default', "source/html/RightMenu.html");
  // 全站字数统计
  injects.bodyEnd.file('WordCount', 'source/_inject/WordCount.ejs');
  // 注入页脚
  injects.footer.file('footer', 'source/html/Footer.html');
});