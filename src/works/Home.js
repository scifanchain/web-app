import React, { useEffect, useState, createRef } from 'react';
import { Grid, Advertisement, Segment, Button, Label, Header, Image } from 'semantic-ui-react'

import StageList from './StageList';
import AuthorList from '../author/AuthorList';
import { StagePersonListWidget, StagePlaceListWidget, StageEventListWidget, StageConceptListWidget } from './Widget';

const contextRef = createRef();

function WorksHome() {

    return (
        <Grid>
            <Grid.Row>
                <Grid.Column width={3}>
                    <StagePersonListWidget/>
                    <StagePlaceListWidget/>
                    <StageEventListWidget/>
                    <StageConceptListWidget/>
                </Grid.Column>
                <Grid.Column width={10}>
                    <Advertisement unit='panorama' test='无论是一个有想象力的创意，还是一篇科幻故事，都可以在以区块链为主导的Web3.0时代彰显其从前被忽视的价值。'
                        style={{ width: "100%", marginBottom: "1rem" }}
                    />
                    <Header as='h3'>
                        最新作品
                    </Header>
                    <StageList />
                </Grid.Column>
                <Grid.Column width={3}>
                    <AuthorList />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

export default WorksHome