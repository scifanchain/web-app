
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Header, Button, Dimmer, Loader, Divider, Icon, Container, Segment } from 'semantic-ui-react';

import MDEditor from '@uiw/react-md-editor';

import { get } from '../utils/Request';
import moment from 'moment';


export default function BlogDetail() {
    const params = useParams();
    const [blog, setBlog] = useState({});
    const [categoryName, setCategoryName] = useState('')
    const [ownerName, setOwnerName] = useState('')

    useEffect(() => {
        get('api/blogs/posts/' + params.blog_id).then((res) => {
            setBlog(res.data);
            setCategoryName(res.data.category.name);
            setOwnerName(res.data.owner.username);
        })
    }, [])

    return (
        <Container style={{ paddingTop: 1 + 'rem', paddingBottom: 1 + 'rem' }}>
            <Header>{blog.title}</Header>
            <p class='title-sub'>分类：{categoryName} <span style={{ marginLeft: 1 + 'rem' }}>{ownerName} 发布于： {moment(blog.created).format("YYYY年MM月DD日HH时mm分")}</span></p>
            <div>
                <MDEditor.Markdown source={blog.content} />
            </div>
        </Container>
    )
}
