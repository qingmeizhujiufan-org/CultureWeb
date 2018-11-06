import React from 'react';
import ReactDOM from 'react-dom';
import {Router, hashHistory} from 'react-router';
import routes from 'routes/index';
import './index.less'//全局样式
import './assets/css/iconfont.css';

ReactDOM.render(
    <Router history={hashHistory} routes={routes}/>, window.document.getElementById('main')
);