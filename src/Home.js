import React, { useEffect, useState, createRef } from 'react';
import { Container, Grid, Advertisement, Segment, Button, Label, Header, Image } from 'semantic-ui-react'

import StageList from './works/StageList';
import AuthorList from './author/AuthorList';

const contextRef = createRef();

function Home() {

  return (
    <Container fluid style={{ backgroundColor: '#000' }}>
      <Container style={{ width: '70%' }}>
        <Grid divided='vertically' verticalAlign='middle'>
          <div id='HomeAD'>
            <Header as='h3' textAlign='center' inverted style={{marginTop: 12 + 'rem'}}>
              银河星旋的探索者们已经启程，他们在星球文明之间穿梭，在语言间徜徉，体验时间、梦和生命的欢畅。
            </Header>
          </div>

          <Grid.Row centered>
            <Header as='h1' textAlign='center' inverted>理念与愿景</Header>
            <br /><br />
          </Grid.Row>

          <Grid.Row columns={2}>
            <Grid.Column>
              <Segment inverted size='large' className='home-text'>
                SciFanChain是一个专注于科幻创意产业的应用区块链。Sci-Fan-Chain分别代表科学、幻想和区块链。赛凡的概念是重塑科幻产业的生产关系，使科幻产业价值创造更加高效，分配更加合理公平。其核心目标是捕获科幻产业的价值，充分利用新思维、新技术、新生态建设模式，让创作者、读者、投资者、传播者和运营商以更富创造力的方式进行合作，推动科幻产业的快速发展。
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Image src='/images/value_get.svg' />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row centered>
            <Header as='h1' textAlign='center' inverted>技术架构</Header>
            <br /><br />
          </Grid.Row>

          <Grid.Row columns={2}>
            <Grid.Column>
              <Image src='/images/structure.png' />
            </Grid.Column>
            <Grid.Column>
              <Segment inverted size='large' className='home-text'>
                赛凡链从上游获取科幻产业链的资源和价值，最终使其在现实中得到应用，形成一个完整的闭环。赛凡链上所有作品的价值都可以进入现实世界。书面作品可以衍生CG、3D模型、VR、影视作品，可以成为纸质出版物和电子出版物，可以通过订阅方式直接在线分发给读者。它们最终将产生真正的价值。当这个链条逐渐发展和成熟时，它将成为科幻产业的基础设施，线下公司、机构和员工都可以将他们的劳动成果转移到链上。赛凡链映射科幻产业的价值，这些价值真正属于创造它的人。
              </Segment>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row centered>
            <Header as='h1' textAlign='center' inverted>独特价值</Header>
            <br /><br />
          </Grid.Row>

          <Grid.Row columns={2}>
            <Grid.Column>
              <Segment inverted size='large' className='home-text'>
                赛凡链上的每一部作品都具有独特的价值。在作品的线上创作过程中融合了多种技术，它们都构成了作品的基因，使其意义远远超出了作品本身的内容。
                Scifan chain使用人工创建来代替算法挖掘。我们坚信，语言、科学和艺术、想象力和思维，以及星光灿烂的宇宙都是有价值的，创造者可以将它们挖掘出来，而算法对此无能为力。赛凡链的通证基于人类的创造力和劳动，围绕创作过程设计了一系列算法和协议，以合理表达作品在不同阶段的价值。简言之，我们使用字数作为参考来表示作品的数量价值，而作品的质量价值则通过等级和成熟度来表示，定量值由程序统计给出，质量值由社区通过投票进行评选。
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Image src='/images/DNA.svg' />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row centered>
            <Header as='h1' textAlign='center' inverted>路线图</Header>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Image src='/images/roadmap.svg' centered />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row centered>
            <Header as='h1' textAlign='center' inverted>创始团队</Header>
            <br /><br />
          </Grid.Row>

          <Grid padded>
            <Grid.Row columns={5} centered>
              <Grid.Column>
                <Image src='/images/unity.jpg' circular />
                <Segment inverted>
                  Unity, 创始人、独立开发者、科幻小说作者，应用层和客户端开发。
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Image src='/images/chaijie.jpg' circular />
                <Segment inverted>
                  Jet Tsai,中国科技大学硕士研究生， 《Rust》杂志编辑。
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Image src='/images/lixing.jpg' circular />
                <Segment inverted>
                  April, 管理运营，社区活动组织与推广。
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Image src='/images/stven.jpg' circular />
                <Segment inverted>
                  Stevenyin, 拥有丰富开发经验，区块链技术开发。
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Image src='/images/moon.jpg' circular />
                <Segment inverted>
                  Moon，从事项目策划和品牌整合营销，具有较强的策划和市场运作能力。负责品牌策划及市场推广。
                </Segment>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row centered>
              <Header as='h1' textAlign='center' inverted>生态伙伴</Header>
              <br /><br />
            </Grid.Row>

            <Grid.Row columns={2}>
              <Grid.Column textAlign='center'>
                <Image centered
                  src='/images/octopus_logo_white.png'
                  as='a'
                  size='small'
                  href='http://google.com'
                  target='_blank'
                />
              </Grid.Column>
              <Grid.Column textAlign='center'>
                <Image centered
                  src='/images/logo_near.png'
                  as='a'
                  size='small'
                  href='http://google.com'
                  target='_blank'
                />
              </Grid.Column>
            </Grid.Row>

          </Grid>
        </Grid>
      </Container>
    </Container>
  )
}

export default Home