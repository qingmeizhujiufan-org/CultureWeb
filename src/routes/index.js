import React from 'react';
import {Router, Route, IndexRoute, IndexRedirect, hashHistory} from 'react-router';
import {Icon} from 'antd';
import Loadable from 'react-loadable';

function Loading(props) {
    if (props.error) {
        return <div>错误! <button onClick={props.retry}>点击重试</button></div>;
    } else if (props.timedOut) {
        return <div>已经超时加载... <button onClick={props.retry}>点击重试</button></div>;
    } else if (props.pastDelay) {
        return (
            <div style={{
                padding: '30px 0',
                textAlign: 'center'
            }}>
                <Icon type="loading" style={{fontSize: 24}}/>
            </div>
        );
    } else {
        return null;
    }
}

const App = Loadable({
    loader: () => import('../modules/App'),
    loading: Loading
});
const Frame = Loadable({
    loader: () => import('../modules/Frame'),
    loading: Loading
});

/* 首页 */
const Home = Loadable({
    loader: () => import('../modules/home/component/home'),
    loading: Loading
});
/* 文化展示 */
const Culture = Loadable({
    loader: () => import('../modules/culture/component/'),
    loading: Loading
});
const CultureDetail = Loadable({
    loader: () => import('../modules/culture/component/detail'),
    loading: Loading
});
const ArtDetail = Loadable({
    loader: () => import('../modules/culture/component/artDetail'),
    loading: Loading
});
/* 新闻资讯 */
const News = Loadable({
    loader: () => import('../modules/news/component/'),
    loading: Loading
});
const NewsDetail = Loadable({
    loader: () => import('../modules/news/component/detail'),
    loading: Loading
});
/* 图片展示 */
const Picture = Loadable({
    loader: () => import('../modules/picture/component/'),
    loading: Loading
});
const PictureDetail = Loadable({
    loader: () => import('../modules/picture/component/detail'),
    loading: Loading
});
/* 在线视频 */
const Video = Loadable({
    loader: () => import('../modules/video/component/'),
    loading: Loading
});
const VideoDetail = Loadable({
    loader: () => import('../modules/video/component/detail'),
    loading: Loading
});
/* VR视频 */
const VR = Loadable({
    loader: () => import('../modules/vr/component/'),
    loading: Loading
});
/* 联系我们 */
const ContractUs = Loadable({
    loader: () => import('../modules/contractUs/component/'),
    loading: Loading
});
/* 个人中心 */
const User = Loadable({
    loader: () => import('../modules/user/component/'),
    loading: Loading
});

/* 登录 */
const Login = Loadable({
    loader: () => import('../modules/login/component/login'),
    loading: Loading
});

module.exports = (
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRedirect to="frame"/>
            <Route path="frame" component={Frame}>
                <IndexRoute component={Home}/>
                <route path="culture/list(/:type)" component={Culture}/>
                <route path="culture/detail/:id" component={CultureDetail}/>
                <route path="culture/artDetail/:id" component={ArtDetail}/>
                <route path="news/list" component={News}/>
                <route path="news/detail/:id" component={NewsDetail}/>
                <route path="picture/list" component={Picture}/>
                <route path="picture/detail/:id" component={PictureDetail}/>
                <route path="video/list" component={Video}/>
                <route path="video/detail/:id" component={VideoDetail}/>
                <route path="vr/list" component={VR}/>
                <route path="contractus" component={ContractUs}/>
                <route path="personal" component={User}/>
            </Route>
            <Route path="login" component={Login}/>
        </Route>
    </Router>
);
