import React, {useEffect, useState } from 'react'
import { Header, Image, Table } from 'semantic-ui-react'

import config from '../config';
import { get } from '../utils/Request'

export default function AuthorList() {
    const [authors, setAuthors] = useState([]);

    useEffect(() => {
        get('api/users/', {}, true).then(res => {
            console.log(res);
            setAuthors(res.data.results)
        }).catch(function (error) {
            console.log(error);
        });
    }, []);

    const authorListItem = authors.map((author) => (
        <Table.Row>
            <Table.Cell>
                <Header as='h4' image>
                    {/* <Image src='https://react.semantic-ui.com/images/avatar/small/lena.png' rounded size='mini' /> */}
                    {/* <Image src={config.URL + 'media/avatars/2021/' + username + '.svg'} avatar id='AvatarTiny' /> */}
                    <Image src={config.URL + 'media/avatars/2021/' + author.username + '.svg'} rounded size='mini' />
                    <Header.Content>
                        {author.username}
                        <Header.Subheader>Human Resources</Header.Subheader>
                    </Header.Content>
                </Header>
            </Table.Cell>
            <Table.Cell>{author.id}</Table.Cell>
        </Table.Row>
    ));

    return (
        <Table basic='very' celled collapsing>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>最近活跃用户</Table.HeaderCell>
                    <Table.HeaderCell>发表文章</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {authorListItem}
            </Table.Body>
        </Table>
    )
}