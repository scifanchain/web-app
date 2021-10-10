
import React, { useEffect, useState, createRef } from 'react';
import { List, Segment, Button, Label, Header, Image } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import { get } from '../utils/Request';

function StagePersonListWidget() {
    const [stagesPerson, setStagesPerson] = useState([])
    const [stagesPersonCount, setStagesPersonCount] = useState(0)
    const [page, setPage] = useState(1)

    useEffect(() => {
        get('api/stages/?type=3&page=' + page).then(res => {
            console.log(res);
            setStagesPerson(res.data.results);
            setStagesPersonCount(res.data.count);
        }).catch(error => {
            console.log(error)
        });
    }, [page,])

    const stagesPersonList = stagesPerson.map((stage) => (
        <List.Item key={stage.id} as={Link} to={
            {
                pathname: '/stage/' + stage.id,
            }
        }>
            {stage.title}
        </List.Item>
    ));

    const updateList = () => {
        setPage(page + 1)
    }

    return (
        <Segment.Group>
            <Segment secondary key='mini' size='mini'>
                <Button
                    compact
                    size='small'
                    floated='right'
                    onClick={updateList}
                >
                    换一批
                </Button>
                人物 <Label circular>{stagesPersonCount}</Label>

            </Segment>
            <Segment>
                <List>
                    {stagesPersonList}
                </List>
            </Segment>
        </Segment.Group>
    )
}

function StagePlaceListWidget() {
    const [stagesPlace, setStagesPlace] = useState([])
    const [stagesPlaceCount, setStagesPlaceCount] = useState(0)

    useEffect(() => {
        get('api/stages/?type=2').then(res => {
            console.log(res);
            setStagesPlace(res.data.results);
            setStagesPlaceCount(res.data.count);
        }).catch(error => {
            console.log(error)
        });
    }, [])

    const stagesPlaceList = stagesPlace.map((stage) => (
        <List.Item key={stage.id} as={Link} to={
            {
                pathname: '/stage/' + stage.id,
            }
        }>
            {stage.title}
        </List.Item>
    ));

    return (
        <Segment.Group>
            <Segment secondary key='mini' size='mini'>
                <Button
                    compact
                    size='small'
                    floated='right'
                    onClick={() => dispatch({ type: 'clearLog' })}
                >
                    换一批
                </Button>
                地点 <Label circular>{stagesPlaceCount}</Label>

            </Segment>
            <Segment>
                <List>
                    {stagesPlaceList}
                </List>
            </Segment>
        </Segment.Group>
    )
}

function StageEventListWidget() {
    const [stagesEvent, setStagesEvent] = useState([])
    const [stagesEventCount, setStagesEventCount] = useState(0)

    useEffect(() => {
        get('api/stages/?type=4').then(res => {
            console.log(res);
            setStagesEvent(res.data.results);
            setStagesEventCount(res.data.count);
        }).catch(error => {
            console.log(error)
        });
    }, [])

    const stagesEventList = stagesEvent.map((stage) => (
        <List.Item key={stage.id} as={Link} to={
            {
                pathname: '/stage/' + stage.id,
            }
        }>
            {stage.title}
        </List.Item>
    ));

    return (
        <Segment.Group>
            <Segment secondary key='mini' size='mini'>
                <Button
                    compact
                    size='small'
                    floated='right'
                    onClick={() => dispatch({ type: 'clearLog' })}
                >
                    换一批
                </Button>
                事件 <Label circular>{stagesEventCount}</Label>

            </Segment>
            <Segment>
                <List>
                    {stagesEventList}
                </List>
            </Segment>
        </Segment.Group>
    )
}

function StageConceptListWidget() {
    const [stagesConcept, setStagesConcept] = useState([])
    const [stagesConceptCount, setStagesConceptCount] = useState(0)

    useEffect(() => {
        get('api/stages/?type=5').then(res => {
            console.log(res);
            setStagesConcept(res.data.results);
            setStagesConceptCount(res.data.count);
        }).catch(error => {
            console.log(error)
        });
    }, [])

    const stagesConceptList = stagesConcept.map((stage) => (
        <List.Item key={stage.id} as={Link} to={
            {
                pathname: '/stage/' + stage.id,
            }
        }>
            {stage.title}
        </List.Item>
    ));

    return (
        <Segment.Group>
            <Segment secondary key='mini' size='mini'>
                <Button
                    compact
                    size='small'
                    floated='right'
                    onClick={() => dispatch({ type: 'clearLog' })}
                >
                    换一批
                </Button>
                概念 <Label circular>{stagesConceptCount}</Label>

            </Segment>
            <Segment>
                <List>
                    {stagesConceptList}
                </List>
            </Segment>
        </Segment.Group>
    )
}

export { StagePersonListWidget, StagePlaceListWidget, StageEventListWidget, StageConceptListWidget }