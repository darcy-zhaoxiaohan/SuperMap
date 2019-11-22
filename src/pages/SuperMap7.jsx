import React from 'react';
import { Card, Typography, Alert, Button, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { MapVLayer } from '@supermap/iclient-classic';
import { utilCityCenter, DataSet } from 'mapv';

import optionList from './option.js';
//声明变量map、layer、url
var map,
	layer,
	attribution,
	god,
	vectorLayer,
	demo,
	mapvLayer,
	feature,
	rangingLayer, // 测距图层
	lineLayer, // 线性测量
	drawLine,
	styleLayer = {
		strokeColor: '#304DBE',
		strokeWidth: 2,
		pointerEvents: 'visiblePainted',
		fillColor: '#304DBE',
		fillOpacity: 0.8
	},
	polygonLayer, //侧面积图层
	drawPolygon, //面积测量
	stylePolygon = {
		strokeColor: '#00f',
		strokeWidth: 2,
		pointerEvents: 'visiblePainted',
		fillColor: '#0f0',
		fillOpacity: 0.8
	};

var url2 =
	'http://192.16.199.24:8081/geoesb/proxy/services/maps/rest/0c8f60ef9d574b098cb27e146be1bf27/0a093f22355d492aa6778b8264684e4c';
var url =
	'http://192.16.199.24:8081/geoesb/proxy/services/maps/rest/3d638f61ec1142459be4e4c4f8fcc88e/76f11bc35c45464abb626a407b01371e';

export default class SuperMaps extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.init();
	}

	init = () => {
		// map = new SuperMap.Map ("map");

		//创建分块动态REST图层，该图层显示iserver 8C 服务发布的地图,
		//其中"world"为图层名称，url图层的服务地址，{transparent: true}设置到url的可选参数
		// layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", url,
		// null, {maxResolution:"auto"});
		layer = new SuperMap.Layer.TiledDynamicRESTLayer('World', url); //获取World地图服务地址
		god = new SuperMap.Layer.TiledDynamicRESTLayer('god', url2);

		//新建线矢量图层
		lineLayer = new SuperMap.Layer.Vector('线距离测算');
		//对线图层应用样式style（前面有定义）
		lineLayer.style = styleLayer;
		//创建画线控制，图层是lineLayer;这里DrawFeature(图层,类型,属性)；multi:true在将要素放入图层之前是否现将其放入几何图层中
		drawLine = new SuperMap.Control.DrawFeature(lineLayer, SuperMap.Handler.Path, { multi: true });
		/*
            注册featureadded事件,触发drawCompleted()方法
            例如注册"loadstart"事件的单独监听
            events.on({ "loadstart": loadStartListener });
        */
		drawLine.events.on({ featureadded: this.drawCompletedLine });

		//新建面矢量图层
		polygonLayer = new SuperMap.Layer.Vector('面积测量');
		//对面图层应用样式style（前面有定义）
		polygonLayer.style = stylePolygon;
		drawPolygon = new SuperMap.Control.DrawFeature(polygonLayer, SuperMap.Handler.Polygon);
		drawPolygon.events.on({ featureadded: this.drawCompletedPolygon });

		// 图层来源说明
		attribution = new SuperMap.Control.Attribution();

		map = new SuperMap.Map('map', {
			controls: [
				new SuperMap.Control.LayerSwitcher(),
				new SuperMap.Control.ScaleLine(),
				new SuperMap.Control.Zoom(),
				new SuperMap.Control.Navigation({
					dragPanOptions: {
						enableKinetic: true
					}
				}),
				drawLine,
				drawPolygon
			]
		});
		// map.addControl(
		// 	// new SuperMap.Control.ScaleLine(),
		// 	new SuperMap.Control.Zoom(),
		// 	new SuperMap.Pixel(20, 32) //控件显示位置
		// );
		layer.events.on({ layerInitialized: this.addLayer });

		vectorLayer = new SuperMap.Layer.Vector('点');
		demo = new SuperMap.Layer.Vector('demo');
		this.addFeature();
		this.createMapVLayer();
	};

	addLayer = () => {
		//将Layer图层加载到Map对象上
		// map.addLayer(layer);
		map.addLayers([ layer, god, vectorLayer, demo, lineLayer, polygonLayer ]);
		layer.attribution =
			"powered by <a target='_blank' href='http://www.supermap.com/cn" +
			"'>SuperMap</a> |detail in <a style='white-space: nowrap' target='_blank' href='" +
			url +
			"'>World</a>";
		map.addControl(attribution);
		//出图，map.setCenter函数显示地图
		map.setCenter(new SuperMap.LonLat(119.543832, 34.57759), 4);
	};
	addFeature = () => {
		// 配置点的位置 与 距离
		var point = new SuperMap.Geometry.Point(119.543832, 34.57759);
		var pointVector = new SuperMap.Feature.Vector(point);
		pointVector.style = {
			fillColor: 'red',
			strokeColor: 'yellow',
			pointRadius: 6
		};
		//添加矢量图形覆盖物
		vectorLayer.addFeatures(pointVector);

		var point1 = new SuperMap.Geometry.Point(119.553832, 34.55761);
		var pointVector1 = new SuperMap.Feature.Vector(point1);
		pointVector1.style = {
			fillColor: 'blue',
			strokeColor: 'yellow',
			pointRadius: 6
		};
		demo.addFeatures(pointVector1);
	};

	// 创建mapV图层
	createMapVLayer = () => {
		var data = [];
		optionList.features.map((e, i) => {
			data.push({
				geometry: {
					type: 'Point',
					coordinates: [ e.geometry.center.x, e.geometry.center.y ]
				},
				count: 1 // 当前点的权重值
			});
		});
		var dataSet = new DataSet(data);

		// var options = {
		//     // fillStyle: 'red',
		//     // strokeColor: "yellow",
		//     // pointRadius:2,
		//     // shadowColor: 'white',
		//     // shadowBlur: 4,
		//     max: 10,
		//     size: 20,
		//     label: {
		//         show: true,
		//         fillStyle: 'white'
		//     },
		//     globalAlpha: 0.5,
		//     gradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)" },
		//     draw: 'honeycomb'
		//     // draw: 'density', // 渲染数据方式, simple:普通的打点
		//     // drawOptions: {
		//     //             fillStyle: "rgba(255, 255, 50, 1)",  // 填充颜色
		//     //             strokeStyle: "rgba(50, 50, 255, 0.8)", // 描边颜色，不传就不描边
		//     //             lineWidth: 5, // 描边宽度
		//     //             radius: 5, // 半径大小
		//     //             unit: 'px' // 半径对应的单位，px:默认值，屏幕像素单位,m:米,对应地图上的大约距离,18级别时候1像素大约代表1米
		//     //         }
		// };

		var options = {
			// shadowColor: 'rgba(255, 250, 50, 1)',
			// shadowBlur: 10,
			fillStyle: 'rgba(255, 50, 0, 1.0)', // 非聚合点的颜色
			size: 20, // 非聚合点的半径
			minSize: 8, // 聚合点最小半径
			maxSize: 31, // 聚合点最大半径
			globalAlpha: 0.8, // 透明度
			clusterRadius: 150, // 聚合像素半径
			methods: {
				click: function(item) {
					console.log(item); // 点击事件
				}
			},
			maxZoom: 19, // 最大显示级别
			label: {
				// 聚合文本样式
				show: true, // 是否显示
				fillStyle: 'white'
				// shadowColor: 'yellow',
				// font: '20px Arial',
				// shadowBlur: 10,
			},
			gradient: { 0: 'blue', 0.5: 'yellow', 1.0: 'rgb(255,0,0)' }, // 聚合图标渐变色
			draw: 'honeycomb'
		};

		mapvLayer = new MapVLayer('mapv', {
			dataSet: dataSet,
			options: options
		});
		map.addLayer(mapvLayer);
	};

	//线绘完触发事件
	drawCompletedLine = (drawGeometryArgs) => {
		console.log('111111111------------->', drawGeometryArgs);
		//停止画面控制
		drawLine.deactivate(); //线
		//获得图层几何对象
		var geometry = drawGeometryArgs.feature.geometry,
			measureParam = new SuperMap.REST.MeasureParameters(
				geometry
			) /* MeasureParameters：量算参数类。 客户端要量算的地物间的距离或某个区域的面积*/,
			myMeasuerService = new SuperMap.REST.MeasureService(url); //量算服务类，该类负责将量算参数传递到服务端，并获取服务端返回的量算结果
		myMeasuerService.events.on({ processCompleted: this.measureCompletedLine });

		//对MeasureService类型进行判断和赋值，当判断出是LineString时设置MeasureMode.DISTANCE，否则是MeasureMode.AREA

		myMeasuerService.measureMode = SuperMap.REST.MeasureMode.DISTANCE;

		myMeasuerService.processAsync(measureParam); //processAsync负责将客户端的量算参数传递到服务端。
	};

	//面积绘完触发事件
	drawCompletedPolygon = (drawGeometryArgs) => {
		console.log('777777777777777777----------', drawGeometryArgs);
		drawPolygon.deactivate();
		//获得图层几何对象
		var geometry = drawGeometryArgs.feature.geometry,
			measureParam = new SuperMap.REST.MeasureParameters(
				geometry
			) /* MeasureParameters：量算参数类。 客户端要量算的地物间的距离或某个区域的面积*/,
			myMeasuerService = new SuperMap.REST.MeasureService(url); //量算服务类，该类负责将量算参数传递到服务端，并获取服务端返回的量算结果
		myMeasuerService.events.on({
			processCompleted: this.measureCompletedPolygon
		});
		//对MeasureService类型进行判断和赋值，当判断出是LineString时设置MeasureMode.DISTANCE，否则是MeasureMode.AREA
		console.log('-----------MeasureService-', myMeasuerService);
		myMeasuerService.measureMode = SuperMap.REST.MeasureMode.AREA;

		myMeasuerService.processAsync(measureParam); //processAsync负责将客户端的量算参数传递到服务端。
	};

	distanceMeasure = () => {
		// widgets.alert.clearAlert();
		lineLayer.removeAllFeatures();
		drawLine.activate();
	};

	//测量结束调用事件
	measureCompletedLine = (measureEventArgs) => {
		console.log('line------------------>', measureEventArgs);
		var distance = measureEventArgs.result.distance;
		var unit = measureEventArgs.result.unit;
		message.success(`量算结果： ${Number(distance).toFixed(2)}米 `, 4);
	};
	measureCompletedPolygon = (measureEventArgs) => {
		console.log('TCL: SuperMaps -> measureCompletedPolygon -> measureEventArgs', measureEventArgs);
		var area = measureEventArgs.result.area,
			unit = measureEventArgs.result.unit;
		message.success(`量算结果： ${Number(area).toFixed(2)}平方米`, 4);
	};

	//移除图层要素
	clearFeatures = () => {
		lineLayer.removeAllFeatures();
		polygonLayer.removeAllFeatures();
	};

	// 面积
	areaMeasure = () => {
		// widgets.alert.clearAlert();
		polygonLayer.removeAllFeatures();
		drawPolygon.activate();
	};

	render() {
		return (
			<PageHeaderWrapper>
				<div id="map" style={{ height: '530px' }} />

				<div
					style={{
						zIndex: '99999',
						position: 'absolute',
						left: '50px',
						top: '150px',
						textAlign: 'center'
					}}
				>
					<div class="panel-body" id="params">
						<div align="right" class="button-group">
							<Button type="primary" onClick={this.distanceMeasure}>
								距离量算
							</Button>
							<Button type="primary" onClick={this.areaMeasure}>
								面积测算
							</Button>
							<Button type="primary" onClick={this.clearFeatures}>
								清除
							</Button>
						</div>
					</div>
				</div>
			</PageHeaderWrapper>
		);
	}
}
