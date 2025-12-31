---
title: Hexo博客添加旅行足迹地图
category_bar: true
date: 2025-08-25 00:42:48
tags:
    - Hexo
    - Fluid
categories:
    - Hexo Blog Building
excerpt: 在Hexo博客中添加一个旅行足迹地图，摊开那些被脚步丈量过的时光。
index_img: /_posts/Hexo博客添加旅行足迹地图/image.webp
---

# 前言

旧年的光阴里，总有些脚步轻轻落在了别处的晨昏里，在某次旅途中，我萌生了一个想法：将这些足迹记录下来，形成一张属于自己的旅行地图。对此，在我自己的 Hexo 博客中添加一张旅行足迹地图再合适不过了。为了实现这一功能，我浏览了许多大佬的博客，也查询了许多资料，最终决定使用 ECharts 来实现这张地图。鉴于我在冲浪过程并没有找到一个针对 Hexo 博客的现成解决方案，因此我决定将我的实现过程记录下来，供后来的朋友们参考。

<a href="https://echarts.apache.org/zh/index.html" logourl="https://echarts.apache.org/zh/images/favicon.png?_v_=20240226" class="LinkCard">ECharts 官网首页</a>

# 实现

由于目前我的活动范围基本局限于国内，我决定选用中国地图来展示我的足迹，因此后续的实现也将基于中国地图进行。对于世界地图的实现也基本类似，相信大家可以参考本文自行实现。

## 准备工作

在开始之前，我们需要做一些准备工作。首先，我们需要在博客中引入 ECharts 库，由于我决定将足迹地图展示在“关于”页面，因此我在该页面引入了 Apache ECharts，具体来说，即在 `source/about/index.md` 文件中添加如下代码：

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/echarts/map/js/china.js"></script>
```

其中，我们通过 jsDelivr CDN 引入了 ECharts 的核心库和中国地图的配置文件。但要注意，ECharts 之前提供下载的矢量地图数据来自第三方，由于部分数据不符合国家《测绘法》规定，因此官网暂时停止了下载服务，从 CDN 引入的地图数据可能会存在一定的风险。如果希望使用其他国家或地区的地图，可以以相同的方式导入，这里就不赘述了。

## 创建地图容器

同样的，我们需要在 `source/about/index.md` 文件中创建一个用于展示地图的容器，并引入我们接下来要实现的 JavaScript 脚本，代码如下：

```html
<div id="footprint" style="width: 100%; max-width: 100%; height: 450px;"></div>
<script type="text/javascript" src="/js/Footprint.js"></script>
```

## 实现地图脚本

接下来，我们需要在 `source/js/Footprint.js` 文件中实现地图的具体逻辑，代码如下：

```javascript
var footprintChart = echarts.init(document.getElementById('footprint'));

// 统计各省访问次数
function getProvinceCounts(data) {
    const counts = {};
    data.forEach(item => {
        if (counts[item.province]) {
            counts[item.province]++;
        } else {
            counts[item.province] = 1;
        }
    });
    return counts;
}

// 生成省份数据用于着色
function getProvinceData(counts) {
    const provinceList = [
        '北京', '天津', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江',
        '上海', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南',
        '湖北', '湖南', '广东', '广西', '海南', '重庆', '四川', '贵州',
        '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆',
        '香港', '澳门', '台湾', '南海诸岛'
    ];
    
    return provinceList.map(province => ({
        name: province,
        value: counts[province] || 0
    }));
}

// 从 JSON 文件加载数据
fetch('/json/footprint.json')
    .then(response => response.json())
    .then(pointData => {
        // 获取统计数据
        const provinceCounts = getProvinceCounts(pointData);
        const provinceData = getProvinceData(provinceCounts);
        const maxCount = Math.max(...Object.values(provinceCounts), 0);

        const option = {
            title: {
                show: false,
                text: '有野野芥的足迹',
                left: 'center',
                top: 15,
                textStyle: {
                    fontSize: 20,
                    color: '#171a24',
                    fontWeight: 'bold',
                    fontFamily: 'serif'
                }
            },
            tooltip: {
                trigger: 'item',
                borderColor: '#171a24',
                borderWidth: 1,
                formatter: function (params) {
                    var res = '';
                    // 城市点的tooltip
                    if (params.seriesType === 'effectScatter') {
                        res = `<div style="font-size: 16px">${params.name}</div>`;
                        if (params.data && params.data.description) {
                            res += `<div>${params.data.description}</div>`;
                        }
                    }
                    // 省份的tooltip
                    else if (params.seriesType === 'map') {
                        const count = provinceCounts[params.name] || 0;
                        res = `<div style="font-size: 16px">${params.name}</div>`;
                        if (count > 0) {
                            res += `<div>走过${count}座城</div>`;
                        }
                    }
                    return res;
                }
            },
            visualMap: {
                show: true,
                seriesIndex: 1, // 关联到省份数据系列
                min: 0,
                max: maxCount > 0 ? maxCount : 1, // 处理没有数据的情况
                inRange: {
                    color: ["#e6e6e6", "#a7d0ed", "#5ab7fb", "#409de1", "#398cc0", "#0e76c0"]
                },
                outOfRange: {
                    color: '#e6e6e6'
                },
                // text: ['走过城市', ''],
                left: '5%', // 距离左侧位置
                bottom: '5%', // 距离底部位置
                itemWidth: 20, // 标尺宽度
                itemHeight: 100, // 标尺高度
                calculable: true
            },
            geo: {
                map: 'china',
                zoom: 1.2,
                scaleLimit: {
                    min: 1,
                    max: 8
                },
                show: true,
                roam: true,
                emphasis: {
                    label: {
                        show: false,
                    },
                },
                itemStyle: {
                    normal: {
                        areaColor: '#e6e6e6', // 区域默认颜色
                        borderColor: '#171a24', // 边界颜色
                    },
                    emphasis: {
                        areaColor: '#f1b03f' // 选中区域颜色
                    }
                }
            },
            series: [
                {
                    name: '足迹',
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    data: pointData,
                    geoIndex: 0,
                    showEffectOn: 'render',
                    hoverAnimation: true,
                    symbolSize: 8, // 点的大小
                    itemStyle: {
                        normal: {
                            color: '#ffffff',
                            shadowBlur: 10,
                            // shadowColor: '#0055ff'
                        }
                    },
                },
                {
                    name: '省份访问次数',
                    type: 'map',
                    mapType: 'china',
                    data: provinceData,
                    geoIndex: 0,
                    showLegendSymbol: false, // 隐藏图例标记
                }
            ],
        };

        footprintChart.setOption(option);
    })
    .catch(error => {
        console.error('Error loading footprint data:', error);
    });

