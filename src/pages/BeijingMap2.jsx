import React from 'react';
import { Card, Typography, Alert } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { FormattedMessage } from 'umi-plugin-react/locale';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts';

import beijingJs from '@/assets/map/json/citys/110100.json';

const CodePreview = ({ children }) => (
  <pre
    style={{
      background: '#f2f4f5',
      padding: '12px 20px',
      margin: '12px 0',
    }}
  >
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

export default class Beijing2 extends React.Component{

	constructor(props) {
		super(props)
  }
  
  componentDidMount() {
    echarts.registerMap('beijing', beijingJs);
  }

	getOpation = () => {
		return {
			backgroundColor: '#404a59',
			title: {
					text: '北京空气质量监控',
					subtext: '副标题',
					sublink: 'http://www.pm25.in',
					left: 'center'
			},
			//地理坐标系组件用于地图的绘制，支持在地理坐标系上绘制散点图，线集。
			//要显示散点图，必须填写这个配置
			geo:{
					show:true,
					roam: true, //是否允许鼠标滚动放大，缩小
					map:'beijing',
					label: {  //图形上的文本标签，可用于说明图形的一些数据信息
							show:true,  //是否显示文本
							color:'#CCC',  //文本颜色
					},
					itemStyle: { //地图区域的多边形 图形样式。 默认样试。
							areaColor: '#323c48', //地图区域的颜色。
							borderColor: '#111', //边框线
					},
					emphasis:{ //高亮状态下的多边形和标签样式。
							label:{ //文本
									color: '#ADA',
							},
							itemStyle:{ //区域
									areaColor: '#F60'
							}
					},
					data:[
            {name: '昌平区',value: Math.round(Math.random()*500)},
            {name: '朝阳区',value: Math.round(Math.random()*500)},
            {name: '海淀区',value: Math.round(Math.random()*500)},
            {name: '顺义区',value: Math.round(Math.random()*500)},
            {name: '通州区',value: Math.round(Math.random()*500)},
            {name: '房山区',value: Math.round(Math.random()*500)},
            {name: '大兴区',value: Math.round(Math.random()*500)},
            {name: '丰台区',value: Math.round(Math.random()*500)},
            {name: '怀柔区',value: Math.round(Math.random()*500)},
            {name: '门头沟区',value: Math.round(Math.random()*500)},
            {name: '平谷区',value: Math.round(Math.random()*500)},
            {name: '石景山区',value: Math.round(Math.random()*500)},
            {name: '密云县',value: Math.round(Math.random()*500)},
          ],
			},
			tooltip:{
        show:true, //鼠标移入是否触发数据
        trigger: 'item', //出发方式
        formatter: (p) => {
          return '{b}-销售数量：{c}'
        }
      },
			//是视觉映射组件，用于进行『视觉编码』，也就是将数据映射到视觉元素（视觉通道）。
			visualMap: {
					min: 0, //最小值
					max: 600, //最大值
					calculable: true, //是否显示拖拽用的手柄（手柄能拖拽调整选中范围）。
					inRange: {
							color: ['#e83e5e','#fb2a08', '#d6f628'] //颜色
					},
					textStyle: {
							color: '#fff'
					},
			},
			series:[
					{
							type:'effectScatter', //样试
							coordinateSystem:'geo', //该系列使用的坐标系
							data:[ //数据
                {name: '昌平区',value: Math.round(Math.random()*500)},
                {name: '朝阳区',value: Math.round(Math.random()*500)},
                {name: '海淀区',value: Math.round(Math.random()*500)},
                {name: '顺义区',value: Math.round(Math.random()*500)},
                {name: '通州区',value: Math.round(Math.random()*500)},
                {name: '房山区',value: Math.round(Math.random()*500)},
                {name: '大兴区',value: Math.round(Math.random()*500)},
                {name: '丰台区',value: Math.round(Math.random()*500)},
                {name: '怀柔区',value: Math.round(Math.random()*500)},
                {name: '门头沟区',value: Math.round(Math.random()*500)},
                {name: '平谷区',value: Math.round(Math.random()*500)},
                {name: '石景山区',value: Math.round(Math.random()*500)},
                {name: '密云县',value: Math.round(Math.random()*500)},
							],
							itemStyle: { //样试。
									normal:{ //默认样试
											color: '#d6f628'
									}
							},
							label: {
									normal: {
											formatter: '{b}',
											position: 'right',
											show: true
									}
							},
							//标记的大小,可以设置数组或者函数返回值的形式
							symbolSize: function (val) {
									return val[2] / 25;
							},
							rippleEffect: { //涟漪特效相关配置。
									brushType: 'stroke' //波纹的绘制方式
							},
							hoverAnimation: true, //鼠标移入放大圆
					}
			]
		}
	}

	onChartReadyCallback = (res1) => {
		console.log('res1 ================>', res1);
	}
	render() {
		return (
			<PageHeaderWrapper>
				<ReactEchartsCore
					echarts={echarts}
					option={this.getOpation()}
					notMerge={true}
					lazyUpdate={true}
					theme={"theme_name"}
					onChartReady={this.onChartReadyCallback}
					style={{height: 600}}
				/>
			</PageHeaderWrapper>
		)
	}

}
