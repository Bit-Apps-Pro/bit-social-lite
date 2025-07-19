import { $appConfig } from '@common/globalStates'
import { $isBuyProModalOpen } from '@common/globalStates/$buyPro'
import { __ } from '@common/helpers/i18nWrap'
import { isProPlatform } from '@common/helpers/proPlatform'
import useDebounce from '@common/hooks/useDebounce'
import useAccounts from '@pages/Accounts/data/useAccounts'
import { Col, Input, Row, Segmented, Space } from 'antd'
import { useAtomValue, useSetAtom } from 'jotai'
import 'simplebar-react/dist/simplebar.min.css'
import { useState } from 'react'
import { LuCrown, LuSearch } from 'react-icons/lu'
import { useNavigate, useSearchParams } from 'react-router'

import Account from './Account'
import CreateGroupModal from './shared/Group/CreateGroupModal'
import Group from './shared/Group/Groups'

export default function Accounts() {
  const { isProClient } = useAtomValue($appConfig)
  const setProModalOpen = useSetAtom($isBuyProModalOpen)

  const [searchParams, setSearchParams] = useSearchParams({})
  const navigate = useNavigate()

  const searchTabValue = searchParams.get('value') || ''
  const searchTypeValue = searchParams.get('type') || ''

  const [tab, setTab] = useState(searchTypeValue || 'platform')

  const tabTypes = ['platform', 'group']

  if (
    (searchTabValue !== '' && isProPlatform(searchTabValue) && !isProClient) ||
    (searchTabValue.length && !tabTypes.includes(searchTypeValue)) ||
    (!isProClient && searchTypeValue === 'group')
  ) {
    navigate('/accounts')
  }

  const selectedMenuTab = { type: searchTypeValue, value: searchTabValue }

  const [searchAccounts, setSearchAccounts] = useState<string>('')
  const searchAccountsTxt = useDebounce(searchAccounts, 400)
  const { accounts, isLoadingAccounts } = useAccounts({ searchAccountsTxt, selectedMenuTab })

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAccounts(e.target.value)

    setSearchParams(prev => {
      prev.delete('type')
      prev.delete('value')
      return prev
    })
  }

  const handleTab = (value: string) => {
    if (!isProClient && value === 'group') {
      setProModalOpen(true)
      return
    }
    setTab(value)

    setSearchParams(prev => {
      prev.set('type', value)
      prev.set('value', 'all')
      return prev
    })
  }

  return (
    <div>
      <Row gutter={20}>
        <Col span={6}>
          <Segmented<string>
            block
            onChange={handleTab}
            options={[
              { label: __('Accounts'), value: 'platform' },
              {
                label: isProClient ? (
                  'Groups'
                ) : (
                  <>
                    {__('Groups')} <LuCrown color="#ff8609" size={18} />
                  </>
                ),
                value: 'group'
              }
            ]}
            value={tab}
          />
        </Col>
        <Col>
          {tab === 'platform' ? (
            <Space style={{ marginBottom: 10 }}>
              <Input
                allowClear
                onChange={handleSearch}
                placeholder={__('Search accounts')}
                prefix={<LuSearch />}
                value={searchAccounts}
              />
            </Space>
          ) : (
            <CreateGroupModal />
          )}
        </Col>
      </Row>

      {tab === 'platform' ? (
        <Account
          accounts={accounts}
          isLoadingAccounts={isLoadingAccounts}
          searchAccounts={searchAccounts}
          searchAccountsTxt={searchAccountsTxt}
          setSearchAccounts={setSearchAccounts}
        />
      ) : (
        <Group />
      )}
    </div>
  )
}
