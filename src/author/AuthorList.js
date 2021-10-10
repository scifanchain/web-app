import React, {useEffect, useState } from 'react'
import { Header, Image, Table } from 'semantic-ui-react'
import moment from 'moment';

import config from '../config';
import { get } from '../utils/Request'

export default function AuthorList() {
    const [authors, setAuthors] = useState([]);

    useEffect(() => {
        get('authors/active_author_list/', {}, true).then(res => {
            console.log(res);
            setAuthors(res.data)
        }).catch(function (error) {
            console.log(error);
        });
    }, []);

    const authorListItem = authors.map((author) => (
        <Table.Row key={author.id}>
            <Table.Cell>
                <Header as='h4' image>
                    {/* <Image src='https://react.semantic-ui.com/images/avatar/small/lena.png' rounded size='mini' /> */}
                    {/* <Image src={config.URL + 'media/avatars/2021/' + username + '.svg'} avatar id='AvatarTiny' /> */}
                    <Image src={config.URL + 'media/avatars/2021/' + author.username + '.svg'} rounded size='mini' />
                    <Header.Content>
                        {author.username}
                        <Header.Subheader>{moment(author.last_login).format("YYYY年MM月DD日HH时mm分")}</Header.Subheader>
                    </Header.Content>
                </Header>
            </Table.Cell>
        </Table.Row>
    ));

    return (
        <Table basic='very' celled >
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>最近活跃用户</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {authorListItem}
            </Table.Body>
        </Table>
    )
}