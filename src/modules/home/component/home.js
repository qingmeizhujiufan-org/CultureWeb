import React from 'react';
import {Link} from 'react-router';
import PropTypes from 'prop-types';
import {Icon, Row, Col, List, Carousel} from 'antd';
import LazyLoad from 'react-lazyload';
import '../index.less';
import banner1 from 'Img/banner1.jpg';
import banner2 from 'Img/banner2.jpg';
import banner3 from 'Img/banner3.jpg';

import restUrl from 'RestUrl';
import axios from "Utils/axios";

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            textNews: [],
            pictureNews: [],
            cultureList: []
        };
    }

    componentDidMount = () => {
        this.getNewsList();
        this.queryHomeCultureDetail();
    }

    getNewsList = callback => {
        let param = {};
        param.pageNumber = 1;
        param.pageSize = 7;
        param.conditionText = '';
        param.cityId = '';
        axios.get('news/queryList', {
            params: param
        }).then(res => res.data).then(data => {
            if (data.success) {
                data = data.backData;
                this.setState({
                    textNews: data.slice(0, 4),
                    pictureNews: data.slice(4)
                });
                console.log("data ===", data)
            } else {
                message.error(data.backMsg);
            }
        });
    }

    queryHomeCultureDetail = () => {
        axios.get('Server/queryHomeCulutreDetail').then(res => res.data).then(data => {
            if (data.success) {
                const cultureList = [];
                data = data.backData;
                for (let key in data) {
                    cultureList.push(data[key]);
                }

                this.setState({
                    cultureList
                });
            } else {
                message.error(data.backMsg);
            }
        });
    }


    render() {
        const {cultureList, textNews, pictureNews} = this.state;

        return (
            <div className="page-home" id="page_home">
                <div className="slider-box">
                    <Carousel
                        autoplay
                        autoplaySpeed={5000}
                        arrows
                        infinite
                    >
                        <div>
                            <div className='banner' style={{backgroundImage: `url(${banner1})`}}>
                                <div className='carousel-content'>
                                    <h1 className='iconfont icon-shouyewenzi'></h1>
                                    <p>专注民俗文化传播</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className='banner' style={{backgroundImage: `url(${banner2})`}}>
                                <div className='carousel-content'>
                                    <h1 className='iconfont icon-shouyewenzi'></h1>
                                    <p>专注民俗文化传播</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className='banner' style={{backgroundImage: `url(${banner3})`}}>
                                <div className='carousel-content'>
                                    <h1 className='iconfont icon-shouyewenzi'></h1>
                                    <p>专注民俗文化传播</p>
                                </div>
                            </div>
                        </div>
                    </Carousel>
                </div>
                <div className='page-content'>
                    <div className='content'>
                        <section className='plate'>
                            <h1>民俗新闻</h1>
                            <p>最全面、最前沿的民俗文化新闻资讯</p>
                            <article className='box news'>
                                <Row type="flex" justify="center" align="middle">
                                    <Col style={{width: 464, margin: '0 52px'}}>
                                        <List
                                            className='news-list'
                                            itemLayout="horizontal"
                                            dataSource={textNews}
                                            renderItem={item => (
                                                <List.Item>
                                                    <List.Item.Meta
                                                        title={<Link to={`/frame/news/detail/${item.id}`}
                                                                     className='zui-ellipsis' style={{
                                                            width: 464,
                                                            display: 'block'
                                                        }}>{item.newsTitle}</Link>}
                                                        description={item.create_time.slice(0, 10)}
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    </Col>
                                    <Col style={{width: 600, height: 370}}>
                                        {
                                            pictureNews.length > 0 ? (
                                                <Carousel
                                                    autoplay
                                                    className='news-list-image'
                                                >
                                                    {
                                                        pictureNews.map((item, index) => {
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className='wrap-img'
                                                                >
                                                                    <Link to={`/frame/news/detail/${item.id}`}>
                                                                        <LazyLoad
                                                                            throttle={200}
                                                                            height={370}
                                                                            placeholder={<Icon type="loading"
                                                                                               theme="outlined"/>}
                                                                        >
                                                                            <img
                                                                                src={restUrl.BASE_HOST + item.newsCover.filePath}/>
                                                                        </LazyLoad>
                                                                        <div className='news-title zui-ellipsis'
                                                                             style={{
                                                                                 width: 600,
                                                                                 paddingRight: 100
                                                                             }}>{item.newsTitle}</div>
                                                                    </Link>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </Carousel>
                                            ) : null
                                        }
                                    </Col>
                                </Row>
                            </article>
                        </section>
                        <section className='plate'>
                            <h1>文化展示</h1>
                            <p>详尽的荆楚风土人情、美食美景</p>
                            <article className='box culture'>
                                {
                                    cultureList.length > 0 ? (
                                        <Carousel
                                            autoplay
                                            autoplaySpeed={5000}
                                        >
                                            {
                                                cultureList.map((item, index) => {
                                                    if (index % 3 === 0) {
                                                        return (
                                                            <div key={index}>
                                                                <div className='img-list'>
                                                                    <Row type='flex'>
                                                                        <Col className='wrap-img'>
                                                                            <LazyLoad
                                                                                throttle={200}
                                                                                height={370}
                                                                                placeholder={<Icon type="loading" spin
                                                                                                   theme="outlined"/>}
                                                                            >
                                                                                <img
                                                                                    src={restUrl.BASE_HOST + cultureList[index].filePath}/>
                                                                            </LazyLoad>
                                                                        </Col>
                                                                        <Col className='wrap-img'
                                                                             style={{margin: '0 18px'}}>
                                                                            <LazyLoad
                                                                                throttle={200}
                                                                                height={370}
                                                                                placeholder={<Icon type="loading" spin
                                                                                                   theme="outlined"/>}
                                                                            >
                                                                                <img
                                                                                    src={restUrl.BASE_HOST + cultureList[index + 1].filePath}/>
                                                                            </LazyLoad>
                                                                        </Col>
                                                                        <Col className='wrap-img'>
                                                                            <LazyLoad
                                                                                throttle={200}
                                                                                height={370}
                                                                                placeholder={<Icon type="loading" spin
                                                                                                   theme="outlined"/>}
                                                                            >
                                                                                <img
                                                                                    src={restUrl.BASE_HOST + cultureList[index + 2].filePath}/>
                                                                            </LazyLoad>
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                })
                                            }
                                        </Carousel>
                                    ) : null
                                }
                            </article>
                        </section>
                    </div>
                </div>
                <div className='page-content lower'>
                    <section className='plate'>
                        <h1>民俗文化平台</h1>
                        <p>我们的核心：传承、发掘、创新</p>
                        <article className='art'/>
                    </section>
                </div>
            </div>
        );
    }
}

Index.contextTypes = {
    router: PropTypes.object
}

export default Index;
