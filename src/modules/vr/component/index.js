import React from 'react';
import PropTypes from 'prop-types';
import '../index.less';
import vrNoData from 'Img/vr-no-data.jpg';

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentWillMount = () => {
    }

    componentDidMount = () => {
    }

    render() {

        return (
            <div className='page-vr'>
                <div style={{margin: '100px 0', textAlign: 'center'}}>
                    <img src={vrNoData}/>
                    <p style={{
                        marginTop: 26,
                        fontSize: 12,
                        color: '#7B7B7B'
                    }}>当前暂未开通，敬请期待~~</p>
                </div>
            </div>
        );
    }
}

Index.contextTypes = {
    router: PropTypes.object
}

export default Index;