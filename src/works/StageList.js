import React, { useEffect, useState } from 'react';
import { List, Divider } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { get } from '../utils/Request';

function StageList() {
    const [loading, setLoading] = useState(true);
    const [stages, setStages] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {
        get('api/stages/', {}, false)
            .then(function (response) {
                // 处理成功情况
                setLoading(false)
                setStages(response.data.results)
                setError('')
                console.log(response);
            })
            .catch(function (error) {
                // 处理错误情况
                setLoading(false)
                setStages([])
                setError('很抱歉，没有获取到数据！')
                console.log(error);
            });
    }, [])

    const stageList = stages.map((stage) => (
        <List.Item>
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
        </div>
    )
}

export default StageList