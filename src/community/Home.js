import React, { useEffect, useState, createRef } from 'react';
import { Container, Segment, Statistic, Grid, Menu, Feed, Icon, List, Pagination, Button, Form, TextArea } from 'semantic-ui-react';
import { Link, useHistory } from 'react-router-dom';
import moment from 'moment';

import MDEditor from '@uiw/react-md-editor';

import { get } from '../utils/Request';

const contextRef = createRef();

function Home() {
    // 频道
    const [activeItem, setActiveItem] = useState(1);
    const [channels, setChannels] = useState([]);
    const [channelId, setChannelId] = useState(1);

    // 主题
    const [loadingTopic, setLoadingTopic] = useState(true);
    const [topics, setTopics] = useState([]);
    const [topicId, setTopicId] = useState(1);
    const [error, setError] = useState('');
    const [countPageTopic, setCountPageTopic] = useState(0);
    const [nextPageTopic, setNextPageTopic] = useState(null);
    const [prevPageTopic, setPrevPageTopic] = useState(null);
    const [activePageTopic, setActivePageTopic] = useState(1);
    const [buttonTopicText, setButtonTopicText] = useState('发表主题');
    const [topicEditorShow, setTopicEditorShow] = useState(false);
    const [valueTopic, setValueTopic] = useState("");

    // 回复
    const [loadingReply, setLoadingReply] = useState(true);
    const [replies, setReplies] = useState([]);
    const [activePageReply, setActivePageReply] = useState(1);
    const [buttonReplyText, setButtonReplyText] = useState('发表回复');
    const [replyEditorShow, setReplyEditorShow] = useState(false);
    const [valueReply, setValueReply] = useState("");

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
                setCountPageTopic(Math.ceil(res.data.count / 20));
                setNextPageTopic(res.data.next);
                setPrevPageTopic(res.data.previous);
                setError('');
                console.log(res);
            })
            .catch(function (error) {
                // 处理错误情况
                setLoadingTopic(false);
                setTopics([]);
                setError('很抱歉，没有获取到数据！');
                console.log(error);
            });
    }, [channelId, activePageTopic,]);

    useEffect(() => {
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
    }, [])

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

    // 主题列表
    const topic_list = topics.map((topic) => (
        <List.Item key={topic.id}>
            <List.Content>
                <List.Header as={Link} to={
                    {
                        pathname: '/community/topics/' + topic.id,
                    }
                }>
                    {topic.title}
                </List.Header>
                <p className='title-sub'>{moment(topic.created).format("YYYY年MM月DD日HH时mm分")}</p>
            </List.Content>
        </List.Item>
    ));

    // 主题分页
    const handleTopicPaginationChange = (e, { activePage }) => setActivePageTopic(activePage)
    const PaginationForTopicList = () => (
        <Pagination activePage={activePage} totalPages={countPage} onPageChange={handleTopicPaginationChange} />
    );

    const showTopicEditor = () => {
        buttonTopicText == '发表主题' ? setButtonTopicText('取消发表') : setButtonTopicText('发表主题')
        setTopicEditorShow(!topicEditorShow)
    };

    // 回复列表
    const reply_list = replies.map((reply) => (
        <Feed.Event key={reply.id}>
            <Feed.Content>
                <Feed.Summary>
                    <a>{reply.owner.username}</a>:
                    <Feed.Date>{moment(reply.created, "YYYYMMDD").fromNow()}</Feed.Date>
                </Feed.Summary>
                <Feed.Extra text>
                    {reply.reply_body}
                </Feed.Extra>
            </Feed.Content>
        </Feed.Event>
    ));

    // 回复分页
    const handleReplyPaginationChange = (e, { activePage }) => setActiveTopicPage(activePage)
    const PaginationForReplyList = () => (
        <Pagination activePage={activePage} totalPages={countPage} onPageChange={handleReplyPaginationChange} />
    );

    const showReplyEditor = () => {
        buttonReplyText == '发表回复' ? setButtonReplyText('取消发表') : setButtonReplyText('发表回复')
        setReplyEditorShow(!replyEditorShow)
    };

    return (
        <Container style={{ padding: '1rem', paddingTop: 0 }} fluid>
            <Grid>
                <Segment>
                    <Statistic floated='right'>
                        <Statistic.Value>2,204</Statistic.Value>
                        <Statistic.Label>Views</Statistic.Label>
                    </Statistic>
                    <p>
                        赛凡链是一个完全开放的区块链应用，其所有权属于社区，一经发布，即成为社区的公共财产，不属于任何人私有。

                        赛凡链采用Rust语言的Substrate框架构建，其上的应用以Rust、Python、Golang、Javascript等语言编写，任何有编程能力的开发者都可以参与到赛凡链的开发中来。

                        所有的决策和管理，不管是技术层面的，还是运营层面，都由社区磋商制定相应规则来进行。
                    </p>

                    <p>
                        开发上线后，治理权即交由社区。区块链的社区治理逐步进行，先由创始团队托管一段时间，当社区成熟之成，逐步移交社区。社区在发展演进中，逐步探索出合理的治理模式。
                    </p>
                    <p>
                        社区保持全球开放性，我们欢迎各个国家、各种文化种族的科幻爱好者加入，共同建设。现阶段尤其需要具备多语言背景、熟悉编程技术和互联网文化的同行者。
                    </p>
                </Segment>
                <Grid.Row>
                    <Grid.Column width={3}>
                        <Menu fluid vertical tabular>
                            {channel_list}
                        </Menu>
                    </Grid.Column>
                    <Grid.Column width={7}>
                        <div>
                            <Button onClick={showTopicEditor}>{buttonTopicText}</Button>
                            {/* <Input size='small' placeholder='主题名称'/> */}
                            {topicEditorShow &&
                                <div>
                                    <MDEditor style={{ marginTop: 0.5 + 'rem', marginBottom: 0.5 + 'rem' }}
                                        value={valueTopic}
                                        onChange={setValueTopic}
                                        preview='edit'
                                        height={120}
                                    />
                                    <Button>提交</Button>
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
                        <Button onClick={showReplyEditor}>{buttonReplyText}</Button>
                        {replyEditorShow &&
                            <div>
                                <Form style={{ marginTop: 0.5 + 'rem', marginBottom: 0.5 + 'rem' }}>
                                    <TextArea rows={2} placeholder='Tell us more' />
                                </Form>
                                <Button>提交</Button>
                            </div>
                        }
                        <Feed>
                            {reply_list}
                        </Feed>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container >
    )
}

export default Home