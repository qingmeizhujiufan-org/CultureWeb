import React from 'react';
import {Link} from 'react-router';
import PropTypes from 'prop-types';
import {Form, Icon, Row, Col, message, Input, Button} from 'antd';
import restUrl from 'RestUrl';
import axios from "Utils/axios";
import '../login.less';

import loginLeft from 'Img/login-left.png';

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
                axios.post('user/login', values).then(res => res.data).then(data => {
                    this.setState({
                        loading: false
                    });
                    if (data.success) {
                        localStorage.token = data.token;
                        localStorage.userId = data.userId;
                        localStorage.avatar = data.avatar;
                        this.context.router.push('/frame');
                    } else {
                        message.error(data.backMsg);
                    }
                });
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;

        return (
            <div className="login">
                <div className="page-content">
                    <div className="content login-header">
                        <div className="logo zui-pull-left">
                            <div className='logo'><span className='iconfont icon-hubeiminsu'></span></div>
                        </div>
                        <div className="back zui-pull-right"><Link to='frame'>返回首页</Link></div>
                    </div>
                </div>
                <div className="page-content login-content">
                    <Row type="flex" justify="center" align="middle" style={{height: '100%'}}>
                        <Col span={6} style={{marginTop: '-7%'}}>
                            <img src={loginLeft}/>
                        </Col>
                        <Col span={6} style={{marginTop: '-7%'}}>
                            <div className='login-box'>
                                <Form onSubmit={this.handleSubmit} className="login-form">
                                    <Form.Item>
                                        <h1 style={{margin: '15px 0 0 0'}}>欢迎登录</h1>
                                    </Form.Item>
                                    <Form.Item>
                                        {getFieldDecorator('email', {
                                            rules: [{
                                                type: 'email', message: '邮箱格式不正确!',
                                            }, {
                                                required: true, message: '请输入邮箱'
                                            }],
                                        })(
                                            <Input
                                                className='login-input'
                                                prefix={<Icon type="mail" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                                placeholder="邮箱"
                                            />
                                        )}
                                    </Form.Item>
                                    <Form.Item>
                                        {getFieldDecorator('userPwd', {
                                            rules: [{required: true, message: '请输入密码'}],
                                        })(
                                            <Input
                                                className='login-input'
                                                prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                                type="password"
                                                placeholder="密码"
                                            />
                                        )}
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" className="login-form-button">
                                            登录
                                        </Button>
                                        或者 <Link to={'register'}>立即注册</Link>
                                    </Form.Item>
                                </Form>
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
