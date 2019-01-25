import React from 'react';
import PropTypes from 'prop-types';
import {
    Row,
    Col,
    Input,
    Icon,
    Button,
    Spin,
    message,
    Upload,
    Modal,
    Avatar,
    Steps,
    Form,
    Tooltip
} from 'antd';
import imagesLoaded from 'imagesLoaded';
import Masonry from 'masonry-layout';
import InfiniteScroll from 'react-infinite-scroller';
import restUrl from 'RestUrl';
import axios from "Utils/axios";
import {shiftDate, reverseToDate} from "Utils/util";
import '../index.less';

const Dragger = Upload.Dragger;
const {TextArea} = Input;
const Step = Steps.Step;
const FormItem = Form.Item;

const steps = [{
    title: '上传预览',
}, {
    title: '上传成功',
}, {
    title: '等待审核',
}];

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
}

class Picture extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dataSource: [],
            pageNumber: 1,
            total: 0,
            loading: false,
            submitLoading: false,
            current: -1,
            fileList: [],
            visible: false,
            hasMore: true,
            previewVisible: false,
            previewImage: '',
            showUploadList: true
        };
    }

    componentWillMount = () => {
    }

    componentDidMount() {
        this.queryList(data => {
            this.setState({
                dataSource: data.backData,
                total: data.total
            });

            this.imagesLoad();
        });
    }

    imagesLoad = () => {
        var imgLoad = imagesLoaded('#container', function () {
            // 图片加载后执行的方法
            var grid = document.querySelector('.grid');
            var msnry = new Masonry(grid, {
                columnWidth: 228,
                itemSelector: '.grid-item',     // 要布局的网格元素
                gutter: 15,                    // 网格间水平方向边距，垂直方向边距使用css的margin-bottom设置
                percentPosition: false,           // 使用columnWidth对应元素的百分比尺寸
                stamp: '.grid-stamp',             // 网格中的固定元素，不会因重新布局改变位置，移动元素填充到固定元素下方
                fitWidth: true,                  // 设置网格容器宽度等于网格宽度，这样配合css的auto margin实现居中显示
                originLeft: true,                // 默认true网格左对齐，设为false变为右对齐
                originTop: true,                 // 默认true网格对齐顶部，设为false对齐底部
                containerStyle: {
                    position: 'relative'
                },     // 设置容器样式
                transitionDuration: '0.5s',      // 改变位置或变为显示后，重布局变换的持续时间，时间格式为css的时间格式
                stagger: '0.03s',                // 重布局时网格并不是一起变换的，排在后面的网格比前一个延迟开始，该项设置延迟时间
                resize: true,                  // 改变窗口大小将不会影响布局
                initLayout: true,                // 初始化布局，设未true可手动初试化布局
            });
        });
    }

    queryList = (callback) => {
        const param = {};
        param.userId = localStorage.userId ? localStorage.userId : '';
        param.pageNumber = this.state.pageNumber;
        param.pageSize = 10;
        axios.get('taste/queryList', {params: param}).then(res => res.data).then(data => {
            if (data.success) {
                if (typeof callback === 'function') callback(data);
            } else {
                message.error(data.backMsg);
            }
        })
    }

    handleInfiniteOnLoad = () => {
        let {dataSource, pageNumber, total} = this.state;

        if (dataSource.length >= total) {
            this.setState({
                hasMore: false,
                loading: false,
            });

            return false;
        }

        this.setState({
            loading: true,
            pageNumber: ++pageNumber
        }, () => {
            this.queryList((data) => {
                const _data = dataSource.concat(data.backData);
                this.setState({
                    dataSource: _data,
                    loading: false,
                });

                this.imagesLoad();
            });
        });
    }

    showPublishModal = () => {
        if (!localStorage.userId) {
            message.warn('抱歉！您还未登录，请登录后再发布');
            return;
        }
        this.setState({
            visible: true,
        });
    }

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    beforeUpload = (file) => {
        const isLt5M = file.size / 1024 / 1024 < 1;
        if (!isLt5M) {
            message.error('图片大小不能超过5M');
            this.setState({
                showUploadList: false
            });
        }
        return isLt5M;
    }

    handleChange = ({file, fileList}) => {
        console.log('fileList ==== ', fileList);
        if (fileList.length === 0) {
            this.setState({
                fileList
            });
        }
        if (fileList && fileList[0].status === "done") {
            getBase64(file.originFileObj, imageUrl => {
                fileList[0].thumbUrl = imageUrl;
                this.setState({
                    fileList,
                    current: 0
                });
            });
        }
    }

    normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.tasteCover = values.tasteCover.map(item => {
                    return item.response.data.id;
                }).join(',');
                values.creator = localStorage.userId;
                this.setState({submitLoading: true});
                axios.post('taste/save', values).then(res => res.data).then(data => {
                    if (data.success) {
                        message.success('上传图片成功');
                        this.setState({
                            submitLoading: false,
                            current: 1
                        });
                    } else {
                        message.error('上传图片失败');
                    }
                });
            }
        });
    }

    handleCancel = () => {
        this.setState({visible: false});
    }

    handlePreviewCancel = () => this.setState({previewVisible: false})

    collect = (obj, index) => {
        if (!localStorage.userId) {
            message.warn('抱歉！您还未登录，请登录后再收藏');
            return;
        }
        const param = {};
        param.tasteId = obj.id;
        param.userId = localStorage.userId;
        axios.post('taste/collect', param).then(res => res.data).then(data => {
            if (data.success) {
                const dataSource = this.state.dataSource;
                const isLike = obj.isLike;
                dataSource[index].isLike = !isLike;
                if (isLike) {
                    dataSource[index].likeNum -= 1;
                    message.success('已取消点赞');
                } else {
                    dataSource[index].likeNum += 1;
                    message.success('成功点赞!');
                }

                this.setState({
                    dataSource
                });
            } else {
                message.error(data.backMsg);
            }
        })
    }

    showDetail = id => {
        this.context.router.push('/frame/picture/detail/' + id);
    }

    render() {
        const {dataSource, visible, current, fileList, hasMore, loading, submitLoading, previewImage, previewVisible, showUploadList} = this.state;
        const {getFieldDecorator, getFieldsValue} = this.props.form;
        const value = getFieldsValue();

        return (
            <div className='page-picture'>
                <div className="page-content">
                    <div style={{backgroundColor: '#fff'}}>
                        <div className='clearfix'
                             style={{width: 1200, height: 92, margin: '0 auto', lineHeight: '92px'}}>
                            <div className='zui-pull-left' style={{color: '#170202', fontSize: 20}}>图片展示 / 兴趣圈</div>
                            <div className='zui-pull-right'>
                                <Button type="primary" icon="rocket" className="zui-btn"
                                        onClick={() => this.showPublishModal()}>我要发布</Button>
                                <Modal
                                    visible={visible}
                                    title="发布流程"
                                    width={720}
                                    wrapClassName='zui-modal'
                                    maskStyle={{
                                        background: 'rgba(237,236,234, 0.5373)'
                                    }}
                                    destroyOnClose={true}
                                    onOk={this.handleOk}
                                    onCancel={this.handleCancel}
                                    footer={null}
                                >
                                    {
                                        current === -1 ? (
                                            <Dragger
                                                accept='.jpg,.jpeg,.png'
                                                action={restUrl.UPLOAD}
                                                showUploadList={showUploadList}
                                                onChange={this.handleChange}
                                                beforeUpload={this.beforeUpload}
                                            >
                                                <p className="ant-upload-drag-icon">
                                                    <Button className='zui-btn'>上传美图</Button>
                                                </p>
                                                <p style={{
                                                    marginTop: 24,
                                                    fontSize: 14,
                                                    color: '#170202'
                                                }}>也可拖拽图片到该区域上传</p>
                                                <p style={{
                                                    marginTop: 11,
                                                    fontSize: 12,
                                                    color: '#7D7D7D'
                                                }}>支持单张 5m 以内图片上传</p>
                                                <p style={{
                                                    marginTop: 40,
                                                    fontSize: 12,
                                                    color: '#7D7D7D'
                                                }}>提示：请严格遵守保密法律法规，严谨在互联网上储存、处理、传输、发布泄密、违法信息</p>
                                            </Dragger>
                                        ) : null
                                    }
                                    {
                                        current > -1 ? (
                                            <Steps current={current}>
                                                {steps.map(item => <Step key={item.title} title={item.title}/>)}
                                            </Steps>
                                        ) : null
                                    }
                                    {
                                        current === 0 ? (
                                            <div style={{marginTop: 50}}>
                                                <Form onSubmit={this.handleSubmit}>
                                                    <Row>
                                                        <Col span={10}>
                                                            <FormItem
                                                            >
                                                                {getFieldDecorator('tasteCover', {
                                                                    valuePropName: 'fileList',
                                                                    getValueFromEvent: this.normFile,
                                                                    rules: [{required: true, message: '图片不能为空!'}],
                                                                    initialValue: fileList
                                                                })(
                                                                    <Upload
                                                                        accept='.jpg,.jpeg,.png'
                                                                        action={restUrl.UPLOAD}
                                                                        listType="picture-card"
                                                                        onPreview={this.handlePreview}
                                                                        onChange={this.handleChange}
                                                                        beforeUpload={this.beforeUpload}
                                                                        className='zui-upload-picture-card'
                                                                    >
                                                                        {fileList.length >= 1 ? null : (<div>
                                                                            <Icon type="plus"/>
                                                                            <div className="ant-upload-text">重新上传
                                                                            </div>
                                                                        </div>)}
                                                                    </Upload>
                                                                )}
                                                            </FormItem>
                                                        </Col>
                                                        <Col span={14}>
                                                            <FormItem
                                                            >
                                                                {getFieldDecorator('tasteTitle', {
                                                                    rules: [{required: true, message: '标题不能为空!'}]
                                                                })(
                                                                    <Input placeholder="请输入标题"/>
                                                                )}
                                                            </FormItem>
                                                            <FormItem
                                                            >
                                                                {getFieldDecorator('tasteBrief', {
                                                                    rules: [{required: true, message: '心情不能为空!'}]
                                                                })(
                                                                    <TextArea rows={6} placeholder="请输入心情"/>
                                                                )}
                                                            </FormItem>
                                                        </Col>
                                                    </Row>
                                                    <div style={{textAlign: 'center'}}>
                                                        <Button
                                                            className='zui-btn'
                                                            type='primary'
                                                            loading={submitLoading}
                                                            htmlType="submit"

                                                        >上传美图</Button>
                                                    </div>
                                                </Form>
                                            </div>
                                        ) : null
                                    }
                                    {
                                        current === 1 ? (
                                            <div>
                                                <div style={{
                                                    margin: '48px 0',
                                                    padding: 18,
                                                    border: '1px solid #DCDCDC',
                                                    borderRadius: 2
                                                }}>
                                                    <Row type='flex' justify="space-between" align="middle">
                                                        <Col span={10}>
                                                            <div>
                                                                <img src={value.tasteCover[0].thumbUrl} width={90}
                                                                     height={80} style={{float: 'left'}}/>
                                                                <div style={{marginLeft: 100, overflow: 'hidden'}}>
                                                                    <div
                                                                        style={{color: '#170202'}}>{value.tasteCover[0].name}</div>
                                                                    <div style={{
                                                                        color: '#7D7D7D',
                                                                        fontSize: 12
                                                                    }}>{reverseToDate(value.tasteCover[0].lastModified)}</div>
                                                                    <div style={{
                                                                        color: '#7D7D7D',
                                                                        fontSize: 12
                                                                    }}>{'大小: ' + (value.tasteCover[0].size / 1024).toFixed(2) + 'KB'}</div>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col span={10}>
                                                            <div style={{float: 'right'}}>
                                                                <div style={{
                                                                    fontSize: 14,
                                                                    color: '#170202'
                                                                }}>{value.tasteTitle}</div>
                                                                <div>{value.tasteBrief}</div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                                <div style={{fontSize: 18, color: '#170202', textAlign: 'center'}}>
                                                    <div>您上传的美图正在进行审核</div>
                                                    <div>（请到“我的发布查看审核结果）</div>
                                                    <Button type='primary' className='zui-btn'
                                                            href={'/#/frame/personal'}
                                                            style={{marginTop: 38}}>查看我的发布</Button>
                                                </div>
                                                <p style={{
                                                    marginTop: 40,
                                                    fontSize: 12,
                                                    color: '#7D7D7D'
                                                }}>提示：请严格遵守保密法律法规，严谨在互联网上储存、处理、传输、发布泄密、违法信息</p>
                                                {/*<div style={{*/}
                                                {/*marginTop: 50,*/}
                                                {/*textAlign: 'center',*/}
                                                {/*color: '#11A00A',*/}
                                                {/*fontSize: 18*/}
                                                {/*}}>*/}
                                                {/*<Icon type="check-circle-o"*/}
                                                {/*style={{fontSize: 24, verticalAlign: 'text-bottom'}}/> 上传成功！*/}
                                                {/*</div>*/}
                                            </div>
                                        ) : null
                                    }
                                </Modal>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page-content bg-gray">
                    <div className="content bg-ghost" style={{paddingTop: 15}}>
                        <InfiniteScroll
                            initialLoad={false}
                            pageStart={0}
                            loadMore={() => this.handleInfiniteOnLoad()}
                            hasMore={!loading && hasMore}
                            threshold={250}
                        >
                            <div className="grid" id="container">
                                {
                                    dataSource.map((item, index) => {
                                        return (
                                            <div key={item.id + index} className="grid-item">
                                                <div className='wrap-img'>
                                                    <img src={restUrl.BASE_HOST + item.tasteCover.filePath}
                                                         onClick={() => this.showDetail(item.id)}/>
                                                </div>
                                                <div className='info'>
                                                    <div className='creator'>
                                                        <Row type="flex" justify="space-between">
                                                            <Col span={15} offset={1}>
                                                                <div className='creator-info'>
                                                                    <Avatar
                                                                        style={{
                                                                            marginRight: 5,
                                                                            verticalAlign: '-7px',
                                                                        }}
                                                                        size="small"
                                                                        icon='user'
                                                                        src={item.headimgurl ? item.headimgurl : null}
                                                                    /> {item.creatorName}
                                                                </div>
                                                            </Col>
                                                            <Col span={7}>
                                                                <div
                                                                    className="date">{shiftDate(item.create_time)}</div>
                                                            </Col>
                                                            <Col span={1}/>
                                                        </Row>
                                                    </div>
                                                    <div className='extra'>
                                                        {
                                                            item.tasteBrief ? (
                                                                <div
                                                                    className='zui-ellipsis-2'
                                                                    style={{
                                                                        padding: 18,
                                                                        fontSize: 12,
                                                                        lineHeight: '25px'
                                                                    }}>{item.tasteBrief}</div>
                                                            ) : null
                                                        }
                                                        <Row>
                                                            <Col span={8} offset={1}>
                                                                <Tooltip placement="top"
                                                                         title={item.isLike ? "取消点赞" : "点赞"}>
                                                                    <Icon
                                                                        type={item.isLike ? "heart" : "heart-o"}
                                                                        onClick={() => this.collect(item, index)}
                                                                        style={{
                                                                            cursor: 'pointer',
                                                                            color: item.isLike ? '#FF7979' : ''
                                                                        }}
                                                                    />
                                                                </Tooltip>
                                                                <span>{item.likeNum}</span>
                                                            </Col>
                                                            <Col span={8}>
                                                                <Icon type="message"/>
                                                                <span>{item.commentNum}</span>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                                {
                                    loading && hasMore && (
                                        <div className="loading-container">
                                            <Spin/>
                                        </div>
                                    )
                                }
                            </div>
                        </InfiniteScroll>
                        {
                            !hasMore && (
                                <div className="no-more">你已经刷到底线了~</div>
                            )
                        }
                    </div>
                </div>
                <Modal visible={previewVisible} footer={null} onCancel={this.handlePreviewCancel}>
                    <img style={{width: '100%'}} src={previewImage}/>
                </Modal>
            </div>
        );
    }
}

const WrappePicture = Form.create()(Picture);
Picture.contextTypes = {
    router: PropTypes.object
}

export default WrappePicture;
