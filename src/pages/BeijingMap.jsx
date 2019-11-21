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

export default class BeijingMap extends React.Component{

	constructor(props) {
		super(props)
  }
  
  componentDidMount() {
    echarts.registerMap('beijing', beijingJs);
  }

	getOpation = () => {
		return {
      backgroundColor: '#404a59', //背景颜色
      title: {
          text: '全国主要城市空气质量',
          subtext: 'data from PM25.in',
          x:'center',
      },
      legend: { //图例组件。
          orient: 'vertical',
          y: 'bottom',
          x:'right',
          data:['pm2.5'],
          textStyle: {
              color: '#fff'
          }
      },
      //是视觉映射组件，用于进行『视觉编码』，也就是将数据映射到视觉元素（视觉通道）。
      visualMap: {
          min: 0, //最小值
          max: 600, //最大值
          calculable: true, //是否显示拖拽用的手柄（手柄能拖拽调整选中范围）。
          inRange: {
              color: ['#91d5ff', '#40a9ff', '#1890ff', '#0050b3', '#002766'] //颜色
          },
          textStyle: {
              color: '#fff'
          },
      },
      // 提示框，鼠标移入
      tooltip:{
          show:true, //鼠标移入是否触发数据
          trigger: 'item', //出发方式
          formatter:'{b}-销售数量：{c}'
      },
      //配置地图的数据，并且显示
      series:[
          {
              name:'地图',
              type: 'map',  //地图种类
              map: 'beijing', //地图类型。
              data:[
                  {name: '昌平区',value: Math.round(Math.random()*1000)},
                  {name: '朝阳区',value: Math.round(Math.random()*1000)},
                  {name: '海淀区',value: Math.round(Math.random()*1000)},
                  {name: '顺义区',value: Math.round(Math.random()*1000)},
                  {name: '通州区',value: Math.round(Math.random()*1000)},
                  {name: '房山区',value: Math.round(Math.random()*1000)},
                  {name: '大兴区',value: Math.round(Math.random()*1000)},
                  {name: '丰台区',value: Math.round(Math.random()*1000)},
                  {name: '怀柔区',value: Math.round(Math.random()*1000)},
                  {name: '门头沟区',value: Math.round(Math.random()*1000)},
                  {name: '平谷区',value: Math.round(Math.random()*1000)},
                  {name: '石景山区',value: Math.round(Math.random()*1000)},
                  {name: '密云县',value: Math.round(Math.random()*1000)},
                  {name: '延庆县',value: Math.round(Math.random()*1000)},
                  {name: '西城区',value: Math.round(Math.random()*1000)},
                  {name: '东城区',value: Math.round(Math.random()*1000)},
                  
              ],
              itemStyle: { //地图区域的多边形 图形样式。
                  emphasis:{ //高亮状态下的样试
                      label:{
                          show:true,
                          areaColor: '#F60'
                      }
                  }
              },
              zoom:1,//放大比例
              label: {  //图形上的文本标签，可用于说明图形的一些数据信息
                show:true,
              },
          },
          {
              type:'scatter',
              showEffectOn: 'render',//配置什么时候显示特效
              coordinateSystem:'geo',//该系列使用的坐标系
              symbolSize:10,//标记的大小
              data:[
                  {name: '宜昌', value: [111.3,30.7,130]},
              ],
              zlevel:99999
          },
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
					style={{height: 600, width: '50%',}}
				/>
			</PageHeaderWrapper>
		)
	}

}