// 处理窗口大小变化时地图显示超出页面的问题
window.addEventListener('resize', function () {
    footprintChart.resize();
});

// 添加点击事件监听，当点击足迹点时若存在 url 条目则打开链接
footprintChart.on('click', function(params) {
    if (params.seriesType === 'effectScatter' && params.data && params.data.url) {
        window.open(params.data.url, '_blank'); // 在新窗口打开链接
    }
});

// 添加双击事件监听，恢复初始放大倍率和位置
footprintChart.getZr().on('dblclick', function() {
    footprintChart.setOption({
        geo: {
            zoom: 1.2, // 恢复初始放大倍率
            center: null // 恢复初始位置
        },
        visualMap: {
            range: null // 恢复初始选择范围
        }
    });
});
```

代码中的注释已经非常清晰了，这里挑重点再解释一二：

1. 我将旅行足迹的数据存放在了 `source/json/footprint.json` 文件中，数据格式见下文，其中 `name` 表示城市名称，`province` 表示省份名称，`value` 是一个包含经纬度的数组，这三者是必须存在的字段。
2. 在 `getProvinceData()` 函数中，`provinceList` 包含了所有省份的名称，这需要与此前引入的地图配置文件（即前面的[china.js](https://cdn.jsdelivr.net/npm/echarts/map/js/china.js)）中的省份名称一一对应。
3. 在成功加载数据后，我们会调用 `footprintChart.setOption(option)` 来渲染地图，其中 `option` 是我们为图表定义的配置项，包括标题 `title`、提示框 `tooltip`、视觉映射 `visualMap`（用于将一个省份中去过的城市数量映射成不同颜色）、地理坐标系 `geo` 和系列 `series` 等信息。注意地理坐标系中的 `map` 属性需要与引入的地图文件名一致。`series` 作为一个列表，其中两项分别对应足迹点和省份访问次数。
4. 为了解决窗口大小变化时地图显示超出页面的问题，我通过监听 `resize` 事件来调用 `footprintChart.resize()` 方法，确保地图能够自适应容器大小。
5. 为了提升用户体验，我还添加了一些交互功能，比如点击足迹点时打开对应的链接、双击地图时恢复初始位置、缩放比例和选择范围等。

## 创建足迹数据

正如前文所述，我将足迹数据存放在了 `source/json/footprint.json` 文件中，数据格式如下：

- `name` ：城市名称，字符串，必填
- `province` ：省份名称，字符串，必填
- `value` ：包含经纬度的数组，必填
- `description` ：描述，字符串，选填
- `url` ：相关链接，字符串，在有描述的基础上进一步选填
- `symbol` ：足迹点图标路径，字符串，选填
- `symbolSize` ：足迹点图标大小，数字，选填

举个例子：

```json
[
    {
        "name": "上海",
        "province": "上海",
        "value": [121.473701, 31.230416],
        "description": "饮水思源，爱国荣校。 —— 上海交通大学",
        "symbol": "image:// data:image/png;base64,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",
        "symbolSize": 15
    },
]
```

其中足迹点图标使用了 Base64 编码的 PNG 图片，具体内容可以根据需要进行替换。（注意需要加上 `image://` 前缀）

# 总结

通过以上步骤，我们成功地在 Hexo 博客中添加了一个旅行足迹地图，具体的显示效果见下方，你可以使用鼠标滚轮放大、左键拖拽以及双击回正。

<div id="footprint" style="width: 100%; max-width: 100%; height: 450px;"></div>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/echarts/map/js/china.js"></script>
<script type="text/javascript" src="/js/Footprint.js"></script>


我们步履所至，不再是你我独有的记忆，而是可以与世界分享的故事。摊开那些被脚步丈量过的时光，细数旧日里酸甜苦辣的回忆，这就是实现这个地图的意义所在！