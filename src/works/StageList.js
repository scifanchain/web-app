import React, { useEffect, useState } from 'react';
import { List } from 'semantic-ui-react';
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
        <div key={stage.id} style={{ paddingTop: 1 + 'rem', paddingBottom: 1 + 'rem' }}>
            <List.Item  as={Link} to={
                {
                    pathname: '/stage/' + stage.id,
                }
            }>
                {stage.title}
            </List.Item>
            <List.Item as={Link} to={{pathname: '/space/' + stage.owner.username}}>
                {stage.owner.username}
            </List.Item>
            <p>{moment(stage.created).format("YYYY年MM月DD日HH时mm分")} <a href={'/space/' + stage.owner.username}>{stage.owner.username}</a></p>
        </div>
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
                <List>{stageList}</List>
            }
        </div>
    )
}

export default StageList