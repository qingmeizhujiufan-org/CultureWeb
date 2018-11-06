import React from 'react';
import PropTypes from 'prop-types';
import {Icon, Spin} from 'antd';
import draftToHtml from 'draftjs-to-html';
import '../index.less';
import axios from "Utils/axios";

class Detail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: {}
        };
    }

    componentWillMount = () => {
    }

    componentDidMount() {
        this.queryDetail();
    }

    //获取球馆详情
    queryDetail = () => {
        let param = {};
        param.id = this.props.params.id;
        this.setState({
            loading: true
        });
        axios.get('news/queryDetail', {params: param}).then(res => res.data).then(data => {
            if (data.success) {
                data = data.backData;
                if (data.newsContent && data.newsContent !== '') {
                    data.newsContent = JSON.parse(data.newsContent);
                    data.contentHtml = draftToHtml(data.newsContent);
                    this.setState({
                        data
                    });
                }
            } else {
                message.error(data.backMsg);
            }

            this.setState({
                loading: false
            });
        });
    }

    render() {
        const {loading, data} = this.state;

        return (
            <div className='page-news'>
                <div className="page-content">
                    <div className="content">
                        <Spin spinning={loading} size={"large"}>
                            <div className="wrap-html">
                                <h1 className="title">{data.newsTitle}</h1>
                                <p style={{marginBottom: 50}}>
                                    <span
                                        className="date">{data.create_time ? data.create_time.substring(0, 10) : null}</span>
                                    <span><Icon type="eye-o"/> {data.readNum}人</span>
                                </p>
                                <div dangerouslySetInnerHTML={{__html: data.contentHtml}}></div>
                            </div>
                        </Spin>
                    </div>
                </div>
            </div>
        );
    }
}

Detail.contextTypes = {
    router: PropTypes.object
}

export default Detail;