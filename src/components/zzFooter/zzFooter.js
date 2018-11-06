import React from 'react';
import {Layout, Row, Col} from 'antd';
import './zzFooter.less';
import followPublic from 'Img/followPublic.png';

const {Footer} = Layout;

class ZZFooter extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Footer className='page-footer'>
                <div>
                    <Row style={{padding: '27px 0px 20px'}}>
                        <Col span={12}>
                            <p>联系我们：商务合作：wuwei@tashan.com</p>
                            <p>用户反馈及帮助：wangtian@tashan.com</p>
                        </Col>
                        <Col span={12}>
                            <div style={{float: 'right', width: 72, textAlign: 'center'}}>
                                <img src={followPublic}/>
                                <p style={{fontSize: 14, color: '#898989'}}>关注公众号</p>
                            </div>
                        </Col>
                    </Row>
                    <div className='copyright'>
                        ©2014-2018 他山网络 Bendi Inc. 鄂ICP备14048854号・鄂公网安备11010502026416
                    </div>
                </div>
            </Footer>
        );
    }
}

export default ZZFooter;
