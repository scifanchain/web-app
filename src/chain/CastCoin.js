import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Message, Icon, Input, Loader, Dimmer, Segment, Table } from 'semantic-ui-react';

export function CastCoin(props) {
    const { stage } = props;
    return (
        <Message>
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>统计项</Table.HeaderCell>
                        <Table.HeaderCell>计算方式</Table.HeaderCell>
                        <Table.HeaderCell>SFT数额</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>字数：{ stage.words_count}字</Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell>Cell</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>成熟度</Table.Cell>
                        <Table.Cell>Cell</Table.Cell>
                        <Table.Cell>Cell</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>评级</Table.Cell>
                        <Table.Cell>Cell</Table.Cell>
                        <Table.Cell>Cell</Table.Cell>
                    </Table.Row>
                </Table.Body>
                <Table.Footer fullWidth>
                    <Table.Row>
                        <Table.HeaderCell>共计</Table.HeaderCell>
                        <Table.HeaderCell colSpan='4'>
                            <Button
                                floated='right'
                                icon
                                labelPosition='left'
                                primary
                                size='small'
                            >
                                <Icon name='user' /> Add User
                            </Button>
                            <Button size='small'>Approve</Button>
                            <Button disabled size='small'>
                                Approve All
                            </Button>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            </Table>
            <Button>铸造</Button>
        </Message>
    )
}