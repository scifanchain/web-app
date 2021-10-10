import React, { useEffect, useState } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { Header } from 'semantic-ui-react';
import moment from 'moment';

import { get } from '../utils/Request';


export default function Profile(props) {

    const { currentUser } = props.location.state;
    const [author, setAuthor] = useState({});
    const [email, setEmail] = useState('');

    useEffect(() => {
        get('api/users/' + currentUser, {}, true)
            .then((res) => {
                setAuthor(res.data);
                setEmail(res.data.email);
            })
    }, [])

    return (
        <div>
            <Header>个人资料</Header>
            <div>用户名：{ author.username}</div>
            <div>邮箱：{ email.substr(0,3) + '****' + email.substr(7)}</div>
            <div>注册日期：{moment(author.date_joined).format("YYYY年MM月DD日HH时mm分")}</div>
        </div>
    )
}