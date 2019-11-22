import React from 'react';
import { Card, Typography, Alert } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { MapVLayer } from '@supermap/iclient-classic';
import { utilCityCenter, DataSet } from 'mapv';

import options from './option.js'
// pages/document.ejs中导入cdn文件;

var map, mapvLayer, layer, vectorLayer;
// 地图背景
var url = "http://192.16.199.24:8081/geoesb/proxy/services/maps/rest/cf2466bcc7484ad79229d22ba22be603/886e60bb7e014f22a707de23e6f6505d";


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
        vectorLayer = new SuperMap.Layer.Vector(); 
    }

    addLayer = () => {
        map.addLayers([layer,vectorLayer]);
        //出图，map.setCenter函数显示地图
        map.setCenter(new SuperMap.LonLat(119.543832, 34.57759),6);
        this.addFeature();
        // this.createMapVLayer();
    }

    addFeature = ()=> {
        var point = new SuperMap.Geometry.Point(119.543832, 34.57759);
        var pointVector = new SuperMap.Feature.Vector(point);
        pointVector.style = {fillColor: "red",strokeColor: "yellow",pointRadius:6};
        //添加矢量图形覆盖物
        vectorLayer.addFeatures(pointVector);
        vectorLayer.events.on({ "click": this.addClickFeature });
    }

    addClickFeature = (e)=>{
        console.log(e);
    }

    createMapVLayer = () => {
        // 取点数量
        var randomCount = 100;

        var data = [];

        while (randomCount--) {
            // var cityCenter = utilCityCenter.getCenterByCityName(citys[parseInt(Math.random() * citys.length)]);
            var cityCenter =  utilCityCenter.getCenterByCityName("连云港");
            data.push({
                geometry: {
                    type: 'Point',
                    // coordinates: [cityCenter.lng - 2 + Math.random() * 4, cityCenter.lat - 2 + Math.random() * 4]
                    coordinates: [cityCenter.lng - 0.2 + Math.random() * 1, cityCenter.lat - 0.6 + Math.random() * 1]
                },
                count: 30 * Math.random()
            });
        }
        var dataSet = new DataSet(data);

        var options = {
            fillStyle: 'rgba(55, 250, 250, 0.8)',
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
