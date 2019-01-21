import React from 'react';
import {Link} from 'react-router';
import PropTypes from 'prop-types';
import {Icon, Tabs, Avatar, List, Card, message, Modal} from 'antd';
import _find from 'lodash/find';
import restUrl from 'RestUrl';
import '../index.less';
import defaultUser from 'Img/default-user.jpg';
import {shiftDate} from "../../../util/util";
import empty from 'Img/personal-empty.png';
import axios from "Utils/axios";

const TabPane = Tabs.TabPane;
const deleteUrl = 'taste/delete';
const delete2Url = 'art/delete2';
const delete3Url = 'culture/delete2';

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            stateList: [{
                active: true,
                state: null,
                label: '全部'
            }, {
                active: false,
                state: 0,
                label: '待审核'
            }, {
                active: false,
                state: 1,
                label: '已通过'
            }, {
                active: false,
                state: -1,
                label: '未通过'
            }],
            myPic: [],
            collectArt: [],
            collectCulture: [],
            likeTotal: 0
        };
    }

    componentWillMount = () => {
    }

    componentDidMount = () => {
        this.getMyPic();
        this.queryLikeTotal();
        this.queryUserCollectArt();
        this.queryUserCollectCulture();
    }

    getMyPic = () => {
        let param = {};
        param.userId = localStorage.userId;
        this.setState({loading: true});
        axios.get('taste/queryUserPic', {params: param}).then(res => res.data).then(data => {
            if (data.success) {
                let backData = data.backData;

                this.setState({
                    myPic: backData
                });
            } else {
                message.error(data.backMsg);
            }
            this.setState({loading: false});
        });
    }

    queryUserCollectArt = () => {
        let param = {};
        param.userId = localStorage.userId;
        this.setState({loading: true});
        axios.get('art/queryUserCollectArt', {params: param}).then(res => res.data).then(data => {
            if (data.success) {
                let backData = data.backData;

                this.setState({
                    collectArt: backData
                });
            } else {
                message.error(data.backMsg);
            }
            this.setState({loading: false});
        });
    }

    queryLikeTotal = () => {
        let param = {};
        param.userId = localStorage.userId;
        axios.get('taste/queryLikeTotal', {params: param}).then(res => res.data).then(data => {
            if (data.success) {
                this.setState({
                    likeTotal: data.total
                });
            } else {
                message.error(data.backMsg);
            }
        });
    }

    queryUserCollectCulture = () => {
        let param = {};
        param.userId = localStorage.userId;
        this.setState({loading: true});
        axios.get('culture/queryUserCollectCulture', {params: param}).then(res => res.data).then(data => {
            if (data.success) {
                let backData = data.backData;

                this.setState({
                    collectCulture: backData
                });
            } else {
                message.error(data.backMsg);
            }
            this.setState({loading: false});
        });
    }

    onStateChange = (item, index) => {
        const {stateList} = this.state;
        if (item.active) return;
        stateList.map(item => {
            item.active = false;
        });
        stateList[index].active = true;

        this.setState({
            stateList
        });
    }

    onDelete = (id, type) => {
        Modal.confirm({
            title: '删除',
            content: '确认删除吗？删除将不可恢复',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                let url;
                if (type === 'taste') url = deleteUrl;
                else if (type === 'art') url = delete2Url;
                else if (type === 'culture') url = delete3Url;
                const param = {};
                param.id = id;
                axios.post('culture/queryUserCollectCulture', param).then(res => res.data).then(data => {
                    if (data.success) {
                        message.success('删除成功！');
                        if (type === 'taste') {
                            const myPic = [...this.state.myPic].filter(item => item.id !== id);
                            this.setState({myPic});
                        } else if (type === 'art') {
                            const collectArt = [...this.state.collectArt].filter(item => item.id !== id);
                            this.setState({collectArt});
                        } else if (type === 'culture') {
                            const collectCulture = [...this.state.collectCulture].filter(item => item.id !== id);
                            this.setState({collectCulture});
                        }

                    } else {
                        message.error(data.backMsg);
                    }
                });
            }
        });
    }

    render() {
        const {loading, myPic, collectArt, collectCulture, likeTotal, stateList} = this.state;
        const activeState = _find(stateList, {active: true}).state;
        const filterPic = activeState !== null ? myPic.filter(item => item.state === activeState) : myPic;

        return (
            <div className='page-user bg-gray' style={{padding: '50px 0 30px'}}>
                <div className="page-content">
                    <div className='content user-bg'>
                        <Avatar size="large" src={localStorage.headimgurl}/>
                        <span className='nickname'>{localStorage.nickName}</span>
                        <span className='area'>{`${localStorage.province} · ${localStorage.city}`}</span>
                    </div>
                    <div className='content'>
                        <div className='user-info clearfix'>
                            <div className='zui-pull-right' style={{marginTop: 30, marginRight: 55}}>
                                <ul className='zui-unstyled inline'>
                                    <li style={{width: 100, textAlign: 'center'}}>
                                        <h1 style={{
                                            color: '#242121',
                                            fontSize: 20,
                                            lineHeight: '28px',
                                            fontWeight: 600
                                        }}>{likeTotal}</h1>
                                        <p style={{color: '#7B7B7B', fontSize: 14}}>点赞</p>
                                    </li>
                                    <li style={{width: 100, textAlign: 'center'}}>
                                        <h1 style={{
                                            color: '#242121',
                                            fontSize: 20,
                                            lineHeight: '28px',
                                            fontWeight: 600
                                        }}>{collectArt.length + collectCulture.length}</h1>
                                        <p style={{color: '#7B7B7B', fontSize: 14}}>收藏</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page-content" style={{marginTop: 20}}>
                    <div className="content">
                        <Tabs>
                            <TabPane tab="我的发布" key="1" style={{minHeight: 225}}>
                                <div className='state-group'>
                                    <span>状态</span>
                                    {
                                        stateList.map((item, index) => {
                                            return (
                                                <span key={index} className={item.active ? 'active-state' : null}
                                                      onClick={() => this.onStateChange(item, index)}>{item.label}</span>
                                            )
                                        })
                                    }
                                </div>
                                <Card loading={loading}>
                                    <div className='clearfix'>
                                        {
                                            filterPic.map(item => {
                                                return (
                                                    <div key={item.id} className='zui-card-item'>
                                                        <div className='zui-card-item-header'>
                                                            <Link to={'frame/picture/tasteDetail/' + item.id}>
                                                                <img
                                                                    src={item.tasteCover ? (restUrl.BASE_HOST + item.tasteCover.filePath) : null}/>
                                                            </Link>
                                                            {
                                                                item.state === 0 ?
                                                                    <span className='state-tip'>等待审核</span> : null
                                                            }
                                                        </div>
                                                        <div className='zui-card-item-content'>
                                                            <div>{item.tasteTitle}</div>
                                                            <div className='date'>{shiftDate(item.create_time)}</div>
                                                        </div>
                                                        <div className='zui-card-item-footer'>
                                                            <span><Icon type="star-o"/> {item.likeNum}</span>
                                                            <span style={{marginLeft: 35}}><Icon
                                                                type="message"/> {item.commentNum}</span>
                                                            <a className='delete'
                                                               onClick={() => this.onDelete(item.id, 'taste')}>删除</a>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </Card>
                            </TabPane>
                            <TabPane tab="我收藏的优品" key="2" style={{minHeight: 225}}>
                                <Card>
                                    <div className='clearfix'>
                                        {
                                            collectArt.length > 0 ? collectArt.map(item => {
                                                return (
                                                    <div key={item.id} className='zui-card-item'>
                                                        <div className='zui-card-item-header'>
                                                            <Link to={'frame/culture/artDetail/' + item.id}>
                                                                <img
                                                                    src={item.artCover ? (restUrl.BASE_HOST + item.artCover[0].filePath) : null}/>
                                                            </Link>
                                                        </div>
                                                        <div className='zui-card-item-content'>
                                                            <div>{item.artTitle}</div>
                                                            <div
                                                                className='price'>{'¥' + item.artMoney.toFixed(2)}</div>
                                                        </div>
                                                        <div className='zui-card-item-footer'>
                                                            <a className='delete'
                                                               onClick={() => this.onDelete(item.id, 'art')}>删除</a>
                                                        </div>
                                                    </div>
                                                )
                                            }) : (<div style={{marginTop: 65, textAlign: 'center'}}>
                                                <img src={empty}/>
                                                <p style={{
                                                    marginTop: 26,
                                                    fontSize: 12,
                                                    color: '#7B7B7B'
                                                }}>当前没有收藏，快去收藏吧~</p>
                                            </div>)
                                        }
                                    </div>
                                </Card>
                            </TabPane>
                            <TabPane tab="我收藏的民俗" key="3" style={{minHeight: 225}}>
                                {
                                    collectCulture.length > 0 ? (
                                        <List
                                            itemLayout="horizontal"
                                            size="large"
                                            dataSource={collectCulture}
                                            renderItem={item => (
                                                <List.Item
                                                    key={item.id}
                                                    actions={[<a
                                                        onClick={() => this.onDelete(item.id, 'culture')}>删除</a>]}
                                                    style={{padding: 30, backgroundColor: '#fff'}}
                                                >
                                                    <List.Item.Meta
                                                        title={<Link
                                                            to={'frame/culture/Detail/' + item.id}>{item.cultureTitle}</Link>}
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    ) : (<div style={{marginTop: 65, textAlign: 'center'}}>
                                        <img src={empty}/>
                                        <p style={{marginTop: 26, fontSize: 12, color: '#7B7B7B'}}>当前没有收藏，快去收藏吧~</p>
                                    </div>)
                                }
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
            </div>
        );
    }
}

Index.contextTypes = {
    router: PropTypes.object
}

export default Index;
