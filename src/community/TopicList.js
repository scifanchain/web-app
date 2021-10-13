import React, { useEffect, useState } from 'react';
import {Link, useHistory } from 'react-router-dom';
import moment from 'moment';

import { Button, List, Icon, Pagination } from 'semantic-ui-react';
import { get } from '../utils/Request';


export default function TopicList() {
    const [loading, setLoading] = useState(true);
    const [topics, setTopics] = useState([])
    const [error, setError] = useState('')
    const [countPage, setCountPage] = useState(0)
    const [nextPage, setNextPage] = useState(null)
    const [prevPage, setPrevPage] = useState(null)
    const [activePage, setActivePage] = useState(1)

    useEffect(() => {
        get('api/topics/', { page: activePage }, true)
            .then(function (res) {
                // 处理成功情况
                setLoading(false)
                setTopics(res.data.results)
                setCountPage(Math.ceil(res.data.count / 20))
                setNextPage(res.data.next)
                setPrevPage(res.data.previous)
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
        console.log(activePage)
    }, [activePage,])

    // 分页
    const handlePaginationChange = (e, { activePage }) => setActivePage(activePage)
    const PaginationForTopicList = () => (
        <Pagination activePage={activePage} totalPages={countPage} onPageChange={handlePaginationChange} />
    )

    // 列表
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

    return (
        <div style={{ paddingTop: 1 + 'rem' }}>
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
            {(nextPage || prevPage) &&
                <PaginationForTopicList />
            }

        </div>
    )
}