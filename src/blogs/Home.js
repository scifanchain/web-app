import React, { useEffect, useState, createRef, createContext } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { Grid, List, Button, Menu, Image, Container } from 'semantic-ui-react';

import { useRecoilState } from 'recoil';
import { usernameState } from '../StateManager';

import config from '../config';
import { get } from '../utils/Request';

import BlogList from './BlogList';
import BlogCategory from './BlogCategory';
import BlogDetail from './BlogDetail';


export default function BlogHome() {


    return (
        <Container fluid>
            <Grid>
                <Grid.Row>
                    <Grid.Column textAlign='center' width={3} style={{ marginBottom: 1 + 'rem' }}>
                        <BlogCategory />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        {/* <BlogList /> */}
                        <Switch>
                            <Route path='/blogs/category/:blog_id' component={BlogList} />
                            <Route path='/blogs/detail/:blog_id' component={BlogDetail} />
                            <Route path='/blogs' component={BlogList} />
                        </Switch>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    )
}