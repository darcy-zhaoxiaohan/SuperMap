import React from 'react';
import { Card, Typography, Alert } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { MapVLayer } from '@supermap/iclient-classic';
import { utilCityCenter, DataSet } from 'mapv';

import optionList from './option.js'
//声明变量map、layer、url
var map, layer , attribution , god , vectorLayer , demo , mapvLayer , feature;
var url2 = "http://192.16.199.24:8081/geoesb/proxy/services/maps/rest/0c8f60ef9d574b098cb27e146be1bf27/0a093f22355d492aa6778b8264684e4c";
var url = "http://192.16.199.24:8081/geoesb/proxy/services/maps/rest/3d638f61ec1142459be4e4c4f8fcc88e/76f11bc35c45464abb626a407b01371e";

export default class SuperMaps extends React.Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.init();
    }

    init() {
        // map = new SuperMap.Map ("map");
        map = new SuperMap.Map("map", {
            controls: [
                new SuperMap.Control.Navigation({
                    dragPanOptions: {
                        enableKinetic: true
                    }
                }),
                new SuperMap.Control.LayerSwitcher()
            ]
        });
        //创建分块动态REST图层，该图层显示iserver 8C 服务发布的地图,
        //其中"world"为图层名称，url图层的服务地址，{transparent: true}设置到url的可选参数
        // layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", url, 
        // null, {maxResolution:"auto"});
        layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", url);   //获取World地图服务地址
        god  = new SuperMap.Layer.TiledDynamicRESTLayer("god", url2);
        attribution = new SuperMap.Control.Attribution();

        map.addControl(
            // new SuperMap.Control.ScaleLine(),
            new SuperMap.Control.Zoom(),
            new SuperMap.Pixel(20, 32)//控件显示位置
        );
        layer.events.on({"layerInitialized": this.addLayer});  
        
        vectorLayer = new SuperMap.Layer.Vector('点'); 
        demo = new SuperMap.Layer.Vector('demo'); 
        this.addFeature();
        this.createMapVLayer();
    } 

    addLayer() {

        //将Layer图层加载到Map对象上
        // map.addLayer(layer);
        map.addLayers([layer ,god, vectorLayer , demo]);
        layer.attribution = "powered by <a target='_blank' href='http://www.supermap.com/cn" + "'>SuperMap</a> |detail in <a style='white-space: nowrap' target='_blank' href='" + url + "'>World</a>";
        map.addControl(attribution);
        //出图，map.setCenter函数显示地图
        map.setCenter(new SuperMap.LonLat(119.543832, 34.57759),4);     

    }
    addFeature () {
        var point = new SuperMap.Geometry.Point(119.543832, 34.57759);
        var pointVector = new SuperMap.Feature.Vector(point);
        pointVector.style = {fillColor: "red",strokeColor: "yellow",pointRadius:6};
        //添加矢量图形覆盖物
        vectorLayer.addFeatures(pointVector);


        var point1 = new SuperMap.Geometry.Point(119.553832, 34.55761);
        var pointVector1 = new SuperMap.Feature.Vector(point1);
        pointVector1.style = {fillColor: "blue",strokeColor: "yellow",pointRadius:6};
        demo.addFeatures(pointVector1);
    }


    createMapVLayer = () => {
        var data = [];
        optionList.features.map((e,i)=>{
            data.push({
                geometry: {
                    type: 'Point',
                    coordinates: [e.geometry.center.x, e.geometry.center.y]
                },
                count: 1 // 当前点的权重值
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
            size: 10,
            label: {
                show: true,
                fillStyle: 'white'
            },
            globalAlpha: 0.5,
            gradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)" },
            // draw: 'honeycomb'
            draw: 'density', // 渲染数据方式, simple:普通的打点 
            // drawOptions: {
            //             fillStyle: "rgba(255, 255, 50, 1)",  // 填充颜色
            //             strokeStyle: "rgba(50, 50, 255, 0.8)", // 描边颜色，不传就不描边
            //             lineWidth: 5, // 描边宽度
            //             radius: 5, // 半径大小
            //             unit: 'px' // 半径对应的单位，px:默认值，屏幕像素单位,m:米,对应地图上的大约距离,18级别时候1像素大约代表1米
            //         }
        };

        mapvLayer = new MapVLayer("mapv", { dataSet: dataSet, options: options 
        });
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
