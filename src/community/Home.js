import React, { useEffect, useState, createRef } from 'react';
import { Container, Segment, Statistic, Grid, Menu, Feed, Icon, List, Pagination, Button, Input } from 'semantic-ui-react';
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
    const [loading, setLoading] = useState(true);
    const [topics, setTopics] = useState([])
    const [error, setError] = useState('')
    const [countPageTopic, setCountPageTopic] = useState(0)
    const [nextPageTopic, setNextPageTopic] = useState(null)
    const [prevPageTopic, setPrevPageTopic] = useState(null)
    const [activePageTopic, setActivePageTopic] = useState(1)
    const [buttonText, setButtonText] = useState('发表主题')
    const [topicEditorShow, setTopicEditorShow] = useState(false)
    const [value, setValue] = useState("");

    useEffect(() => {
        // 获取频道
        get('api/channels/').then((ress) => {
            setChannels(ress.data.results);
        })

        // 获取主题
        get('api/topics/?channel_id=' + channelId, { page: activePageTopic }, true)
            .then(function (res) {
                // 处理成功情况
                setLoading(false)
                setTopics(res.data.results)
                setCountPageTopic(Math.ceil(res.data.count / 20))
                setNextPageTopic(res.data.next)
                setPrevPageTopic(res.data.previous)
                setError('')
                console.log(res);
            })
            .catch(function (error) {
                // 处理错误情况
                setLoading(false)
                setTopics([])
                setError('很抱歉，没有获取到数据！')
                console.log(error);
            });
    }, [channelId, activePageTopic,])

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
    const handleTopicPaginationChange = (e, { activePage }) => setActivePage(activePage)
    const PaginationForTopicList = () => (
        <Pagination activePage={activePage} totalPages={countPage} onPageChange={handleTopicPaginationChange} />
    )

    const showTopicEditor = () => {
        buttonText == '发表主题' ? setButtonText('取消发表') : setButtonText('发表主题')
        setTopicEditorShow(!topicEditorShow)
    }

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
                            <Button floated='' onClick={showTopicEditor}>{buttonText}</Button>
                            {/* <Input size='small' placeholder='主题名称'/> */}
                            {topicEditorShow &&
                                <div>
                                    <MDEditor style={{ marginTop: 0.5 + 'rem', marginBottom: 0.5 + 'rem' }}
                                        value={value}
                                        onChange={setValue}
                                        preview='edit'
                                        height={120}
                                    />
                                    <Button floated=''>提交</Button>
                                </div>
                            }


                            {loading &&
                                <div className="text-center">
                                    <div className="spinner-border text-secondary" role="status">
                                        <span className="sr-only">正在加载...</span>
                                    </div>
                                </div>
                            }

                            {!loading && !error &&
                                <List divided relaxed>{topic_list}</List>
                            }
                            {(nextPageTopic || prevPageTopic) &&
                                <PaginationForTopicList />
                            }

                        </div>
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <Feed>
                            <Feed.Event>
                                <Feed.Content>
                                    <Feed.Summary>
                                        <Feed.User>Elliot Fu</Feed.User> added you as a friend
                                        <Feed.Date>1 Hour Ago</Feed.Date>
                                    </Feed.Summary>
                                    <Feed.Meta>
                                        <Feed.Like>
                                            <Icon name='like' />4 Likes
                                        </Feed.Like>
                                    </Feed.Meta>
                                </Feed.Content>
                            </Feed.Event>

                            <Feed.Event>
                                <Feed.Content>
                                    <Feed.Summary>
                                        <a>Helen Troy</a> added <a>2 new illustrations</a>
                                        <Feed.Date>4 days ago</Feed.Date>
                                    </Feed.Summary>
                                    <Feed.Extra images>

                                    </Feed.Extra>
                                    <Feed.Meta>
                                        <Feed.Like>
                                            <Icon name='like' />1 Like
                                        </Feed.Like>
                                    </Feed.Meta>
                                </Feed.Content>
                            </Feed.Event>

                            <Feed.Event>
                                <Feed.Content>
                                    <Feed.Summary
                                        date='2 Days Ago'
                                        user='Jenny Hess'
                                        content='add you as a friend'
                                    />
                                    <Feed.Meta>
                                        <Feed.Like>
                                            <Icon name='like' />8 Likes
                                        </Feed.Like>
                                    </Feed.Meta>
                                </Feed.Content>
                            </Feed.Event>

                            <Feed.Event>
                                <Feed.Content>
                                    <Feed.Summary>
                                        <a>Joe Henderson</a> posted on his page
                                        <Feed.Date>3 days ago</Feed.Date>
                                    </Feed.Summary>
                                    <Feed.Extra text>
                                        Ours is a life of constant reruns. We're always circling back to where
                                        we'd we started, then starting all over again. Even if we don't run
                                        extra laps that day, we surely will come back for more of the same
                                        another day soon.
                                    </Feed.Extra>
                                    <Feed.Meta>
                                        <Feed.Like>
                                            <Icon name='like' />5 Likes
                                        </Feed.Like>
                                    </Feed.Meta>
                                </Feed.Content>
                            </Feed.Event>

                            <Feed.Event>
                                <Feed.Content>
                                    <Feed.Summary>
                                        <a>Justen Kitsune</a> added <a>2 new photos</a> of you
                                        <Feed.Date>4 days ago</Feed.Date>
                                    </Feed.Summary>
                                    <Feed.Extra images>

                                    </Feed.Extra>
                                    <Feed.Meta>
                                        <Feed.Like>
                                            <Icon name='like' />
                                            41 Likes
                                        </Feed.Like>
                                    </Feed.Meta>
                                </Feed.Content>
                            </Feed.Event>
                        </Feed>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container >
    )
}

export default Home