import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { SubstrateContextProvider, useSubstrate } from '../substrate-lib';

import { useRecoilState } from 'recoil';
import { userIdState, usernameState } from '../StateManager';

import EditorJS from '@editorjs/editorjs';

import { Button, Icon, Rating, Progress, Grid, Segment, Divider, Message } from 'semantic-ui-react';
import { get, put } from '../utils/Request';

import PoE from '../chain/PoE';

export default function StageDetail() {
    // 接收跳转参数
    const params = useParams();

    const [userId, setUserId] = useRecoilState(userIdState)
    const [username, setUsername] = useRecoilState(usernameState)

    const [stage, setStage] = useState({})
    const [stageOwnerId, setStageOwnerId] = useState(0)
    const [maturity, setMaturity] = useState(0);
    const [hasAddress, setHasAddress] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const [handlePoE, setHandlePoE] = useState(false);

    // 加载数据
    useEffect(() => {
        get('api/stages/' + params.stage_id + '/', {}, true)
            .then(function (res) {
                // 处理成功情况
                setLoading(false);
                console.log(res.data);
                setStage(res.data);
                setStageOwnerId(res.data.owner.id);
                console.log(stageOwnerId);

                // 加载编辑器
                const editor = new EditorJS({
                    holder: 'editorjs',
                    data: res.data.content,
                    readOnly: true,
                    minHeight: 0,
                })
                setError('');
            })
            .catch(function (error) {
                // 处理错误情况
                setLoading(false)
                setStage({})
                setError('很抱歉，没有获取到数据！')
                console.log(error);
            });
    }, []);

    const startPoE = () => {
        // 判断钱包地址是否设置
        get('authors/wallets/' + username + '/', {}, true)
            .then((res) => {
                if (!res.data.address) {
                    setHasAddress(false);
                }
                setHandlePoE(true);
            })
        // 
    }

    const cancelPoE = () => {
        setHandlePoE(false);
        setHasAddress(true);
    }

    const stageOpeness = () => {
        switch (stage.openess) {
            case 'PUBLIC': return '开放的';
                break;
            case 'SEMI_PUBLIC': return '半开放的';
                break;
            case 'PRIVATE': return '私密的';
                break;
            default: return null;
        }
    }

    const handelRating = () => {
        put(
            'works/stage/update/' + params.stage_id + '/',
            {
                "stars": stage.stars + 1,
            },
            true
        ).then(function (response) {
            console.log(response);
        }).catch(function (error) {
            console.log(error);
        });
    }

    return (
        <div>
            {stageOwnerId == userId && !handlePoE &&
                <Button onClick={startPoE}>上链存证</Button>
            }
            {stageOwnerId == userId && handlePoE &&
                <Button onClick={cancelPoE}>退出存证</Button>
            }

            {stageOwnerId == userId && handlePoE && hasAddress &&
                <SubstrateContextProvider>
                    <PoE stage={stage} />
                </SubstrateContextProvider>
            }

            {!hasAddress &&
                <Message>
                执行该操作需要解锁赛凡的链上令牌（钱包地址），您好像还没有设置。
                <br /><br />
                    <Button as={Link} to={{
                        pathname: '/' + username + '/wallet', state: { currentUser: username, currentUserId: userId }
                    }}>
                        前往设置令牌和钱包地址
                    </Button>
                </Message>
            }

            {stageOwnerId == userId &&
                <Divider />
            }

            <div className='editor-wrap'>
                <Grid>
                    <Grid.Row>
                        {/* <Grid.Column width={1}>
                            {(() => {
                                switch (stage.openess) {
                                    case 'PUBLIC':
                                        return <Popup
                                            trigger={<Icon name='compress' />}
                                            content='开放作品，任何登录用户皆可参与。'
                                            size='mini'
                                        />;
                                        break;
                                    case 'SEMI_PUBLIC':
                                        return <Popup
                                            trigger={<Icon name='shield' />}
                                            content='受保护作品，只允许受邀请的作者参与。'
                                            size='mini'
                                        />;;
                                        break;
                                    case 'PRIVATE':
                                        return <Popup
                                            trigger={<Icon name='user secret' />}
                                            content='私密作品，只有创建者可以修改。'
                                            size='mini'
                                        />;;
                                        break;
                                    default: return null;
                                }
                            }
                            )()}
                        </Grid.Column> */}
                        <Grid.Column width={5}>
                            <Progress percent={stage.maturity} indicating size='tiny' id='MaturityProgress' />
                            <Grid>
                                <Grid.Row columns={5} textAlign='center' className='font-small'>
                                    <Grid.Column>构思</Grid.Column>
                                    <Grid.Column>草稿</Grid.Column>
                                    <Grid.Column>润色</Grid.Column>
                                    <Grid.Column>校对</Grid.Column>
                                    <Grid.Column>发布</Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Grid.Column>

                        <Grid.Column width={9}>
                            {/* <Rating onClick={handelRating} /><span>{stage.stars}</span> */}
                            <span className='font-small' style={{ paddingLeft: 1 + 'rem' }}><Icon name='buysellads' />{stage.words_count}</span>
                        </Grid.Column>
                        <Grid.Column width={2} textAlign='right'>
                            {stageOwnerId == userId &&
                                <Button size='tiny' icon as={Link} to={'/space/stage/edit/' + params.stage_id} style={{ marginBottom: 1 + 'rem' }}>
                                    <Icon name='edit' /> 修改
                                </Button>
                            }

                        </Grid.Column>
                    </Grid.Row>
                </Grid>

                <h2 className='stage-title' id='stageTitle'>{stage.title}</h2>
                <Segment color='grey'>摘要：{stage.summary}</Segment>
                <div id="editorjs" className='editor-content'></div>
            </div>
        </div>
    );
};