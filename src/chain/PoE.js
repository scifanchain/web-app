import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Message, Icon, Input, Loader, Dimmer, Segment, Table } from 'semantic-ui-react';

import { useSubstrate } from '../substrate-lib';
import { TxButton } from '../substrate-lib/components';
// Polkadot-JS utilities for hashing data.
import { blake2AsHex } from '@polkadot/util-crypto';

import { get } from '../utils/Request';


export function Main(props) {
  const { api, apiState, keyring, keyringState, apiError } = useSubstrate();

  const storage = window.localStorage;

  const { stage } = props;

  const [accountAddress, setAccountAddress] = useState('');
  const [status, setStatus] = useState('');
  const [digest, setDigest] = useState('');
  const [owner, setOwner] = useState('');
  const [block, setBlock] = useState(0);
  const [unlockError, setUnlockError] = useState(null);
  const [isBusy, setIsBusy] = useState(false);

  const passwordInput = useRef('');

  useEffect(() => {
    get('authors/my_wallets/' + storage.getItem('scifanchain_user_id') + '/', {}, true)
      .then((res) => {
        setAccountAddress(res.data.address);
      });
  }, []);

  // 获取当前账户
  const accountPair =
    accountAddress &&
    keyringState === 'READY' &&
    keyring.getPair(accountAddress);

  const loader = text =>
    <Dimmer.Dimmable style={{ padding: 1 + 'rem' }}>
      <Dimmer active inverted>
        <Loader size='small'>{text}</Loader>
      </Dimmer>
      <br />
    </Dimmer.Dimmable>

  if (apiState === 'ERROR') return message(apiError);
  else if (apiState !== 'READY') return loader('加载数据中，请稍侯……');

  if (keyringState !== 'READY') {
    return loader('Loading accounts (please review any extension\'s authorization)');
  }

  // 哈希内容
  const hashStage = (address, stage) => {
    const allContent = {
      Submitter_address: address,
      stage: stage,
    }
    const jsonContent = JSON.stringify(allContent)
    const hash = blake2AsHex(jsonContent, 256);
    setDigest(hash);
    return hash;
  }

  // 链上验证
  const queryPoE = () => {
    const hash = hashStage(accountPair.address, stage);
    let unsubscribe;
    // Polkadot-JS API query to the `proofs` storage item in our pallet.
    // This is a subscription, so it will always get the latest value,
    // even if it changes.
    api.query.poe
      .proofs(hash, (result) => {
        // Our storage item returns a tuple, which is represented as an array.
        setOwner(result[0].toString());
        setBlock(result[1].toNumber());
        console.log(result[0].toString());
        console.log(result[1].toNumber());
      })
      .then((unsub) => {
        unsubscribe = unsub;
      });

    // This tells the React hook to update whenever the file digest changes
    // (when a new file is chosen), or when the storage subscription says the
    // value of the storage item has updated.
    return () => unsubscribe && unsubscribe();
  }

  // We can say a file digest is claimed if the stored block number is not 0.
  function isClaimed() {
    return block !== 0;
  }

  // 获取密码
  function getPassword(e) {
    passwordInput.current = e.target.value;
  }

  // 解锁帐户
  const unlock = (
    () => {
      if (!accountPair || !accountPair.isLocked) {
        return;
      }
      setIsBusy(true);
      setTimeout(() => {
        try {
          accountPair.decodePkcs8(passwordInput.current);
          setUnlockError(null)
        } catch (error) {
          setIsBusy(false);
          console.log(error);
          return setUnlockError('解锁失败，请更换密码重新尝试。');
        }

        setIsBusy(false);
      }, 0);
    }
  );

  const CastCoin = () => {
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>统计项</Table.HeaderCell>
            <Table.HeaderCell>数额</Table.HeaderCell>
            <Table.HeaderCell>说明方式</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>字数</Table.Cell>
            <Table.Cell>{stage.words_count}字</Table.Cell>
            <Table.Cell>每字1个SFT作为基数。</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>成熟度</Table.Cell>
            <Table.Cell>{stage.maturity}</Table.Cell>
            <Table.Cell>0%-100%</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>评级</Table.Cell>
            <Table.Cell>{stage.level}</Table.Cell>
            <Table.Cell>分为1-5级</Table.Cell>
          </Table.Row>
          <Table.Row warning>
            <Table.Cell>共计</Table.Cell>
            <Table.Cell>{stage.words_count * stage.maturity / 100 * stage.level}</Table.Cell>
            <Table.Cell>字数 * 成熟度 * 评级</Table.Cell>
          </Table.Row>
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan='3'>
              <TxButton
                color={'teal'}
                accountPair={accountPair}
                label={'铸造SFT'}
                setStatus={setStatus}
                type='SIGNED-TX'
                disabled={!isClaimed()}
                attrs={{
                  palletRpc: 'balances',
                  callable: 'deposit_creating',
                  inputParams: ['5CznMikiWfdauKFYUkyKcGFr5kPkLuJScu345qPdFKqCzDxu', 1000000000000],
                  paramFields: [true]
                }}
              />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    )
  }

  return (
    <div style={{ marginTop: 1 + 'rem' }}>
      <Message>
        <p>
          通过加密之后的Hash(哈希)值来与区块链上存证数据比对，以查验当前内容是否已在链上存证。
        </p>
        <Button onClick={queryPoE} color='teal'>验证内容</Button>
        {digest && block === 0 &&
          <Message warning
            icon='sync'
            header='本版本的内容没有在链上存证。'
            content={digest}
          />
        }
        {block !== 0 && digest &&
          <Message success
            icon='check circle'
            header='本版本内容已在链上存证。'
            content={digest}
          />
        }

        {digest && isClaimed && accountPair.isLocked &&
          <div>
            <p>进行链上存证或撤消操作，需要用令牌密码解锁您的令牌（钱包）账号。<br />
              <span style={{ color: 'orange', fontSize: 1 + 'rem' }}>提醒：令牌密码是生成钱包时所设置的密码，与网站的登录密码不同。</span>
            </p>
            <Input type='password' placeholder='令牌密码...' onChange={getPassword} action>
              <input />
              <Button type='submit' onClick={unlock} loading={isBusy}>解锁令牌账号</Button>
            </Input>
            {unlockError &&
              <span style={{ marginLeft: 1 + 'rem', color: 'orange', fontSize: 1 + 'rem' }}><Icon name='stop circle' /> {unlockError}</span>
            }
          </div>
        }
        {!unlockError && !accountPair.isLocked &&
          <span style={{ color: 'green', fontSize: 1 + 'rem' }}><Icon name='lock open' /> 令牌账号已解锁。</span>
        }
        {!accountPair.isLocked &&
          <div style={{ marginTop: 1 + 'rem' }}>
            <TxButton
              accountPair={accountPair}
              color={'teal'}
              label='撤消存证'
              setStatus={setStatus}
              type='SIGNED-TX'
              disabled={!isClaimed()}
              attrs={{
                palletRpc: 'poe',
                callable: 'revokeProof',
                inputParams: [digest],
                paramFields: [true],
                stageParams: { stageId: stage.id }
              }}
            />
            <TxButton
              color={'teal'}
              accountPair={accountPair}
              label={'提交存证'}
              setStatus={setStatus}
              type='SIGNED-TX'
              disabled={isClaimed()}
              attrs={{
                palletRpc: 'poe',
                callable: 'createProof',
                inputParams: [digest],
                paramFields: [true],
                stageParams: { stageId: stage.id }
              }}
            />
          </div>
        }
        {status &&
          <Message positive>
            <Message.Header></Message.Header>
            <p>
              {status}
            </p>
          </Message>
        }
      </Message>
      {/* {!accountPair.isLocked &&
        <CastCoin />
      } */}
    </div>
  )
}

export default function PoE(props) {
  return (
    <Main {...props} />
  );
}