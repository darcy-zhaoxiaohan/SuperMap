import React from 'react';
import { Card, Typography, Alert } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { MapVLayer } from '@supermap/iclient-classic';
import { utilCityCenter, DataSet } from 'mapv';


var map, baseLayer, mapvLayer, layer,
    // 地图背景
    // url = "http://support.supermap.com.cn:8090/iserver/services/map-world/rest/maps/World";
    url = "http://support.supermap.com.cn:8090/iserver/services/map-china400/rest/maps/China_4326";



export default class SuperMaps extends React.Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.init();
    }

    // 2,中国地图
    init = () => {
        // 初始化地图,第一个参数"map"是元素id
        map = new SuperMap.Map("map", {
            // 初始化时添加控件
            controls: [
                new SuperMap.Control.Attribution(),//
                new SuperMap.Control.ScaleLine(),//比例尺控件
                new SuperMap.Control.Zoom(),//
                new SuperMap.Control.Navigation({//地图浏览控件，监听鼠标点击、平移、滚轮等事件来实现对地图的浏览操作
                    dragPanOptions: {
                        enableKinetic: true
                    }
                })]
        });
        // 初始化图层
        baseLayer = new SuperMap.Layer.TiledDynamicRESTLayer("China", url, {
            transparent: true,
            cacheEnabled: true
        }, { maxResolution: "auto" });
        // 监听图层信息加载完成事件
        baseLayer.events.on({ "layerInitialized": this.addLayer });
    }

    addLayer = () => {
        // 异步加载图层
        map.addLayers([baseLayer]);
        // 显示地图范围
        map.setCenter(new SuperMap.LonLat(104, 34.7), 2);
        this.createMapVLayer();
    }

    createMapVLayer = () => {
        // 取点数量
        var randomCount = 1000;

        var data = [];

        var citys = ["北京", "天津", "上海", "重庆", "石家庄", "太原", "呼和浩特", "哈尔滨", "长春", "沈阳", "济南",
            "南京", "合肥", "杭州", "南昌", "福州", "郑州", "武汉", "长沙", "广州", "南宁", "西安", "银川", "兰州",
            "西宁", "乌鲁木齐", "成都", "贵阳", "昆明", "拉萨", "海口"];

        while (randomCount--) {
            var cityCenter = utilCityCenter.getCenterByCityName(citys[parseInt(Math.random() * citys.length)]);
            data.push({
                geometry: {
                    type: 'Point',
                    coordinates: [cityCenter.lng - 2 + Math.random() * 4, cityCenter.lat - 2 + Math.random() * 4]
                },
                count: 30 * Math.random()
            });
        }
        var dataSet = new DataSet(data);

        var options = {
            fillStyle: 'rgba(55, 50, 250, 0.8)',
            shadowColor: 'rgba(255, 250, 50, 1)',
            shadowBlur: 20,
            max: 100,
            size: 30,
            label: {
                show: true,
                fillStyle: 'white'
            },
            globalAlpha: 0.5,
            gradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)" },
            draw: 'honeycomb'
        };

        mapvLayer = new MapVLayer("mapv", { dataSet: dataSet, options: options });
        map.addLayer(mapvLayer);
    }


    render() {
        return (
            <PageHeaderWrapper>
                <div id="map" style={{ height: '530px' }}></div>
            </PageHeaderWrapper>
        )
    }

}
