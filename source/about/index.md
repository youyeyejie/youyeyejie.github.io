---
title: about
date: 2025-06-19 17:49:22
type: "about"
layout: "about"
---

## About Me

```bash
YYYJ@youyeyejie: ~$ cd Blog
YYYJ@youyeyejie: ~/Blog$ cat AboutMe.md

Hi, here is
██╗   ██╗ ██████╗ ██╗   ██╗██╗   ██╗███████╗██╗   ██╗███████╗     ██╗██╗███████╗
╚██╗ ██╔╝██╔═══██╗██║   ██║╚██╗ ██╔╝██╔════╝╚██╗ ██╔╝██╔════╝     ██║██║██╔════╝
 ╚████╔╝ ██║   ██║██║   ██║ ╚████╔╝ █████╗   ╚████╔╝ █████╗       ██║██║█████╗  
  ╚██╔╝  ██║   ██║██║   ██║  ╚██╔╝  ██╔══╝    ╚██╔╝  ██╔══╝  ██   ██║██║██╔══╝  
   ██║   ╚██████╔╝╚██████╔╝   ██║   ███████╗   ██║   ███████╗╚█████╔╝██║███████╗
   ╚═╝    ╚═════╝  ╚═════╝    ╚═╝   ╚══════╝   ╚═╝   ╚══════╝ ╚════╝ ╚═╝╚══════╝

- Shanghai Jiao Tong University
- School of Computer Science
- Major in Information Security
- Welcome to my blog！
```

<script>
const codeContainers = document.querySelectorAll('.line');
const targetFonts = '"Courier New", Consolas, "Fira Code", "Fira Mono", Menlo, "DejaVu Sans Mono", monospace, 宋体';
codeContainers.forEach(container => {
  container.style.fontFamily = targetFonts;
  container.querySelectorAll('*').forEach(child => {
    child.style.fontFamily = targetFonts;
  });
});
</script>

## Github Contributions
<img src="https://ghchart.rshah.org/0d6aae/youyeyejie" style="width: 100%; max-width: 100%"/>

## Travel Footprint
<div id="footprint" style="width: 100%; max-width: 100%; height: 450px;"></div>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/echarts/map/js/china.js"></script>
<script type="text/javascript" src="/js/Footprint.js"></script>