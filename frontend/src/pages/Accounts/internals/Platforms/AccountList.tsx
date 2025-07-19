import ConnectAccount from '@pages/Accounts/ConnectAccount'
import useAccounts from '@pages/Accounts/data/useAccounts'
import AccountCard from '@pages/Accounts/internals/Platforms/ui/AccountCard'
import AccountLoaderSkeleton from '@pages/Accounts/shared/AccountLoaderSkeleton/AccountLoaderSkeleton'
import { Col, Row } from 'antd'
import { useSearchParams } from 'react-router'

interface PlatformsProps {
  searchAccountsTxt: string
}

export default function AccountList({ searchAccountsTxt }: PlatformsProps) {
  const [searchParams] = useSearchParams({})
  const searchTabValue = searchParams.get('value') || ''
  const searchTypeValue = searchParams.get('type') || ''

  const selectedMenuTab = { type: searchTypeValue, value: searchTabValue }

  const { accounts, isLoadingAccounts } = useAccounts({
    searchAccountsTxt,
    selectedMenuTab
  })

  if (isLoadingAccounts) {
    return <AccountLoaderSkeleton accountQuantity={4} />
  }

  return (
    <Row gutter={[16, 16]}>
      <Col md={8} sm={12} xl={6} xs={24}>
        <ConnectAccount btnType="custom" />
      </Col>
      {accounts.map(account => (
        <Col key={account.id} md={8} sm={12} xl={6} xs={24}>
          <AccountCard
            accountType={account.details.account_type}
            id={account.id}
            image={account.details.icon}
            key={account.id}
            name={account.details.account_name}
            platform={account.platform}
            status={account.status}
          />
        </Col>
      ))}
    </Row>
  )
}
