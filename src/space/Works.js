import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useRecoilState } from 'recoil';
import { usernameState } from '../StateManager';

import { Button } from 'semantic-ui-react';

import StageList from './StageList';


export default function Works(props) {
    const { currentUser, currentUserId } = props.location.state;

    console.log(props.location.state);
    
    console.log("name:" + currentUser);
    console.log("good:" + currentUserId);
    const [username, setUsername] = useRecoilState(usernameState)

    return (
        <div>
            {/* <Menu text floated='right'>
                <Menu.Item
                    name='closest'
                    active={activeItem === 'closest'}
                    content='故事集'
                    onClick={handleItemClick}
                />
                <Menu.Item
                    name='mostComments'
                    active={activeItem === 'mostComments'}
                    content='单篇作品'
                    onClick={handleItemClick}
                />
            </Menu> */}
            {currentUser === username &&
                <Button as={Link} to={{ pathname: '/space/stage/create' }} style={{ marginBottom: '2rem' }}>开始创作</Button>
            }
            <StageList
                currentUser={currentUser}
                currentUserId={currentUserId}
            />
        </div>
    )
}

