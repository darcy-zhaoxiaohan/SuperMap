import React from 'react';
import { Card, Typography, Alert } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

var map, layer, vectorLayer,
    // 地图背景
    url = "http://support.supermap.com.cn:8090/iserver/services/map-world/rest/maps/World";
    // url = "http://support.supermap.com.cn:8090/iserver/services/map-china400/rest/maps/China_4326";



export default class SuperMaps extends React.Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.init();
    }

    // 1,世界地图
    init = ()=> {
        map = new SuperMap.Map ("map");
        //创建分块动态REST图层，该图层显示iserver 8C 服务发布的地图,
        // 添加比例尺
        map.addControl(new SuperMap.Control.ScaleLine());
        //其中"world"为图层名称，url图层的服务地址，{transparent: true}设置到url的可选参数
        layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", url, null, {maxResolution:"auto"});
        layer.events.on({"layerInitialized": this.addLayer});  
        vectorLayer = new SuperMap.Layer.Vector();        
    } 
    addLayer = ()=> {
        //将Layer图层加载到Map对象上
        map.addLayers([layer,vectorLayer]);
        //出图，map.setCenter函数显示地图
        map.setCenter(new SuperMap.LonLat(0, 0), 0);  
        this.addFeature();      
    }

    addFeature = ()=> {
        var point = new SuperMap.Geometry.Point(0,0);
        var pointVector = new SuperMap.Feature.Vector(point);
        pointVector.style = {fillColor: "red",strokeColor: "yellow",pointRadius:6};
        //添加矢量图形覆盖物
        vectorLayer.addFeatures(pointVector);
    }

    render() {
        return (
            <PageHeaderWrapper>
                <div id="map" style={{ height: '530px' }}></div>
            </PageHeaderWrapper>
        )
    }

}
