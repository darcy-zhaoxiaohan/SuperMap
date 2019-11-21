import React from 'react';
import { Card, Typography, Alert } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { MapVLayer } from '@supermap/iclient-classic';
import { utilCityCenter, DataSet } from 'mapv';

import optionList from './option.js'

// pages/document.ejs中导入了cdn文件;

var map, baseLayer, mapvLayer, layer, ThemeL, infowin, infowinPosition, popuname;
// 地图背景
var url = "http://192.16.199.24:8081/geoesb/proxy/services/maps/rest/0c8f60ef9d574b098cb27e146be1bf27/0a093f22355d492aa6778b8264684e4c";


export default class SuperMaps extends React.Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.init();
    }

    init = () => {
        map = new SuperMap.Map("map", {
            controls: [
                new SuperMap.Control.ScaleLine(),
                new SuperMap.Control.Navigation({
                    dragPanOptions: {
                        enableKinetic: true,
                    }
                }),
            ],
        });
        map.allOverlays = true;
        map.addControl(
            new SuperMap.Control.Zoom(),
            new SuperMap.Pixel(20, 32)//控件显示位置
        );
        // map.minScale = option.minScale;
        layer = new SuperMap.Layer.TiledDynamicRESTLayer("layer", url, {
            transparent: true,
            cacheEnabled: true
        }, {
            maxResolution: "auto"
        });
        layer.events.on({ "layerInitialized": this.addLayer });
    }

    addLayer = () => {
        // 定义 Unique 单值专题图层
        // ThemeL = new SuperMap.Layer.Unique("ThemeLayer");
        // //设置不透明度
        // ThemeL.setOpacity(0.8);
        // // 图层基础样式
        // ThemeL.style = {
        //     shadowBlur: 3,
        //     shadowColor: "#000000",
        //     shadowOffsetX: 1,
        //     shadowOffsetY: 1,
        //     fillColor: "#FFFF00",
        //     fillOpacity: 0
        // };

        // // 开启 hover 高亮效果
        // ThemeL.isHoverAble = true;

        // // hover 高亮样式
        // ThemeL.highlightStyle = {
        //     stroke: true,
        //     strokeWidth: 2,
        //     strokeColor: 'blue',
        //     fillColor: "#00F5FF",
        //     fillOpacity: 0.2
        // };

        // // 用于单值专题图的属性字段名称
        // ThemeL.themeField = option.themefiled;
        // // 风格数组，设定值对应的样式
        // ThemeL.styleGroups = [{
        //     value: "无",
        //     style: {
        //         fillColor: "#FF0000"
        //     }
        // }]
        //专题图层 mousemove 事件显示简单属性
        // ThemeL.on("mousemove", this.showInfoWin);
        // ThemeL.on("mouseout", this.closeInfoWin);
        // 注册 click 事件 显示属性表
        //themeLayer.on("click", showAttrWin);
        // 注册地图 mousemove，用于获取当前鼠标在地图中的像素位置
        // map.events.on({
        //     "mousemove": function (e) {
        //         infowinPosition = e.xy.clone();
        //     }
        // });
        // this.addThemeLayer();

        //将Layer图层加载到Map对象上
        // map.addLayer([layer, ThemeL]);
        map.addLayer(layer);
        //出图，map.setCenter函数显示地图
        map.setCenter(new SuperMap.LonLat(119.543832, 34.57759),1);
        this.createMapVLayer();
    }

    createMapVLayer = () => {
        var data = [];
        optionList.features.map((e,i)=>{
            data.push({
                geometry: {
                    type: 'Point',
                    coordinates: [e.geometry.center.x, e.geometry.center.y]
                },
                count: 1
            });
        })
        var dataSet = new DataSet(data);

        var options = {
            fillStyle: 'red',
            // strokeColor: "yellow",
            // pointRadius:2,
            // shadowColor: 'white',
            // shadowBlur: 4,
            max: 10,
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
