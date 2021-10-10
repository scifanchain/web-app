import React from 'react'
import { Container, Message } from 'semantic-ui-react'

const Page404 = () => (
    <Container>
        <Message negative>
            <Message.Header>你似乎来到一个不存在的页面？</Message.Header>
            <br />
            <p>请确认访问的地址来源是否正确？</p>
        </Message>
    </Container>
)

export default Page404