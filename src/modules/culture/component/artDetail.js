import React from 'react';
import {Link} from 'react-router';
import PropTypes from 'prop-types';
import {Row, Col, Icon, message, Spin, Breadcrumb} from 'antd';
import restUrl from 'RestUrl';
import '../index.less';
import {shiftDate} from "Utils/util";
import ZZComment from 'Comps/zzComment/';
import draftToHtml from "draftjs-to-html";
import axios from "Utils/axios";

const queryCommentListUrl = restUrl.ADDR + 'art/queryCommentList';
const addUrl = restUrl.ADDR + 'art/add';

class ArtDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            recommendLoading: false,
            data: {},
            recommendList: [],
            currentPreview: {}
        };
    }

    componentWillMount = () => {
    }

    componentDidMount() {
        this.queryDetail(this.props.params.id);
        this.queryRecommendTop3();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.id !== this.props.params.id) {
            this.queryDetail(nextProps.params.id);
        }
    }

    //获取艺术品详情
    queryDetail = id => {
        let param = {};
        param.id = id;
        this.setState({
            loading: true
        });
        axios.get('art/queryDetail', {params: param}).then(res => res.data).then(data => {
            if (data.success) {
                data = data.backData;
                data.artCover.map(item => {
                    item.active = false;
                });
                data.artCover[0].active = true;
                if (data.artContent && data.artContent !== '') {
                    data.artContent = JSON.parse(data.artContent);
                    data.contentHtml = draftToHtml(data.artContent);
                }
                this.setState({
                    data,
                    currentPreview: data.artCover[0]
                });
            } else {
                message.error(data.backMsg);
            }

            this.setState({
                loading: false
            });
        });
    }

    //获取Top3 推荐
    queryRecommendTop3 = () => {
        this.setState({
            recommendLoading: true
        });
        axios.get('art/queryRecommendTop3').then(res => res.data).then(data => {
            if (data.success) {
                data = data.backData;
                this.setState({
                    recommendList: data
                });
            } else {
                message.error(data.backMsg);
            }

            this.setState({
                recommendLoading: false
            });
        });
    }

    collect = () => {
        if (localStorage.userId) {
            const param = {};
            param.artId = this.props.params.id;
            param.userId = localStorage.userId;
            axios.post('art/collect', param).then(res => res.data).then(data => {
                if (data.success) {
                    const data = this.state.data;
                    const isCollect = data.isCollect;
                    data.isCollect = !isCollect;
                    if (isCollect) {
                        message.success('已取消收藏');
                    } else {
                        message.success('已收藏');
                    }

                    this.setState({
                        data
                    });
                } else {
                    message.error(data.backMsg);
                }
            })
        } else {
            message.warn('请先登录');
        }
    }

    scrollToAnchor = anchorName => {
        if (anchorName) {
            // 找到锚点
            let anchorElement = document.getElementById(anchorName);
            // 如果对应id的锚点存在，就跳转到锚点
            if (anchorElement) {
                anchorElement.scrollIntoView({
                    block: 'start',
                    behavior: 'smooth'
                });
            }
        }
    }

    render() {
        const {loading, recommendLoading, data, recommendList} = this.state;

        return (
            <div className='page-culture-artdetail'>
                <Spin spinning={loading} size={"large"}>
                    <div className="page-content" style={{borderBottom: '1px solid #EAEAEA'}}>
                        <div className="content">
                            <Row type='flex' justify="space-between" align="middle" style={{height: 140}}>
                                <Col span={16}>
                                    <div className='base-info'>
                                        <Breadcrumb separator=">" className='zui-breadcrumb'>
                                            <Breadcrumb.Item
                                                href="#/frame/culture/list/2">美食特产</Breadcrumb.Item>
                                            <Breadcrumb.Item>{data.cityName}</Breadcrumb.Item>
                                        </Breadcrumb>
                                        <h1 className="title">{data.artTitle}</h1>
                                        <span
                                            className="date">{data.create_time ? shiftDate(data.create_time) + '发布' : null}</span>
                                        <span className='read-info' style={{marginLeft: 20}}><Icon
                                            type="eye-o"/> {data.readNum}人</span>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div style={{textAlign: 'right', lineHeight: '24px'}}>
                                        <span style={{marginRight: 75, verticalAlign: 'bottom', cursor: 'pointer'}}
                                              onClick={() => this.scrollToAnchor('comment')}>
                                            <Icon type="form" style={{
                                                marginRight: 10,
                                                fontSize: 24,
                                                color: '#FFA600',
                                                verticalAlign: 'bottom',
                                            }}/>评论
                                        </span>
                                        <span style={{verticalAlign: 'bottom', cursor: 'pointer'}}
                                              onClick={() => this.collect()}>
                                            <Icon
                                                type={data.isCollect ? "star" : "star-o"}
                                                style={{
                                                    marginRight: 10,
                                                    fontSize: 24,
                                                    color: '#FFA600',
                                                    verticalAlign: 'bottom'
                                                }}/>收藏
                                        </span>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <div className="page-content">
                        <div className="content">
                            <Row type='flex' justify="space-between" align="top" style={{marginTop: 50}}>
                                <Col style={{width: 900}}>
                                    <div className="wrap-html">
                                        <div dangerouslySetInnerHTML={{__html: data.contentHtml}}></div>
                                    </div>
                                    <ZZComment
                                        id='comment'
                                        queryUrl={queryCommentListUrl}
                                        saveUrl={addUrl}
                                        queryParams={{artId: this.props.params.id}}
                                    />
                                </Col>
                                <Col>
                                    <div className='other-ad'>
                                        <h1 className='title'>其他推荐</h1>
                                        <div className='recommend-list'>
                                            <Spin spinning={recommendLoading}>
                                                {
                                                    recommendList.map(item => {
                                                        return (
                                                            <div key={item.id} className='zui-card-item'>
                                                                <Link to={'frame/culture/artDetail/' + item.id}>
                                                                    <div className='zui-card-item-header'>
                                                                        <img
                                                                            src={item.artCover ? (restUrl.BASE_HOST + item.artCover[0].filePath) : null}/>
                                                                    </div>
                                                                    <div className='zui-card-item-content'>
                                                                        <div
                                                                            className='zui-ellipsis'>{item.artTitle}</div>
                                                                        <div
                                                                            className='price'>{item.artMoney ? `¥${item.artMoney.toFixed(2)}` : '¥--'}</div>
                                                                    </div>
                                                                    <div className='zui-card-item-footer'>
                                                                        <span><Icon
                                                                            type="eye-o"/> {item.readNum}人</span>
                                                                        <span style={{marginLeft: 35}}><Icon
                                                                            type="star-o"/> {item.collectNum}人</span>
                                                                    </div>
                                                                </Link>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </Spin>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Spin>
            </div>
        );
    }
}

ArtDetail.contextTypes = {
    router: PropTypes.object
}

export default ArtDetail;