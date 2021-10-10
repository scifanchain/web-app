import React, { useEffect, useState, createRef, createContext } from 'react';
import { Switch, Route, Link, useParams } from 'react-router-dom';
import { Grid, List, Button, Menu, Image, Container } from 'semantic-ui-react';

import { useRecoilState } from 'recoil';
import { usernameState } from '../StateManager';

import config from '../config';
import { get } from '../utils/Request';

import Profile from './Profile';
import Works from './Works';
import Wallet from './Wallet';
import CreateStage from './CreateStage';
import EditStage from './EditStage';
import StageList from './StageList';
import StageDetail from './StageDetail';

// 本地存储
const storage = window.localStorage;
export const AuthorContext = createContext();

export function SpaceMenu() {

    

    const [activeItem, setActiveItem] = useState('home');
    const handleItemClick = (e, { name }) => setActiveItem(name);

    return (
        <Menu text vertical className='menu-avatar'>
            {/* <Menu.Item as={Link} to='/space'
                name='我的空间'
                active={activeItem === '我的空间'}
                onClick={handleItemClick}
            /> */}
            <Menu.Item as={Link} to='/space/profile'
                name='个人资料'
                active={activeItem === '个人资料'}
                onClick={handleItemClick}
            />
            <Menu.Item as={Link} to='/space/works'
                name='作品列表'
                active={activeItem === '作品列表'}
                onClick={handleItemClick}
            />
            <Menu.Item as={Link} to='/space/wallet'
                name='钱包地址'
                active={activeItem === '钱包地址'}
                onClick={handleItemClick}
            />
        </Menu>
    )
}

function changeAvatar() {
    get(config.API_URL + 'authors/change_avatar/', {}, true)
        .then(function (res) {
            if (res.data !== "") {
                console.log(res.data)
                let i = Math.random();
                document.getElementById("Avatar").src = config.URL + res.data + ".svg?i=" + i;
                document.getElementById("AvatarTiny").src = config.URL + res.data + ".svg?i=" + i;
            }
            else (
                console.log('error')
            )
        })
}


export default function SpaceHome() {

    // 同步用户状态
    const [username, setUsername] = useRecoilState(usernameState)

    return (
        <Container fluid>
            <Grid>
                <Grid.Row>
                    <Grid.Column textAlign='center' width={3}>
                        <Image src={config.API_URL + 'media/avatars/2021/' + username +'.svg'} size='small' centered id='Avatar'/>
                        <Button size='tiny' onClick={changeAvatar} style={{margin: '1rem'}}>换头像</Button>
                        <SpaceMenu />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Switch>
                            <Route path='/space/profile' component={Profile} />
                            <Route path='/space/works' component={Works} />
                            <Route path='/space/wallet' component={Wallet} />
                            <Route path='/space/stages' component={StageList} />
                            <Route path='/space/stage/create' component={CreateStage} />
                            <Route path='/space/stage/edit/:stage_id' component={EditStage} />
                            <Route path='/space/stage/:stage_id' component={StageDetail} />
                        </Switch>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    )
}
