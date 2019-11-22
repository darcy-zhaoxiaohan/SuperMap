import React from 'react';
import { Card, Typography, Alert, Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { MapVLayer } from '@supermap/iclient-classic';
import { utilCityCenter, DataSet } from 'mapv';

import optionList from './option.js'
//声明变量map、layer、url
// var map, layer , attribution , god , vectorLayer , demo , mapvLayer , feature;
// var url2 = "http://192.16.199.24:8081/geoesb/proxy/services/maps/rest/0c8f60ef9d574b098cb27e146be1bf27/0a093f22355d492aa6778b8264684e4c";
var url = "http://192.16.199.24:8081/geoesb/proxy/services/maps/rest/3d638f61ec1142459be4e4c4f8fcc88e/76f11bc35c45464abb626a407b01371e";

var map, layer, drawPoint, drawLine, drawPolygon, vecotrLayer, modifyCtrl, selectCtrl;
    // host = window.isLocal ? window.server : "http://support.supermap.com.cn:8090";
// var url = host + "/iserver/services/map-china400/rest/maps/China_4326";

export default class SuperMaps extends React.Component {

    constructor(props) {
        super(props)
        this.state={
            text: '111',
        }
    }

    componentDidMount() {
        this.init();
    }

    init() {
        //新建面矢量图层
        vecotrLayer = new SuperMap.Layer.Vector("polygonLayer");
        
        drawPoint = new SuperMap.Control.DrawFeature(vecotrLayer, SuperMap.Handler.Point, { multi: true });
        drawLine = new SuperMap.Control.DrawFeature(vecotrLayer, SuperMap.Handler.Path, { multi: true });
        drawPolygon = new SuperMap.Control.DrawFeature(vecotrLayer, SuperMap.Handler.Polygon);
        modifyCtrl = new SuperMap.Control.ModifyFeature(vecotrLayer);
        selectCtrl = new SuperMap.Control.SelectFeature(vecotrLayer, {
            onSelect: (feature) => {
                //选中要素操作
            },
            onUnselect: (feature) => {
                //未选中要素操作
            },
            callbacks: {
                dblclick: (feature) => {
                    //双击逻辑回调
                }
            },
            hover: false,
            repeat: false
        });
        
        drawLine.events.on({featureadded: this.drawCompleted});
        //定义layer图层，TiledDynamicRESTLayer：分块动态 REST 图层
        layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", url, {
            transparent: true,
            cacheEnabled: true
        }, {maxResolution: "auto"});
        //为图层初始化完毕添加addLayer()事件
        layer.events.on({"layerInitialized": this.addLayer});

        map = new SuperMap.Map("map", {
            controls: [
                new SuperMap.Control.Zoom(),
                new SuperMap.Control.Navigation(),
                new SuperMap.Control.LayerSwitcher()
                , drawPoint, drawLine, drawPolygon, selectCtrl, modifyCtrl]
        });
        // layer = new SuperMap.Layer.CloudLayer();
        // this.addLayer();
        //layer.events.on({"layerInitialized": this.addLayer});
        vecotrLayer.style = {
            fillColor: "blue",
            fillOpacity: 0.6,
            hoverFillColor: "white",
            hoverFillOpacity: 0.8,
            strokeColor: "#eeff00",
            strokeOpacity: 1,
            strokeWidth: 1,
            strokeLinecap: "round",
            strokeDashstyle: "solid",
            hoverStrokeColor: "red",
            hoverStrokeOpacity: 1,
            hoverStrokeWidth: 0.2,
            pointRadius: 6,
            hoverPointRadius: 1,
            hoverPointUnit: "%",
            pointerEvents: "visiblePainted",
            cursor: "inherit",
            fontColor: "#000000",
            labelAlign: "cm",
            labelOutlineColor: "white",
            labelOutlineWidth: 3
        };
    }

    addLayer() {
        map.addLayers([layer, vecotrLayer]);
        //显示地图范围
        map.setCenter(new SuperMap.LonLat(119.543832, 34.57759),6);
    }

    draw_point() {
        this.deactiveAll();
        drawPoint.activate();

    }
    draw_line() {
        // widgets.alert.clearAlert();
        this.deactiveAll();
        drawLine.activate();
    }

    //绘完触发事件
    drawCompleted(drawGeometryArgs) {
        console.log('111111111------------->', drawGeometryArgs);
        //停止画面控制
        drawLine.deactivate();
        //获得图层几何对象
        var geometry = drawGeometryArgs.feature.geometry,
        measureParam = new SuperMap.REST.MeasureParameters(geometry), /* MeasureParameters：量算参数类。 客户端要量算的地物间的距离或某个区域的面积*/
        myMeasuerService = new SuperMap.REST.MeasureService(url); //量算服务类，该类负责将量算参数传递到服务端，并获取服务端返回的量算结果
        myMeasuerService.events.on({"processCompleted": this.measureCompleted});
        
        //对MeasureService类型进行判断和赋值，当判断出是LineString时设置MeasureMode.DISTANCE，否则是MeasureMode.AREA
        
        myMeasuerService.measureMode = SuperMap.REST.MeasureMode.DISTANCE;
        
        myMeasuerService.processAsync(measureParam); //processAsync负责将客户端的量算参数传递到服务端。
    }
    
    //测量结束调用事件
    measureCompleted(measureEventArgs) {
        console.log('2222222------------->');
        var distance = measureEventArgs.result.distance;
        var unit = measureEventArgs.result.unit;
        console.log("resources.msg_measureResult + distance + resources.msg_m",distance);
        this.state({
            text: distance,
        })
        // widgets.alert.showAlert(resources.msg_measureResult + distance + resources.msg_m,true);
    }

    draw_polygon() {
        this.deactiveAll();
        drawPolygon.activate();
    }
    deactiveAll() {
        drawPoint.deactivate();
        drawLine.deactivate();
        drawPolygon.deactivate();
        selectCtrl.deactivate();
        modifyCtrl.deactivate();
    }

    selectFeature() {
        this.deactiveAll();
        selectCtrl.activate();
    }

    modifyFeature() {
        this.deactiveAll();
        modifyCtrl.activate();
    }

    undo() {
        modifyCtrl.undo();
    }

    redo() {
        modifyCtrl.redo();
    }

    clearFeatures() {
        this.deactiveAll();
        vecotrLayer.removeAllFeatures();
    }

    render() {
        return (
            <PageHeaderWrapper>
                <Button type="primary" onClick={this.draw_point.bind(this)}>绘点</Button>
                &nbsp;&nbsp;
                <Button type="primary" onClick={this.draw_line.bind(this)}>距离量算</Button>
                &nbsp;&nbsp;
                <Button type="primary" onClick={this.draw_polygon.bind(this)}>面积量算</Button>
                &nbsp;&nbsp;
                <Button type="primary" onClick={this.selectFeature.bind(this)}>选择</Button>
                &nbsp;&nbsp;
                <Button type="primary" onClick={this.modifyFeature.bind(this)}>编辑</Button>
                &nbsp;&nbsp;
                <Button type="primary" onClick={this.undo.bind(this)}>Undo</Button>
                &nbsp;&nbsp;
                <Button type="primary" onClick={this.redo.bind(this)}>Redo</Button>
                &nbsp;&nbsp;
                <Button type="primary" onClick={this.clearFeatures.bind(this)}>清除</Button>
                &nbsp;&nbsp;
                <span>{this.state.text}</span>
                <br></br>
                <br></br>
                <div id="map" style={{ height: '530px' }}></div>
            </PageHeaderWrapper>
        )
    }

}
