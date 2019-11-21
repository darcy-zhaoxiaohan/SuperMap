import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@tmp/history';
import RendererWrapper0 from 'C:/ZhaoXiaohan/demo eCharts/src/pages/.umi/LocaleWrapper.jsx';

const Router = require('dva/router').routerRedux.ConnectedRouter;

const routes = [
  {
    path: '/user',
    component: require('../../layouts/UserLayout').default,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: require('../user/login').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('C:/ZhaoXiaohan/demo eCharts/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    path: '/',
    component: require('../../layouts/SecurityLayout').default,
    routes: [
      {
        path: '/',
        component: require('../../layouts/BasicLayout').default,
        authority: ['admin', 'user'],
        routes: [
          {
            path: '/',
            redirect: '/welcome',
            exact: true,
          },
          {
            path: '/welcome',
            name: 'welcome',
            icon: 'smile',
            component: require('../Welcome').default,
            exact: true,
          },
          {
            path: '/admin',
            name: 'admin',
            icon: 'crown',
            component: require('../Admin').default,
            authority: ['admin'],
            exact: true,
          },
          {
            path: '/beijingMap',
            name: '北京地图',
            icon: 'crown',
            component: require('../BeijingMap').default,
            exact: true,
          },
          {
            path: '/beijingMap2',
            name: '北京空气质量监控',
            icon: 'crown',
            component: require('../BeijingMap2').default,
            exact: true,
          },
          {
            path: '/superMap',
            name: '世界地图1',
            icon: 'crown',
            component: require('../SuperMap').default,
            exact: true,
          },
          {
            path: '/superMap2',
            name: '中国地图2',
            icon: 'crown',
            component: require('../SuperMap2').default,
            exact: true,
          },
          {
            path: '/superMap3',
            name: '应急地图3',
            icon: 'crown',
            component: require('../SuperMap3').default,
            exact: true,
          },
          {
            path: '/superMap4',
            name: '徐圩新区4',
            icon: 'crown',
            component: require('../SuperMap4').default,
            exact: true,
          },
          {
            path: '/superMap5',
            name: '航拍地图5',
            icon: 'crown',
            component: require('../SuperMap5').default,
            exact: true,
          },
          {
            path: '/superMap6',
            name: '添加图层6',
            icon: 'crown',
            component: require('../SuperMap6').default,
            exact: true,
          },
          {
            component: require('../404').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('C:/ZhaoXiaohan/demo eCharts/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        component: require('../404').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('C:/ZhaoXiaohan/demo eCharts/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    component: require('../404').default,
    exact: true,
  },
  {
    component: () =>
      React.createElement(
        require('C:/ZhaoXiaohan/demo eCharts/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
          .default,
        { pagesPath: 'src/pages', hasRoutesInConfig: true },
      ),
  },
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen() {}

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    // dva 中 history.listen 会初始执行一次
    // 这里排除掉 dva 的场景，可以避免 onRouteChange 在启用 dva 后的初始加载时被多执行一次
    const isDva =
      history.listen
        .toString()
        .indexOf('callback(history.location, history.action)') > -1;
    if (!isDva) {
      routeChangeHandler(history.location);
    }
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return (
      <RendererWrapper0>
        <Router history={history}>{renderRoutes(routes, props)}</Router>
      </RendererWrapper0>
    );
  }
}
