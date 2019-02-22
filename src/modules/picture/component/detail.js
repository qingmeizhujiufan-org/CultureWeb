import React from 'react';
import {Link} from 'react-router';
import PropTypes from 'prop-types';
import {Row, Col, Icon, message, Spin, Avatar} from 'antd';
import restUrl from 'RestUrl';
import {shiftDate} from "Utils/util";
import ZZComment from 'Comps/zzComment/';
import '../index.less';
import axios from "Utils/axios";

const queryCommentListUrl = 'taste/queryCommentList';
const addUrl = 'taste/add';

class Detail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: {},
            commentList: [],
            otherShow: [],
            ad_1: {},
            ad_2: {}
        };
    }

    componentWillMount = () => {
    }

    componentDidMount() {
        this.queryDetail(this.props.params.id);
        this.queryAdsense('taste_1');
        this.queryAdsense('taste_2');
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.id !== this.props.params.id) {
            this.queryDetail(nextProps.params.id);
        }
    }

    //获取图片详情
    queryDetail = id => {
        let param = {};
        param.id = id;
        this.setState({
            loading: true
        });
        axios.get('taste/queryDetail', {params: param}).then(res => res.data).then(data => {
            if (data.success) {
                data = data.backData;
                this.queryUserOtherPic(data.creator);

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

    //获取广告位
    queryAdsense = adsense => {
        const param = {};
        param.adsense = adsense;
        axios.get('ad/queryAdsense', {params: param}).then(res => res.data).then(data => {
            if (data.success && data.backData) {
                if (adsense === 'taste_1') {
                    this.setState({
                        ad_1: data.backData
                    });
                }
                if (adsense === 'taste_2') {
                    this.setState({
                        ad_2: data.backData
                    });
                }
            }
        });
    }

    handleCommentList = commentList => {
        this.setState({commentList});
    }

    queryUserOtherPic = userId => {
        const param = {};
        param.userId = userId;
        param.tasteId = this.props.params.id;
        axios.get('taste/queryUserOtherPic', {params: param}).then(res => res.data).then(data => {
            if (data.success) {
                this.setState({
                    otherShow: data.backData
                });
            } else {
                message.error(data.backMsg);
            }
        });
    }

    render() {
        const {loading, data, commentList, otherShow, ad_1, ad_2} = this.state;

        return (
            <div className='page-picture-detail'>
                <Spin spinning={loading} size={"large"}>
                    <div className="page-content" style={{borderBottom: '1px solid #EAEAEA'}}>
                        <div className="content">
                            <Row type='flex' justify="space-between" align="middle" style={{height: 140}}>
                                <Col span={16}>
                                    <div className='base-info'>
                                        <h1 className="title">{data.tasteTitle}</h1>
                                        <span
                                            className="date">{data.create_time ? shiftDate(data.create_time) + '发布' : null}</span>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div style={{textAlign: 'right'}}>
                                        <span style={{marginRight: 30}}>
                                            <Avatar
                                                icon='user'
                                                src={(data.avatar && data.avatar.filePath) ? restUrl.BASE_HOST + data.avatar.filePath : null}
                                            /> {data.creatorName}
                                        </span>
                                        <span style={{marginRight: 30}}><Icon
                                            type="message"/> {commentList.length}</span>
                                        <span><Icon type="heart-o"/> {data.likeNum}</span>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <div className='page-content'>
                        <div className='content'>
                            <Row type='flex' justify="space-between" align="top" style={{marginTop: 50}}>
                                <Col style={{width: 900}}>
                                    <div
                                        style={{
                                            width: 900,
                                            margin: '25px 0',
                                            textAlign: 'center',
                                            backgroundColor: '#f5f5f5'
                                        }}>
                                        <img src={data.tasteCover ? restUrl.BASE_HOST + data.tasteCover.filePath : ''}
                                             style={{maxWidth: '100%'}}/>
                                    </div>
                                    <p style={{fontSize: 14, color: '#7D7D7D'}}>{data.tasteBrief}</p>
                                    <ZZComment
                                        avatar={data.avatar ? restUrl.BASE_HOST + data.avatar.filePath : null}
                                        queryUrl={queryCommentListUrl}
                                        saveUrl={addUrl}
                                        queryParams={{tasteId: this.props.params.id}}
                                        commentList={this.handleCommentList}
                                    />
                                </Col>
                                <Col>
                                    {/* 广告位 */}
                                    {
                                        (ad_1.adCover && ad_1.adCover.filePath) ? (
                                            <div className='ad'>
                                                <a href={ad_1.adLink} target='_blank'>
                                                    <img
                                                        src={restUrl.BASE_HOST + ad_1.adCover.filePath}/>
                                                </a>
                                            </div>
                                        ) : null
                                    }
                                    {
                                        (ad_2.adCover && ad_2.adCover.filePath) ? (
                                            <div className='ad'>
                                                <a href={ad_2.adLink} target='_blank'>
                                                    <img
                                                        src={restUrl.BASE_HOST + ad_2.adCover.filePath}/>
                                                </a>
                                            </div>
                                        ) : null
                                    }
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <div className='page-content' style={{backgroundColor: '#FAFAFA'}}>
                        <div className='content' style={{backgroundColor: 'transparent'}}>
                            <div style={{
                                fontSize: 16,
                                color: '#666',
                                lineHeight: '66px',
                                borderBottom: '1px solid #dedede',
                                textAlign: 'center'
                            }}>他最近的其他发布
                            </div>
                            <Row type="flex" justify="space-between" align='top' className="grid">
                                {
                                    otherShow.map((item, index) => {
                                        return (
                                            <Col key={item.id + index} className="grid-item">
                                                <Link to={`frame/picture/detail/${item.id}`} target='_blank'>
                                                    <img src={restUrl.BASE_HOST + item.tasteCover.filePath}/>
                                                    <div className='info'>
                                                        <div className='creator'>
                                                            <Row type="flex" justify="space-between">
                                                                <Col span={11} offset={1}>
                                                                    <Avatar
                                                                        style={{
                                                                            marginRight: 5,
                                                                            verticalAlign: '-7px',
                                                                        }}
                                                                        size="small"
                                                                        icon='user'
                                                                        src={(item.avatar && item.avatar.filePath) ? restUrl.BASE_HOST + item.avatar.filePath : null}
                                                                    /> {item.creatorName}
                                                                </Col>
                                                                <Col span={11}>
                                                                    <div
                                                                        className="date">{shiftDate(item.create_time)}</div>
                                                                </Col>
                                                                <Col span={1}/>
                                                            </Row>
                                                        </div>
                                                        <div className='extra'>
                                                            <Row>
                                                                <Col span={8} offset={1}>
                                                                    <Icon type="heart-o"/>
                                                                    <span>{item.likeNum}</span>
                                                                </Col>
                                                                <Col span={8}>
                                                                    <Icon type="message"/>
                                                                    <span>{item.commentNum}</span>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </Col>
                                        )
                                    })
                                }
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