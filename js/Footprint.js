var myChart = echarts.init(document.getElementById('myMap'));

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
                    color: '#',
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
                text: ['走过城市', ''],
                left: 20,
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

        myChart.setOption(option);
    })
    .catch(error => {
        console.error('Error loading footprint data:', error);
    });

// 处理窗口大小变化
window.addEventListener('resize', function () {
    myChart.resize();
});
