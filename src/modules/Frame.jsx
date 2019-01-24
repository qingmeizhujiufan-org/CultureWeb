import React from 'react';
import {Icon, BackTop, Popover, Affix} from 'antd';
import ReactPlayer from 'react-player';
import restUrl from 'RestUrl';
import ZZHeader from 'Comps/zzHeader/zzHeader';
import ZZFooter from 'Comps/zzFooter/zzFooter';
import followPublic from 'Img/followPublic.png';
import axios from "Utils/axios";


export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {},
            stop: false,
            hashChange: 1
        };
    }

    componentDidMount = () => {
        this.queryMusicDetail();

        window.addEventListener('hashchange', this.setHash);
    }

    componentWillUnmount() {
        window.removeEventListener('hashchange', this.setHash);
    }

    setHash = () => {
        this.setState({hashChange: ++this.state.hashChange});
    }

    queryMusicDetail = () => {
        this.setState({
            loading: true
        });
        axios.get('Server/queryMusic').then(res => res.data).then(data => {
            if (data.success) {
                if (data.music && data.music.bgMusic) {
                    this.setState({
                        data: data.music.bgMusic,
                        stop: true
                    });
                }
            }
        });
    }

    controlMusic = () => {
        this.setState({
            stop: !this.state.stop
        });
    }

    render() {
        const {data, stop, hashChange} = this.state;

        return (
            <div>
                <Affix>
                    <ZZHeader hash={hashChange}/>
                </Affix>
                <div style={{minHeight: 'calc(100vh - 314px)'}}>
                    {this.props.children}
                </div>
                <ZZFooter/>
                <Popover
                    placement="left"
                    content={(
                        <div>
                            <h3>{data.fileName}</h3>
                            <ReactPlayer
                                url={restUrl.BASE_HOST + data.filePath}
                                loop
                                playing={stop}
                                width={0}
                                height={0}
                            />
                        </div>)}
                >
                    <div className='fix-music'>
                        <div onClick={this.controlMusic}>
                                <span className={`iconfont icon-music ${stop ? 'spinning' : null}`}
                                      style={{fontSize: 26}}/>
                        </div>
                    </div>
                </Popover>
                <Popover
                    placement="left"
                    content={(
                        <div style={{textAlign: 'center'}}>
                            <img src={followPublic} style={{width: 100}}/>
                            <p style={{margin: '10px 0 0', color: '#47340B', fontSize: 12}}>扫一扫关注服务号</p>
                        </div>)}
                >
                    <div className='fix-qrcode'>
                        <div>
                            <span className='iconfont icon-code'></span>
                        </div>
                    </div>
                </Popover>
                <BackTop>
                    <div className="zui-up"><Icon type="up"/></div>
                </BackTop>
            </div>
        );
    }
}