import React, { useEffect, useState, createRef } from 'react';
import { Container, Segment, Statistic, Grid, Menu, Feed, Icon, List, Pagination, Button, Form, TextArea, Input, Divider } from 'semantic-ui-react';
import { Link, useHistory } from 'react-router-dom';
import moment from 'moment';

import { useRecoilState } from 'recoil';
import { usernameState, userIdState } from '../StateManager';

import MDEditor from '@uiw/react-md-editor';

import { get, post } from '../utils/Request';

const contextRef = createRef();

function Home() {
    // 全局用户
    const [username, setUsername] = useRecoilState(usernameState);
    const [userId, setUserId] = useRecoilState(userIdState);
    // 频道
    const [activeItem, setActiveItem] = useState(1);
    const [channels, setChannels] = useState([]);
    const [channelId, setChannelId] = useState(1);

    // 主题
    const [loadingTopic, setLoadingTopic] = useState(true);
    const [topics, setTopics] = useState([]);
    const [topicId, setTopicId] = useState(0);
    const [error, setError] = useState('');
    const [countTopicTotal, setCountTopicTotal] = useState(0);
    const [countPageTopic, setCountPageTopic] = useState(0);
    const [nextPageTopic, setNextPageTopic] = useState(null);
    const [prevPageTopic, setPrevPageTopic] = useState(null);
    const [activePageTopic, setActivePageTopic] = useState(1);
    const [buttonTopicText, setButtonTopicText] = useState('发表主题');
    const [topicEditorShow, setTopicEditorShow] = useState(false);
    const [valueTopicTitle, setValueTopicTitle] = useState('');
    const [valueTopicBody, setValueTopicBody] = useState("");
    const [topicUpdated, setTopicUpdated] = useState(false);

    // 回复
    const [loadingReply, setLoadingReply] = useState(true);
    const [replies, setReplies] = useState([]);
    const [buttonReplyText, setButtonReplyText] = useState('发表回复');
    const [replyEditorShow, setReplyEditorShow] = useState(false);
    const [valueReply, setValueReply] = useState("");
    const [replyUpdated, setReplyUpdated] = useState(false);

    const [activePageReply, setActivePageReply] = useState(1);
    const [countReplyTotal, setCountReplyTotal] = useState(0);
    const [countPageReply, setCountPageReply] = useState(0);
    const [nextPageReply, setNextPageReply] = useState(null);
    const [prevPageReply, setPrevPageReply] = useState(null);

    useEffect(() => {
        // 获取频道
        get('api/channels/').then((ress) => {
            setChannels(ress.data.results);
        });
    }, []);

    useEffect(() => {
        // 获取主题
        get('api/topics/?channel_id=' + channelId, { page: activePageTopic }, true)
            .then(function (res) {
                // 处理成功情况
                setLoadingTopic(false);
                setTopics(res.data.results);
                setCountTopicTotal(res.data.count);
                setCountPageTopic(Math.ceil(res.data.count / 20));
                setNextPageTopic(res.data.next);
                setPrevPageTopic(res.data.previous);
                setError('');
                console.log(res);
                setCurrentTopicId(res.data.results);
            })
            .catch(function (error) {
                // 处理错误情况
                setLoadingTopic(false);
                setTopics([]);
                setError('很抱歉，没有获取到数据！');
                console.log(error);
            });
    }, [channelId, activePageTopic, topicUpdated,]);

    // 发布topic
    const postTopic = () => {
        post('api/topics/', { title: valueTopicTitle, topic_body: valueTopicBody, channel: channelId }, true)
            .then((res) => {
                console.log(res);
                toggleTopicEditor();
                setValueTopicTitle("");
                setValueTopicBody("");
                setTopicUpdated(!topicUpdated);
            }).catch((err) => {
                console.log(err);
            })
    };

    // 发布reply
    const postReply = () => {
        const reply_body = document.getElementById("ReplyBody").value;
        post('api/replies/', { target: topicId, reply_body: reply_body }, true)
            .then((res) => {
                console.log(res);
                toggleReplyEditor();
                setValueReply("");
                setReplyUpdated(!replyUpdated);
            }).catch((err) => {
                console.log(err);
            })
    }

    // 获取输入topic的标题
    function handleTopicTitleChange(e) {
        setValueTopicTitle(e.target.value);
        console.log(valueTopicTitle);
    }

    useEffect(() => {
        // 获取回复
        get('api/replies/?topic_id=' + topicId, { page: activePageReply }, true)
            .then(function (res) {
                setLoadingReply(false);
                setReplies(res.data.results);
                console.log(res);
            })
            .catch(function (error) {
                setLoadingReply(false);
                setReplies([]);
                console.log(error)
            });
    }, [topicId, replyUpdated]);


    // 更换频道
    const handleItemClick = (e, { id }) => {
        console.log(id);
        setActiveItem(id);
        setChannelId(id);
    };

    // 频道列表
    const channel_list = channels.map((channel) => (
        <Menu.Item key={channel.id} className={'channel-menu'}
            id={channel.id}
            active={activeItem === channel.id}
            content={channel.name}
            onClick={handleItemClick}
        />
    ));

    function setCurrentTopicId(topics) {
        for (var key in topics) {
            if (key == 0) {
                setTopicId(topics[key].id);
                console.log(topics[key].id);
                break;
            }
        }
    }

    function handleGetTopicBody(topic_id) {
        setTopicId(topic_id);
    }

    // 主题列表
    const topic_list = topics.map((topic, index) => {
        return (
            <List.Item key={topic.id}>
                <List.Content>
                    <List.Header as={'a'} onClick={() => handleGetTopicBody(topic.id)} style={{}}>
                        {topic.title}
                    </List.Header>
                    {topicId == topic.id &&
                        <List.Description style={{ marginTop: 1 + 'rem', marginBottom: 1 + 'rem', fontSize: 0.5 + 'rem' }}>
                            <MDEditor.Markdown source={topic.topic_body} />
                        </List.Description>
                    }
                    <p className='title-sub'>{moment(topic.created).format("YYYY年MM月DD日HH时mm分")} by <span>{topic.owner.username}</span></p>
                </List.Content>
            </List.Item>
        )
    });

    // 主题分页
    const handleTopicPaginationChange = (e, { activePage }) => setActivePageTopic(activePage)
    const PaginationForTopicList = () => (
        <Pagination size='mini' activePage={activePageTopic} totalPages={countPageTopic} onPageChange={handleTopicPaginationChange} />
    );

    const toggleTopicEditor = () => {
        buttonTopicText == '发表主题' ? setButtonTopicText('取消发表') : setButtonTopicText('发表主题')
        setTopicEditorShow(!topicEditorShow)
    };

    // 回复列表
    const reply_list = replies.map((reply) => (
        <Segment basic key={reply.id}>
            <div>
                <a>{reply.owner.username}</a>回复说:
            </div>
            <div> {reply.reply_body} </div>
            <p className='small'>{moment(reply.created).utcOffset(8).fromNow()}</p>
        </Segment>
    ));

    // 回复分页
    const handleReplyPaginationChange = (e, { activePage }) => setActiveReplyPage(activePage)
    const PaginationForReplyList = () => (
        <Pagination activePage={activePageReply} totalPages={countPageReply} onPageChange={handleReplyPaginationChange} />
    );

    const toggleReplyEditor = () => {
        buttonReplyText == '发表回复' ? setButtonReplyText('取消发表') : setButtonReplyText('发表回复')
        setReplyEditorShow(!replyEditorShow)
    };

    return (
        <Container style={{ padding: '1rem', paddingTop: 0 }} fluid>
            <Grid>
                <Segment>
                    <Statistic floated='right'>
                        <Statistic.Value>{countTopicTotal}</Statistic.Value>
                        <Statistic.Label>主题</Statistic.Label>
                    </Statistic>
                    <p>
                        赛凡链是一个完全开放的区块链应用，其所有权属于社区，一经发布，即成为社区的公共财产，不属于任何人私有。

                        赛凡链采用Rust语言的Substrate框架构建，其上的应用以Rust、Python、Golang、Javascript等语言编写，任何有编程能力的开发者都可以参与到赛凡链的开发中来。

                        所有的决策和管理，不管是技术层面的，还是运营层面，都由社区磋商制定相应规则来进行。
                    </p>

                    <p>
                        开发上线后，区块链的社区治理逐步进行，先由创始团队托管一段时间，当社区成熟之成，逐步移交社区。社区在发展演进中，逐步探索出合理的治理模式。
                    </p>
                </Segment>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Menu fluid vertical tabular>
                            {channel_list}
                        </Menu>
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <div>
                            <Button onClick={toggleTopicEditor}>{buttonTopicText}</Button>
                            {topicEditorShow &&
                                <div>
                                    <Input size='mini' fluid placeholder='主题名称' style={{ marginTop: 0.5 + 'rem' }} onChange={handleTopicTitleChange} />
                                    <MDEditor style={{ marginTop: 0.5 + 'rem', marginBottom: 0.5 + 'rem' }}
                                        value={valueTopicBody}
                                        onChange={setValueTopicBody}
                                        preview='edit'
                                        height={120}
                                    />
                                    <Button onClick={postTopic}>提交</Button>
                                </div>
                            }

                            {loadingTopic &&
                                <div className="text-center">
                                    <div className="spinner-border text-secondary" role="status">
                                        <span className="sr-only">正在加载...</span>
                                    </div>
                                </div>
                            }

                            {!loadingTopic && !error &&
                                <List divided relaxed>{topic_list}</List>
                            }
                            {(nextPageTopic || prevPageTopic) &&
                                <PaginationForTopicList />
                            }

                        </div>
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <Button onClick={toggleReplyEditor}>{buttonReplyText}</Button>
                        {replyEditorShow &&
                            <div>
                                <Form style={{ marginTop: 0.5 + 'rem', marginBottom: 0.5 + 'rem' }}>
                                    <TextArea rows={2} placeholder='说点什么……' id='ReplyBody' />
                                </Form>
                                <Button onClick={postReply}>提交</Button>
                            </div>
                        }
                        <div>
                            {reply_list}
                        </div>
                        {(nextPageReply || prevPageReply) &&
                            <PaginationForReplyList />
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container >
    )
}

export default Home