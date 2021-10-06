import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { SubstrateContextProvider, useSubstrate } from '../substrate-lib';

import EditorJS from '@editorjs/editorjs';

import { Button, Icon, Rating, Progress, Grid, Popup } from 'semantic-ui-react';
import { get } from '../utils/Request';

import PoE from '../chain/PoE';


export default function StageDetail() {
    // 接收跳转参数
    const params = useParams();

    const [stage, setStage] = useState({})
    const [stageOwner, setStageOwner] = useState({})
    const [maturity, setMaturity] = useState(0);
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
                setStageOwner(res.data.owner);

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
        setHandlePoE(true);
    }

    const cancelPoE = () => {
        setHandlePoE(false);
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

    return (
        <div>
            {!handlePoE &&
                <Button onClick={startPoE}>上链存证</Button>
            }
            {handlePoE &&
                <Button onClick={cancelPoE}>退出存证</Button>
            }
            <Button onClick={startPoE}>获取SFT</Button>

            {handlePoE &&
                <SubstrateContextProvider>
                    <PoE stage={stage} />
                </SubstrateContextProvider>
            }

            <Grid>
                <Grid.Row>
                    <Grid.Column width={14}>
                        <p>
                            <span>Token指数: 23.56 SFT</span>
                        </p>
                    </Grid.Column>
                    <Grid.Column width={2} textAlign='right'>
                        {(() => {
                            switch (stage.openess) {
                                case 'PUBLIC':
                                    return <Popup
                                        trigger={<Icon circular name='world' />}
                                        content='开放作品，任何登录用户皆可参与。'
                                        size='mini'
                                    />;
                                    break;
                                case 'SEMI_PUBLIC':
                                    return <Popup
                                        trigger={<Icon circular name='shield' />}
                                        content='受保护作品，只允许受邀请的作者参与。'
                                        size='mini'
                                    />;;
                                    break;
                                case 'PRIVATE':
                                    return <Popup
                                        trigger={<Icon circular name='user secret' />}
                                        content='私密作品，只有创建者可以修改。'
                                        size='mini'
                                    />;;
                                    break;
                                default: return null;
                            }
                        }
                        )()}
                        <Button icon as={Link} to={'/space/stage/edit/' + params.stage_id} style={{ marginBottom: 1 + 'rem' }}>
                            <Icon name='edit' /> 修改</Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <div className='editor-wrap'>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={6}>
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
                        <Grid.Column width={10} textAlign='right'>
                            <Rating icon='star' defaultRating={0} maxRating={5} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

                <h2 className='stage-title' id='stageTitle'>{stage.title}</h2>
                <div id="editorjs" className='editor-content'></div>
            </div>
        </div>
    );
};