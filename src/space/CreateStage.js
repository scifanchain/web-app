import React, { useEffect, useState } from 'react';
import { Switch, Route, Link, useHistory } from 'react-router-dom';

import { Button, Dimmer, Loader, Grid, Sticky, Message, Input, Icon } from 'semantic-ui-react';
import EditorJS from '@editorjs/editorjs';

import { post } from '../utils/Request';
import { countWords } from '../utils/Tools';

export default function CreateStage() {
    const history = useHistory();
    const storage = window.localStorage;

    const [stageTitle, setStageTitle] = useState('');
    const [stageContent, setStageContent] = useState({});
    const [titleError, setTitleError] = useState('');
    const [contentError, setContentError] = useState('');
    const [wordsCount, setWordsCount] = useState(0);

    useEffect(() => {
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
    }, [])


    // 标题值改变
    // todo: 验证是否有重名标题，有的话给出提示
    function handleChange(e) {
        setStageTitle(e.target.value);
        console.log("title:" + stageTitle);
        if (stageTitle.length >= 1) {
            setTitleError('')
        }
        setWordsCount(countWords(e.target.value, stageContent));
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

    // 提交
    const postStage = () => {
        if (titleValidated() && contentValidated()) {
            post('api/stages/',
                {
                    "title": stageTitle,
                    "content": stageContent,
                    "owner": storage.getItem('scifanchain_user_id'),
                    "words_count": wordsCount
                },
                true)
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
            window.location = '/space/works/';
        }
    }

    return (
        <Grid>
            <Grid.Row>
                <Grid.Column width={12}>
                    <p className='font-small'> <Icon name='buysellads' /> {wordsCount} 字</p>
                    <div className='editor-wrap'>
                        <Input fluid placeholder='故事标题...' className='stage-title-input' onChange={handleChange} id='StageTitle' />
                        <div id='editorjs' className='editor-content'></div>
                        <Button fluid style={{ marginTop: '1rem' }} onClick={postStage}>发表</Button>
                    </div>
                </Grid.Column>
                <Grid.Column width={4}>

                </Grid.Column>
            </Grid.Row>

        </Grid>
    )
}

