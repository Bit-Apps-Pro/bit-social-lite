import { type AccountType } from '@pages/Accounts/AccountsType'
import { Col, Row } from 'antd'

import GroupAccountCard from './GroupAccountCard'

export default function GroupAccounts({
  accounts,
  groupId
}: {
  accounts: AccountType[]
  groupId: number
}) {
  const accountList = accounts.map(account => {
    const { id, platform } = account
    if (!id) return

    const { account_name: name, account_type: accountType, icon } = account.details

    return (
      <Col key={id} md={8} sm={12} xl={4}>
        <GroupAccountCard
          accountType={accountType}
          groupId={groupId}
          id={id}
          image={icon}
          isDeletable
          name={name}
          platform={platform}
        />
      </Col>
    )
  })

  return <Row gutter={[12, 12]}>{accountList}</Row>
}
