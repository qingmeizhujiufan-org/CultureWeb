import React from 'react';
import {Link} from 'react-router';
import PropTypes from 'prop-types';
import {
    Row,
    Col,
    Input,
    Icon,
    BackTop
} from 'antd';
import restUrl from 'RestUrl';
import ZZCardList from "Comps/zzCardList";
import '../index.less';
import videoLogo from 'Img/video-logo.png';

const Search = Input.Search;

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            conditionText: '',
        };
    }

    componentWillMount = () => {
        if (sessionStorage.searchOption === 'news') {
            this.setState({conditionText: sessionStorage.searchValue});
        }
    }

    componentDidMount = () => {
    }

    onSearch = value => {
        sessionStorage.clear();
        const {conditionText} = this.state;
        if (value === conditionText) return;

        this.setState({
            loading: true,
            conditionText: value
        });
    }

    renderItem = item => {
        return (
            <div key={item.id} className='zui-card-item'>
                <Link to={'frame/video/detail/' + item.id}>
                    <div className='zui-card-item-header'>
                        <img src={item.videoCover ? (restUrl.BASE_HOST + item.videoCover.filePath) : null}/>
                        <span className='title'><span className='iconfont icon-bofang'></span>{item.videoTitle}</span>
                        <span className='sub-title'>{item.videoBrief}</span>
                        <span className='mask'></span>
                    </div>
                    <div className='zui-card-item-footer'>
                        <span><Icon type="eye-o"/> {item.readNum}人</span>
                    </div>
                </Link>
            </div>
        );
    }

    render() {
        const {conditionText} = this.state;

        return (
            <div className='page-video'>
                <div className="page-content video-bg">
                    <Row type="flex" justify="center" align="middle" style={{paddingTop: 60}}>
                        <Col>
                            <span style={{marginRight: 15}}><img src={videoLogo}/></span>
                        </Col>
                        <Col>
                            <Search
                                placeholder="请输入搜索的内容"
                                enterButton={<span><Icon type="search"/> 搜索</span>}
                                size="large"
                                onSearch={value => this.onSearch(value)}
                                style={{width: 600}}
                            />
                        </Col>
                    </Row>
                </div>
                <div className="page-content">
                    <div className="content">
                        <ZZCardList
                            renderItem={this.renderItem}
                            queryUrl='video/queryList'
                            queryParams={{
                                conditionText: conditionText
                            }}
                        />
                    </div>
                </div>
                <BackTop>
                    <div className="zui-up"><Icon type="up"/></div>
                </BackTop>
            </div>
        );
    }
}

Index.contextTypes = {
    router: PropTypes.object
}

export default Index;