import { type AccountType } from '@pages/Accounts/AccountsType'
import { Col, Row, Skeleton } from 'antd'

import AccountList from './internals/Platforms'
import ProfileList from './internals/Platforms/ui/ProfileList'
import AccountWarning from './shared/AccountLoaderSkeleton/AccountWarning'

interface AccountComponentType {
  accounts: AccountType[]
  isLoadingAccounts: boolean
  searchAccounts: string
  searchAccountsTxt: string
  setSearchAccounts: React.Dispatch<React.SetStateAction<string>>
}

export default function Account({
  accounts,
  isLoadingAccounts,
  searchAccounts,
  searchAccountsTxt,
  setSearchAccounts
}: AccountComponentType) {
  return (
    <Row gutter={20}>
      <Col span={6}>
        <ProfileList setSearchAccounts={setSearchAccounts} />
      </Col>
      <Col span={18}>
        {isLoadingAccounts && <Skeleton active />}

        <AccountList searchAccountsTxt={searchAccountsTxt} />

        {!isLoadingAccounts && !searchAccounts && !accounts?.length ? <AccountWarning /> : undefined}
      </Col>
    </Row>
  )
}
