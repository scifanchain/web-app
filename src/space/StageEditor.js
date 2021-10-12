import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

import { Button, Select, Grid, Form, Message, Input, Divider, Icon, TextArea } from 'semantic-ui-react';
import EditorJS from '@editorjs/editorjs';

import { get, put, post } from '../utils/Request';
import { countWords } from '../utils/Tools';


export default function StageEditor(props) {
    const { submitType } = props;

    const history = useHistory();
    const storage = window.localStorage;

    // 接收跳转参数
    const params = useParams();

    const [stageOwnerId, setStageOwnerId] = useState(0);
    const [stageTitle, setStageTitle] = useState('');
    const [stageSummary, setStageSummary] = useState('');
    const [stageContent, setStageContent] = useState({});
    const [stageType, setStageType] = useState(0)
    const [maturity, setMaturity] = useState(0)
    const [maturityText, setMaturityText] = useState('构思')
    const [contentError, setContentError] = useState('');
    const [loading, setLoading] = useState(true);
    const [titleError, setTitleError] = useState('');
    const [error, setError] = useState('');
    const [wordsCount, setWordsCount] = useState(0);

    const optionsType = [
        { key: 'TYPE_ERA', text: '时间', value: 1 },
        { key: 'TYPE_PLACE', text: '地点', value: 2 },
        { key: 'TYPE_PERSON', text: '人物', value: 3 },
        { key: 'TYPE_EVENT', text: '事件', value: 4 },
        { key: 'TYPE_CONCEPT', text: '概念', value: 5 },
    ]

    function getStage() {
        get('api/stages/' + params.stage_id + '/', {}, true)
            .then(function (res) {
                // 处理成功情况
                setLoading(false);
                console.log(res.data);
                setStageOwnerId(res.data.owner.id);
                setStageTitle(res.data.title);
                setStageSummary(res.data.summary);
                setStageContent(res.data.content);
                setStageType(res.data.type);
                setMaturity(res.data.maturity);
                setWordsCount(countWords(res.data.title, res.data.content));

                // 加载编辑器
                const editor = new EditorJS({
                    holder: 'editorjs',
                    data: res.data.content,
                    readOnly: false,
                    onChange: () => {
                        editor.save().then((outputData) => {
                            setStageContent(outputData);
                            // console.log(outputData);
                            setWordsCount(countWords(document.getElementById("StageTitle").value, outputData));
                        }).catch
                            ((error) => {
                                console.log('Saving failed: ', error)
                            });
                    }
                })
                setError('');
                // console.log(response);
            })
            .catch(function (error) {
                // 处理错误情况
                setLoading(false)
                setStageContent({})
                setError('很抱歉，没有获取到数据！')
                console.log(error);
            });
    }

    useEffect(() => {
        if (submitType == 'update') {
            getStage();
        }
        if (submitType == 'create') {
            const editor = new EditorJS({
                /** 
                 * Id of Element that should contain the Editor 
                 */
                holder: 'editorjs',
                autofocus: true,
                placeholder: '点击这里开始创作！',
                onChange: () => {
                    editor.save().then((outputData) => {
                        setStageContent(outputData);
                        setWordsCount(countWords(document.getElementById("StageTitle").value, outputData));
                    }).catch
                        ((error) => {
                            console.log('Saving failed: ', error)
                        });
                }
            })
        }
    }, [])


    // 标题值改变
    // todo: 验证是否有重名标题，有的话给出提示
    function handleChangeTitle(e) {
        setStageTitle(e.target.value)
        if (stageTitle.length >= 1) {
            setTitleError('')
        }
        setWordsCount(countWords(e.target.value, stageContent));
    }

    function handleChangeSummary(e) {
        setStageSummary(e.target.value);
    }

    // 验证标题是否为空
    function titleValidated() {
        if (stageTitle.length < 1) {
            setTitleError("标题不能为空")
            return false
        } else {
            setTitleError('')
        }
        return true
    }

    // 验证内容
    function contentValidated() {
        console.log(stageContent);
        if (stageContent.blocks.length < 1) {
            setContentError("内容为空。如果你是从别的地方复制过来的内容，请在编辑器中做些修改，这样编辑器才能获取到内容。")
            return false
        }
        return true
    }

    // 提交更新
    const putStage = () => {
        if (titleValidated() && contentValidated()) {
            put(
                'works/stage/update/' + params.stage_id + '/',
                {
                    "title": stageTitle,
                    "summary": stageSummary,
                    "content": stageContent,
                    "owner": stageOwnerId,
                    'type': stageType,
                    'maturity': maturity,
                    "words_count": wordsCount
                },
                true
            ).then(function (response) {
                console.log(response);
            }).catch(function (error) {
                console.log(error);
            });
            // history.push('/space/stage/' + params.stage_id);

            window.location = '/space/stage/' + params.stage_id;

        }
    }

    // 提交创建
    const postStage = () => {
        if (titleValidated() && contentValidated()) {
            post('api/stages/',
                {
                    "title": stageTitle,
                    "content": stageContent,
                    "summary": stageSummary,
                    'type': stageType,
                    'maturity': maturity,
                    "owner": storage.getItem('scifanchain_user_id'),
                    "words_count": wordsCount
                },
                true)
                .then(function (res) {
                    console.log(res);
                    history.push({
                        pathname: '/space/stage/' + res.data.id,
                    })
                })
                .catch(function (error) {
                    console.log(error);
                });
            // window.location = '/' + storage.getItem('scifanchain_username') + '/works/';
        }
    }


    const handleTypeChange = (e, { value }) => {
        setStageType(value);
    }

    const handleMaturityChange = (e) => {
        setMaturity(e.target.value);
        if (maturity >= 0 && maturity <= 20) {
            setMaturityText('构思');
        }
        if (maturity > 20 && maturity <= 40) {
            setMaturityText('草稿');
        }
        if (maturity > 40 && maturity <= 60) {
            setMaturityText('润色');
        }
        if (maturity > 60 && maturity <= 80) {
            setMaturityText('校对');
        }
        if (maturity > 80 && maturity <= 100) {
            setMaturityText('发布');
        }
    }

    return (
        <div>
            <Button as={Link} to={'/space/stage/' + params.stage_id}>返回</Button>
            <Button.Group floated='right'>
                {submitType == 'update' &&
                    <Button onClick={putStage}>提交修改</Button>
                }
                {submitType == 'create' &&
                    <Button onClick={postStage}>提交</Button>
                }
            </Button.Group>
            <Divider />
            {contentError &&
                <Message>{contentError}</Message>
            }
            <p className='font-small'> <Icon name='buysellads' /> {wordsCount} 字</p>
            <div className='editor-wrap'>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={6}>
                            <Select placeholder='类型' options={optionsType} style={{ marginRight: 1 + 'rem' }} value={stageType} onChange={handleTypeChange} />
                        </Grid.Column>
                        <Grid.Column width={6} as={Form}>
                            <Form.Input
                                id={'MaturityDuration'}
                                label={`成熟度: ${maturityText}`}
                                min={0}
                                max={100}
                                name='maturity'
                                onChange={handleMaturityChange}
                                step={1}
                                type='range'
                                value={maturity}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

                <Input fluid className='stage-title-input' onChange={handleChangeTitle} value={stageTitle} id='StageTitle' />
                <Form>
                    <TextArea rows={2} placeholder='摘要内容' onChange={handleChangeSummary} value={stageSummary} />
                </Form>
                <br />
                <div id='editorjs' className='editor-content'></div>
                {submitType == 'update' &&
                    <Button fluid style={{ marginTop: '1rem' }} onClick={putStage}>提交修改</Button>
                }
                {submitType == 'create' &&
                    <Button fluid style={{ marginTop: '1rem' }} onClick={postStage}>提交</Button>
                }

            </div>

        </div>
    )
}

