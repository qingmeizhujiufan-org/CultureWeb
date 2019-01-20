import React from 'react';
import {Link} from 'react-router';
import PropTypes from 'prop-types';
import {Form, Icon, Row, Col, message} from 'antd';
import restUrl from 'RestUrl';
import '../login.less';

import loginLeft from 'Img/login-left.png';
import followPublic from 'Img/followPublic.png';

const loginUrl = restUrl.ADDR + 'server/login';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false
        };
    }

    componentDidMount = () => {
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                });
                console.log('Received values of form: ', values);
                let param = {};
                param.user_name = values.userName;
                param.user_pwd = values.password;
                ajax.postJSON(loginUrl, JSON.stringify(param), (data) => {
                    if (data.success) {
                        localStorage.token = data.token;
                        localStorage.userId = data.userId;
                        this.context.router.push('/frame/home');
                    } else {
                        message.error(data.backMsg);
                    }
                    this.setState({
                        loading: false
                    });
                });
            }
        });
    }

    render() {
        const jumpUrl = encodeURIComponent('http://www.hbfolkways.com/web/#/login');
        const appid = "wxd31ca2ae6e515166";
        const weixinLoginUrl = `https://open.weixin.qq.com/connect/qrconnect?appid=${appid}&redirect_uri=${jumpUrl}&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect`;

        return (
            <div className="login">
                <div className="page-content">
                    <div className="content login-header">
                        <div className="logo zui-pull-left"><i className='iconfont icon-hubeiminsu'></i></div>
                        <div className="back zui-pull-right"><Link to='frame'>返回首页</Link></div>
                    </div>
                </div>
                <div className="page-content login-content">
                    <Row type="flex" justify="center" align="middle" style={{height: '100%'}}>
                        <Col span={6} style={{marginTop: '-7%'}}>
                            <img src={loginLeft}/>
                        </Col>
                        <Col span={6} style={{marginTop: '-7%'}}>
                            <div className="login-box">
                                <h1>
                                    <span className='left-dot'></span>
                                    <span>微信登录</span>
                                    <span className='right-dot'></span>
                                </h1>
                                <div className='qrcode'>
                                    <a href={weixinLoginUrl}>
                                        <img src={followPublic}/>
                                    </a>
                                </div>
                                <div className='tip'><Icon type="wechat"/> 扫一扫，微信账号登录</div>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="login-box">

                </div>
            </div>
        );
    }
}

const WrappedLogin = Form.create()(Login);

Login.contextTypes = {
    router: PropTypes.object
}

export default WrappedLogin;
