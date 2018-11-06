import React from 'react';
import {Row, Col, Icon, Button, message, Spin, Avatar, Input, List, Divider} from 'antd';
import restUrl from 'RestUrl';
import _assign from 'lodash/assign';
import {listToTree, shiftDate} from "Utils/util";
import './index.less';
import axios from "Utils/axios";

const {TextArea} = Input;
const sort = (a, b) => new Date(a.create_time).getTime() < new Date(b.create_time).getTime();

function buildParents(list) {
    function getParents(item) {
        if (!item.parents) item.parents = [];
        if (item.pId === "") return [];
        for (let i = 0; i < list.length; i++) {
            if (item.pId === list[i].id) {
                item.parents.push(list[i]);
                if (list[i].pId === "") return item.parents;
                else return item.parents.concat(getParents(list[i]));
            }
        }
    }

    for (let i = 0; i < list.length; i++) {
        list[i].create_time = shiftDate(list[i].create_time);
        list[i].parents = Array.from(new Set(getParents(list[i])));
    }

    return list;
}

class ZZComment extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            avatar: this.props.avatar,
            commentList: [],
            commentTree: [],
            commentText: '',
            replyText: '',
            loading: false,
            commentLoading: false,
            replyLoading: false
        };
    }

    componentDidMount = () => {
        this.queryCommentList(this.props.queryParams, 'init');
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.queryParams) !== JSON.stringify(this.props.queryParams)) {
            this.queryCommentList(nextProps.queryParams);
        }
    }

    treeToList = tree => {
        return tree.reduce((keys, item) => {
            keys.push(item);
            if (item.children) {
                return keys.concat(this.treeToList(item.children));
            }
            return keys;
        }, []);
    }

    buildCommentTree = (commentList, init) => {
        const _commentList = buildParents(commentList);
        const commentTree = listToTree(_commentList).sort(sort);
        commentTree.map(item => {
            if (item.children) {
                item.children = this.treeToList(item.children);
            }
            if (init) {
                item.openReply = false;
                item.collapsed = false;
            }
        });
        return commentTree;
    }

    //获取评论列表
    queryCommentList = (queryParams, init) => {
        const {queryUrl} = this.props;
        const param = _assign({}, queryParams);
        this.setState({
            loading: true
        });
        axios.get(queryUrl, {params: param}).then(res => res.data).then(data => {
            if (data.success) {
                const commentList = data.backData;
                const commentTree = this.buildCommentTree(commentList, init);
                this.setState({
                    loading: false,
                    commentList,
                    commentTree
                });

                if ('commentList' in this.props) {
                    return this.props.commentList(commentList);
                }
            } else {
                message.error(data.backMsg);
            }

            this.setState({
                loading: false
            });
        });
    }

    saveCommentText = value => {
        this.setState({
            commentText: value.target.value
        });
    }

    saveReplyText = value => {
        this.setState({
            replyText: value.target.value
        });
    }

    openReply = (item, index, subItem, subIndex) => {
        const {commentTree} = this.state;
        let activeOpenReply;
        if (!subItem && !subIndex) activeOpenReply = [...commentTree][index].openReply;
        else activeOpenReply = [...commentTree][index].children[subIndex].openReply;
        commentTree.map((comment, commentIndex) => {
            commentTree[commentIndex].openReply = false;
            if (commentTree[commentIndex].children) {
                commentTree[commentIndex].children.map((subComment, subCommentIndex) => {
                    commentTree[commentIndex].children[subCommentIndex].openReply = false;
                });
            }
        });
        if (!subItem && !subIndex) {
            commentTree[index].openReply = !activeOpenReply;
        } else {
            commentTree[index].children[subIndex].openReply = !activeOpenReply;
        }

        this.setState({commentTree});
    }

    openReplyList = (item, index) => {
        const {commentTree} = this.state;
        commentTree[index].collapsed = !commentTree[index].collapsed;

        this.setState({commentTree});
    }


    addComment = (pId) => {
        const {queryParams, saveUrl} = this.props;
        const {commentText, replyText} = this.state;
        const param = _assign({}, queryParams);
        param.pId = pId;
        param.userId = 'fd6dd05d-4b9a-48a2-907a-16743a5125dd';
        param.comment = pId ? replyText : commentText;
        if (!pId) this.setState({commentLoading: true});
        else this.setState({replyLoading: true});
        axios.post(saveUrl, param).then(res => res.data).then(data => {
            if (data.success) {
                this.setState({
                    commentText: '',
                    replyText: '',
                });
                this.queryCommentList(this.props.queryParams);
            } else {
                message.error(data.backMsg);
            }
            this.setState({
                commentLoading: false,
                replyLoading: false
            });
        });
    }

    renderItem = (item, index) => {
        const {replyText, replyLoading} = this.state;
        const renderSubItem = (item, index, subItem) => (
            <List
                itemLayout="vertical"
                dataSource={subItem}
                renderItem={(subItem, subIndex) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar
                                icon="user"
                                src={(subItem.avatar && subItem.avatar.filePath) ? restUrl.BASE_HOST + subItem.avatar.filePath : null}/>}
                            title={<a>{`${subItem.userName}  ${subItem.create_time}`}</a>}
                            description={<div>
                                <div>{subItem.comment}
                                    {
                                        subItem.parents.map(i => {
                                            return (
                                                <span key={i.id}>
                                                    <a>//@{i.userName}: </a>
                                                    <span>{i.comment}</span>
                                                </span>
                                            )
                                        })
                                    }
                                </div>
                                <div>
                                    <a onClick={() => this.openReply(item, index, subItem, subIndex)}>{subItem.openReply ? '取消' : '回复'}</a>
                                </div>
                                {
                                    subItem.openReply ? (<div style={{marginTop: 16}}>
                                        <TextArea rows={5} value={replyText}
                                                  onChange={this.saveReplyText}/>
                                        <div style={{marginTop: 16, textAlign: 'right'}}>
                                            <Button
                                                loading={replyLoading}
                                                onClick={() => this.addComment(subItem.id)}>回复评论</Button>
                                        </div>
                                    </div>) : null
                                }
                            </div>}
                        />
                    </List.Item>
                )}
            />
        );

        return (
            <List.Item className="top-item">
                <List.Item.Meta
                    avatar={<Avatar
                        size='large'
                        icon="user"
                        src={(item.avatar && item.avatar.filePath) ? restUrl.BASE_HOST + item.avatar.filePath : null}/>}
                    title={<a>{`${item.userName}  ${item.create_time}`}</a>}
                    description={<div>
                        <div>{item.comment}</div>
                        <div>
                            <a onClick={() => this.openReply(item, index)}>{item.openReply ? '取消' : '回复'}</a>
                            {
                                item.children && item.children.length > 0 ? (
                                    <span>
                                        <Divider type="vertical"/>
                                        <a onClick={() => this.openReplyList(item, index)}>
                                            {item.children.length}条回复 <Icon
                                            type={item.collapsed ? 'up' : 'down'}/>
                                        </a>
                                    </span>
                                ) : null
                            }
                        </div>
                        {
                            item.collapsed ? (
                                <div>
                                    {renderSubItem(item, index, item.children)}
                                </div>) : null
                        }
                        {
                            item.openReply ? (<div style={{marginTop: 10}}>
                                <TextArea rows={5} value={replyText} onChange={this.saveReplyText}/>
                                <div style={{marginTop: 16, textAlign: 'right'}}>
                                    <Button
                                        loading={replyLoading}
                                        onClick={() => this.addComment(item.id)}>回复评论</Button>
                                </div>
                            </div>) : null
                        }
                    </div>}
                />
            </List.Item>
        );
    }

    render() {
        const {loading, avatar, commentList, commentTree, commentText, commentLoading} = this.state;

        return (
            <div className='comment-box' id={this.props.id}>
                <div className='comment-dialog'>
                    <div className='title'>评论（{commentList.length}）</div>
                    <Row type='flex' justify="space-between" align="middle">
                        <Col style={{width: 56}}>
                            <Avatar
                                size="large"
                                icon="user"
                                src={avatar ? avatar : null}
                            />
                        </Col>
                        <Col style={{width: 814}}>
                            <TextArea rows={5} value={commentText} onChange={this.saveCommentText}/>
                        </Col>
                    </Row>
                    <div style={{marginTop: 16, textAlign: 'right'}}>
                        <Button loading={commentLoading} onClick={() => this.addComment(null, 1)}>评论</Button>
                    </div>
                </div>
                {
                    commentTree.length > 0 ? (
                        <div className='comment-list'>
                            <Spin spinning={loading}>
                                <List
                                    itemLayout="horizontal"
                                    dataSource={commentTree}
                                    pagination
                                    renderItem={(item, index) => this.renderItem(item, index)}
                                />
                            </Spin>
                        </div>
                    ) : null
                }
            </div>
        );
    }
}

export default ZZComment;
