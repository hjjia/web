import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'mobx-react';
import routesConfig from 'routes';
import 'antd/dist/antd.less';
import './styles/base.less';
// // import '~comm/ec-antd/dist/antd.less';
// import '~static/public-icon/iconfont.css';
// import './base.less';


render(
    <Provider>
        <Router history={browserHistory} routes={routesConfig} />
    </Provider>,
  document.getElementById('root')
);
