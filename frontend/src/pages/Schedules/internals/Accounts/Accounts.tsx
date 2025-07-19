import { type AccountsType } from '@common/globalStates/$autoPostSettings'
import { $scheduleData } from '@common/globalStates/$scheduleModalData'
import { __ } from '@common/helpers/i18nWrap'
import ConnectAccount from '@pages/Accounts/ConnectAccount'
import useAccounts from '@pages/Accounts/data/useAccounts'
import AccountEmpty from '@pages/Accounts/internals/AccountEmpty'
import AccountTree from '@pages/AutoPost/ui/AccountTree'
import { Col, Flex, Row, Typography } from 'antd'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { useEffect } from 'react'

import Template from '../Template'

export default function Accounts() {
  const [scheduleData, setScheduleData] = useAtom($scheduleData)

  const { accounts: accountList } = useAccounts()

  const updateScheduleAccount = (selectedAccount: AccountsType) => {
    setScheduleData(prevScheduleData =>
      produce(prevScheduleData, draftScheduleData => {
        draftScheduleData.accounts = {
          accountIds: selectedAccount.accountIds,
          groupIds: selectedAccount?.groupIds
        }
      })
    )
  }

  useEffect(() => {
    updateScheduleAccount(scheduleData.accounts)
  }, [])

  if (accountList.length) {
    return (
      <Row gutter={20}>
        <Col span={10}>
          <>
            <Flex className="mb-1" justify="space-between">
              <Typography.Title level={5}>{__('Accounts')}</Typography.Title>
              <ConnectAccount />
            </Flex>

            <AccountTree
              selectedAccount={scheduleData.accounts}
              setSelectedAccount={updateScheduleAccount}
            />
          </>
        </Col>

        <Col span={14}>
          <Template />
        </Col>
      </Row>
    )
  }
  return (
    <>
      <AccountEmpty iconSize={40} textLevel={4} />
      <div style={{ textAlign: 'center' }}>
        <ConnectAccount />
      </div>
    </>
  )
}
