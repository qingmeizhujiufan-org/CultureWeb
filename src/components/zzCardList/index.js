import React from 'react';
import {Icon, Button, message, Spin} from 'antd';
import _assign from 'lodash/assign';
import './index.less';
import axios from "Utils/axios";
import empty from 'Img/empty.jpg';

class ZZCardList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            queryParams: this.props.queryParams,
            pageNumber: 1,
            listData: [],
            loading: false,
            loadingMore: false,
            showLoadingMore: true,
        };
    }

    componentDidMount = () => {
        this.getList(this.props.queryParams, data => {
            this.setState({
                listData: data.backData
            });
        });
    }

    componentWillReceiveProps(nextProps) {
        if ('queryParams' in nextProps && JSON.stringify(nextProps.queryParams) !== JSON.stringify(this.state.queryParams)) {
            this.setState({queryParams: nextProps.queryParams}, () => {
                this.getList(nextProps.queryParams, data => {
                    this.setState({
                        listData: data.backData
                    });
                });
            });
        }
    }

    getList = (queryParams, callback) => {
        const {queryUrl} = this.props;
        const {pageNumber} = this.state;
        const param = _assign({}, queryParams);
        param.pageNumber = pageNumber;
        param.pageSize = 10;
        this.setState({loading: true});
        axios.get(queryUrl, {
            params: param
        }).then(res => res.data).then(data => {
            if (data.success) {
                if (typeof callback === 'function') callback(data);
            } else {
                message.error(data.backMsg);
            }
            this.setState({loading: false});
        });
    }

    onLoadMore = () => {
        let {queryParams, listData, pageNumber, total} = this.state;
        this.setState({
            loadingMore: true,
            pageNumber: ++pageNumber
        }, () => {
            this.getList(queryParams, data => {
                const _data = listData.concat(data.backData);
                this.setState({
                    listData: _data,
                    loadingMore: false,
                });
            });
        });
    }

    render() {
        const {renderItem} = this.props;
        const {loading, showLoadingMore, loadingMore, listData} = this.state;
        const loadMore = listData.length > 0 && showLoadingMore ? (
            <div style={{textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px'}}>
                {loadingMore && <Spin/>}
                {!loadingMore && <Button onClick={this.onLoadMore}><Icon type="plus"/> 加载更多</Button>}
            </div>
        ) : null;

        return (
            <div className='zui-zzCardList'>
                <Spin spinning={loading} size={"large"}>
                    {
                        listData.length > 0 ? listData.map(renderItem) :
                            (<div style={{marginTop: 65, textAlign: 'center'}}>
                                <img src={empty}/>
                                <p style={{marginTop: 26, fontSize: 12, color: '#7B7B7B'}}>暂无数据</p>
                            </div>)
                    }
                </Spin>
                {
                    loadMore
                }
            </div>
        );
    }
}

export default ZZCardList;
