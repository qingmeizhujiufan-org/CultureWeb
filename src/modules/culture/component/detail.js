import React from 'react';
import {Link} from 'react-router';
import PropTypes from 'prop-types';
import {Row, Col, Icon, message, Spin, Breadcrumb, Avatar} from 'antd';
import draftToHtml from 'draftjs-to-html';
import restUrl from 'RestUrl';
import '../index.less';
import {shiftDate} from "Utils/util";
import top5 from 'Img/top5.png';
import ZZComment from 'Comps/zzComment/';
import axios from "Utils/axios";

const queryCommentListUrl = restUrl.ADDR + 'culture/queryCommentList';
const addUrl = restUrl.ADDR + 'culture/add';

class Detail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: {},
            recommendList: [],
            ad: {}
        };
    }

    componentWillMount = () => {
    }

    componentDidMount() {
        this.queryDetail(this.props.params.id);
        this.queryRecommendTop5();
        this.queryAdsense();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.id !== this.props.params.id) {
            this.queryDetail(nextProps.params.id);
        }
    }

    //获取文化详情
    queryDetail = id => {
        let param = {};
        param.id = id;
        this.setState({
            loading: true
        });
        axios.get('culture/queryDetail', {params: param}).then(res => res.data).then(data => {
            if (data.success) {
                data = data.backData;
                if (data.cultureContent && data.cultureContent !== '') {
                    data.cultureContent = JSON.parse(data.cultureContent);
                    data.contentHtml = draftToHtml(data.cultureContent);
                }
                this.setState({
                    data
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
    queryRecommendTop5 = () => {
        this.setState({
            recommendLoading: true
        });
        axios.get('culture/queryRecommendTop5').then(res => res.data).then(data => {
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

    //获取广告位
    queryAdsense = () => {
        const param = {};
        param.adsense = 'culture_1';
        axios.get('ad/queryAdsense', {params: param}).then(res => res.data).then(data => {
            if (data.success && data.backData) {
                this.setState({
                    ad: data.backData
                });
            }
        });
    }

    collect = () => {
        const param = {};
        param.cultureId = this.props.params.id;
        param.userId = 'fd6dd05d-4b9a-48a2-907a-16743a5125dd';
        axios.post('culture/collect', param).then(res => res.data).then(data => {
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
        const {loading, data, recommendList, ad} = this.state;

        return (
            <div className='page-culture-detail'>
                <Spin spinning={loading} size={"large"}>
                    <div className="page-content" style={{borderBottom: '1px solid #EAEAEA'}}>
                        <div className="content">
                            <Row type='flex' justify="space-between" align="middle" style={{height: 140}}>
                                <Col span={16}>
                                    <div className='base-info'>
                                        <Breadcrumb separator=">" className='zui-breadcrumb'>
                                            <Breadcrumb.Item
                                                href="#/frame/culture/list/1">风土人情</Breadcrumb.Item>
                                            <Breadcrumb.Item>{data.cityName}</Breadcrumb.Item>
                                        </Breadcrumb>
                                        <h1 className="title">{data.cultureTitle}</h1>
                                        <span
                                            className="date">{data.create_time ? shiftDate(data.create_time) + '发布' : null}</span>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div style={{textAlign: 'right', lineHeight: '24px'}}>
                                        <span style={{marginRight: 75, verticalAlign: 'sub', cursor: 'pointer'}}
                                              onClick={() => this.scrollToAnchor('comment')}>
                                            <Icon type="form" style={{
                                                marginRight: 10,
                                                fontSize: 24,
                                                color: '#FFA600',
                                                verticalAlign: 'sub',
                                            }}/>评论
                                        </span>
                                        <span style={{verticalAlign: 'sub', cursor: 'pointer'}}
                                              onClick={() => this.collect()}>
                                            <Icon
                                                type={data.isCollect ? "star" : "star-o"}
                                                style={{
                                                    marginRight: 10,
                                                    fontSize: 24,
                                                    color: '#FFA600',
                                                    verticalAlign: 'sub'
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
                                    <div className="wrap-html" style={{marginTop: 0}}>
                                        <div dangerouslySetInnerHTML={{__html: data.contentHtml}}></div>
                                    </div>
                                    <ZZComment
                                        id='comment'
                                        queryUrl={queryCommentListUrl}
                                        saveUrl={addUrl}
                                        queryParams={{cultureId: this.props.params.id}}
                                    />
                                </Col>
                                <Col>
                                    <div className='top5'>
                                        <h1 className='title'><img src={top5}/></h1>
                                        <div className='recommend-list'>
                                            {
                                                recommendList.map((item, index) => {
                                                    return (
                                                        <Row key={index}>
                                                            <Col span={2}>
                                                                <i>{index + 1}、</i>
                                                            </Col>
                                                            <Col span={22}>
                                                                <div className='zui-ellipsis'><Link
                                                                    to={`/frame/culture/detail/${item.id}`}>{item.cultureTitle}</Link>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                    {/* 广告位 */}
                                    {(ad.adCover && ad.adCover.filePath) ? (
                                        <div className='ad'>
                                            <a href={ad.adLink} target='_blank'>
                                                <img
                                                    src={restUrl.BASE_HOST + ad.adCover.filePath}/>
                                            </a>
                                        </div>
                                    ) : null
                                    }
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Spin>
            </div>
        );
    }
}

Detail.contextTypes = {
    router: PropTypes.object
}

export default Detail;
