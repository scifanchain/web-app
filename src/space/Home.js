import React, { useEffect, useState, createRef, createContext } from 'react';
import { Switch, Route, Link, useParams } from 'react-router-dom';
import { Grid, List, Button, Menu, Image, Container, Segment, Header } from 'semantic-ui-react';

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

import Page404 from '../utils/Page404';

// 本地存储
const storage = window.localStorage;
export const AuthorContext = createContext();

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
    const [username, setUsername] = useRecoilState(usernameState);
    const [currentUser, setCurrentUser] = useState('');
    const [author, setAuthor] = useState({});
    const [page404, setPage404] = useState(false);

    const [activeItem, setActiveItem] = useState('home');
    const handleItemClick = (e, { name }) => {
        setActiveItem(name);
    };

    const params = useParams();

    useEffect(() => {
        if (params.username) {
            setCurrentUser(params.username);
        }
        else {
            setCurrentUser(username);
        }
        get('api/users/' + currentUser)
            .then((res) => {
                setAuthor(res.data);
            })
            .catch((error) => {
                console.log(error);
                setPage404(true);
            })
    }, [currentUser])

    return (
        <Container fluid>
            {page404 &&
                <Page404 />
            }
            {!page404 &&
                <Grid>
                    <Grid.Row>
                        <Grid.Column textAlign='center' width={3}>
                            {currentUser &&
                                <Image src={config.API_URL + 'media/avatars/2021/' + currentUser + '.svg'} size='small' centered id='Avatar' />
                            }
                            {currentUser === username &&
                                <Button size='tiny' onClick={changeAvatar} style={{ margin: '1rem' }}>换头像</Button>
                            }
                            <Header as={'h5'}>{author.username}</Header>
                            <Menu text vertical className='menu-avatar'>
                                <Menu.Item as={Link} to={{ pathname: '/' + currentUser + '/works', state: { currentUser: currentUser, currentUserId: author.id } }}
                                    name='作品列表'
                                    active={activeItem === '作品列表'}
                                    onClick={handleItemClick}
                                />
                                <Menu.Item as={Link} to={{ pathname: '/' + currentUser + '/profile', state: { currentUser: currentUser } }}
                                    name='个人资料'
                                    active={activeItem === '个人资料'}
                                    onClick={handleItemClick}
                                />
                                <Menu.Item as={Link} to={{ pathname: '/' + currentUser + '/wallet', state: { currentUser: currentUser } }}
                                    name='钱包地址'
                                    active={activeItem === '钱包地址'}
                                    onClick={handleItemClick}
                                />
                            </Menu>
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <Switch>
                                <Route path='/space/stage/create' component={CreateStage} />
                                <Route path='/space/stage/edit/:stage_id' component={EditStage} />
                                <Route path='/space/stage/:stage_id' component={StageDetail} />
                                <Route path='/:username/profile' component={Profile} />
                                <Route path='/:username/wallet' component={Wallet} />
                                <Route path='/:username/works' component={Works} />
                                <Route path='/:username' component={Works} />
                            </Switch>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            }
        </Container>
    )
}
