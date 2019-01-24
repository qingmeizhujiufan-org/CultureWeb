import React from 'react';
import ReactDOM from 'react-dom';
import {Router, hashHistory} from 'react-router';
import routes from 'routes/index';
import './index.less'//全局样式
import './assets/css/iconfont.css';
import {LocaleProvider} from 'antd';
import zh_CN from "antd/lib/locale-provider/zh_CN";

ReactDOM.render(
    <LocaleProvider locale={zh_CN}>
        <Router history={hashHistory} routes={routes}/>
    </LocaleProvider>, window.document.getElementById('main')
);