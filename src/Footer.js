import React, { useState } from 'react';
import { Container, Menu, Divider } from 'semantic-ui-react'
import { Link } from 'react-router-dom';

export default function Footer() {
    const { activeItem, setActiveItem } = useState('closest')

    const handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    return (
        <Container fluid style={{ backgroundColor: '#000' }}>
            <Menu fluid text inverted>
                <Menu.Item>&copy; 赛凡网络 2021</Menu.Item>
                <Menu.Item
                    as={Link}
                    to={{
                        pathname = 'https://whitebook.scifanchain.com'
                    }}
                    name='whitebook'
                    active={activeItem === 'whitebook'}
                    content="白皮书"
                    onClick={handleItemClick}
                />
                <Menu.Item
                    as={Link}
                    to={{
                        pathname = 'https://whitebook.scifanchain.com'
                    }}
                    name='docs'
                    active={activeItem === 'docs'}
                    content="文档"
                    onClick={handleItemClick}
                />
            </Menu>
        </Container>
    )
}