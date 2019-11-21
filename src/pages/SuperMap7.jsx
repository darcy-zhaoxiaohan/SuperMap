import React from 'react';
import { Card, Typography, Alert } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import L from 'leaflet';
import '@supermap/iclient-leaflet';

var map, url = "http://support.supermap.com.cn:8090/iserver/services/map-world/rest/maps/World";

export default class SuperMaps extends React.Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.init();
    }

    init = () => {
        map = L.map('map', {
            crs: L.CRS.EPSG4326,
            center: [0, 0],
            maxZoom: 18,
            zoom: 1
        });
        L.supermap.tiledMapLayer(url).addTo(map);

        // 定义地图投影
        // var crs = L.Proj.CRS("EPSG:4326", {
        //     origin: [114.59, 42.31],
        //     scaleDenominators: [100000, 50000, 25000, 20000, 10000, 5000, 2000, 1000, 500, 200, 100, 50, 20, 1]
        // });
        // var map = L.map('map', {
        //     crs: crs,
        //     center: [39.79, 116.85],
        // });
        // L.supermap.tiledMapLayer(url).addTo(map);
    }

    render() {
        return (
            <PageHeaderWrapper>
                <div id="map" style={{ height: '530px' }}></div>
            </PageHeaderWrapper>
        )
    }

}
