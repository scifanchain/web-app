import React, { useEffect, useState } from 'react';
import { List, Divider, Pagination } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { get } from '../utils/Request';

function StageList() {
    const [loading, setLoading] = useState(true);
    const [stages, setStages] = useState([])
    const [error, setError] = useState('')

    // 分页
    const [countPage, setCountPage] = useState(0)
    const [nextPage, setNextPage] = useState(null)
    const [prevPage, setPrevPage] = useState(null)
    const [activePage, setActivePage] = useState(1)

    useEffect(() => {
        get('api/stages/', { page: activePage }, false)
            .then(function (response) {
                // 处理成功情况
                setLoading(false)
                setStages(response.data.results)
                setError('')
                // 分页
                setCountPage(Math.ceil(response.data.count / 20))
                setNextPage(response.data.next)
                setPrevPage(response.data.previous)
            })
            .catch(function (error) {
                // 处理错误情况
                setLoading(false)
                setStages([])
                setError('很抱歉，没有获取到数据！')
                console.log(error);
            });
    }, [activePage,])

    // 分页
    const handlePaginationChange = (e, { activePage }) => setActivePage(activePage)
    const PaginationForStage = () => (
        <Pagination activePage={activePage} totalPages={countPage} onPageChange={handlePaginationChange} />
    )
    
    const stageList = stages.map((stage) => (
        <List.Item key={stage.id}>
            <List.Content>
                <List.Header as={Link} to={
                    {
                        pathname: '/space/stage/' + stage.id,
                    }
                }>
                    {stage.title}
                </List.Header>
                <p className='title-sub'>{moment(stage.created).format("YYYY年MM月DD日HH时mm分")}
                    <span style={{ paddingLeft: 0.5 + 'rem', paddingRight: 0.5 + 'rem' }}>By</span>
                    <List.Item as={Link} to={{
                        pathname: '/' + stage.owner.username,
                        state: { currentUser: stage.owner.username, currentUserId: stage.owner.id }
                    }}
                    >
                        {stage.owner.username}
                    </List.Item>
                </p>
                <List.Description>{stage.summary}</List.Description>
            </List.Content>
            <Divider/>
        </List.Item>
    ));

    return (
        <div>
            {loading &&
                <div className="text-center">
                    <div className="spinner-border text-secondary" role="status">
                        <span className="sr-only">正在加载...</span>
                    </div>
                </div>
            }

            {!loading && !error &&
                <List relaxed>{stageList}</List>
            }

            {(nextPage || prevPage) &&
                <PaginationForStage />
            }
        </div>
    )
}

export default StageList