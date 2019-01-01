import React from 'react';
import {Link} from 'react-router';
import PropTypes from 'prop-types';
import {Form, Icon, Row, Col, message, Input, Button, Tooltip, Checkbox} from 'antd';
import restUrl from 'RestUrl';
import axios from "Utils/axios";
import '../index.less';

import loginLeft from 'Img/login-left.png';

const registerUrl = restUrl.ADDR + 'server/register';

const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 8},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false
        };
    }

    componentDidMount = () => {
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({confirmDirty: this.state.confirmDirty || !!value});
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('userPwd')) {
            callback('两次密码不一致!');
        } else {
            callback();
        }
    }

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], {force: true});
        }
        callback();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                });
                console.log('Received values of form: ', values);
                axios.post('user/save', values).then(res => res.data).then(data => {
                    if (data.success) {
                        // localStorage.token = data.token;
                        // localStorage.userId = data.userId;
                        // this.context.router.push('/frame/home');
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
        const {getFieldDecorator} = this.props.form;

        return (
            <div className="login">
                <div className="page-content">
                    <div className="content login-header">
                        <div className="logo zui-pull-left">
                            <div className='logo'><span className='iconfont icon-hubeiminsu'></span></div>
                        </div>
                        <div className="back zui-pull-right"><Link to='login'>返回登录</Link></div>
                    </div>
                </div>
                <div className="page-content">
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Item
                            {...formItemLayout}
                            label="邮箱"
                        >
                            {getFieldDecorator('email', {
                                rules: [{
                                    type: 'email', message: '这不是合法的邮箱!',
                                }, {
                                    required: true, message: '请输入您的邮箱地址!',
                                }],
                            })(
                                <Input/>
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="密码"
                        >
                            {getFieldDecorator('userPwd', {
                                rules: [{
                                    required: true, message: '请输入您的密码!',
                                }, {
                                    validator: this.validateToNextPassword,
                                }],
                            })(
                                <Input type="password"/>
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="重复密码"
                        >
                            {getFieldDecorator('confirm', {
                                rules: [{
                                    required: true, message: '请确认您的密码!',
                                }, {
                                    validator: this.compareToFirstPassword,
                                }],
                            })(
                                <Input type="password" onBlur={this.handleConfirmBlur}/>
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label={(
                                <span>
                                    昵称&nbsp;
                                    <Tooltip title="让别人知道怎么称呼您?">
                                        <Icon type="question-circle-o"/>
                                    </Tooltip>
                                </span>
                            )}
                        >
                            {getFieldDecorator('nickname', {
                                rules: [{required: false}],
                            })(
                                <Input/>
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="电话号码"
                        >
                            {getFieldDecorator('phone', {
                                rules: [{required: false}],
                            })(
                                <Input style={{width: '100%'}}/>
                            )}
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                            {getFieldDecorator('agreement', {
                                valuePropName: 'checked',
                            })(
                                <Checkbox>我已经阅读了这个 <a href="">协议</a></Checkbox>
                            )}
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit">注册</Button>
                        </Form.Item>
                    </Form>
                </div>
                <div className="login-box">

                </div>
            </div>
        );
    }
}

const WrappedIndex = Form.create()(Index);

Index.contextTypes = {
    router: PropTypes.object
}

export default WrappedIndex;
