import { $appConfig } from '@common/globalStates'
import { $isBuyProModalOpen } from '@common/globalStates/$buyPro'
import { __ } from '@common/helpers/i18nWrap'
import PlatformList from '@config/platforms'
import { type AccountType } from '@pages/Accounts/AccountsType'
import useActiveAccounts from '@pages/Accounts/data/useActiveAccounts'
import { type ScheduleAccountsType } from '@pages/Schedules/ScheduleType'
import { Select, Tree, Typography } from 'antd'
import { type Key } from 'antd/es/table/interface'
import { type TreeProps } from 'antd/es/tree'
import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useMemo, useState } from 'react'
import { LuCrown } from 'react-icons/lu'

import {
  filterAvailablePlatforms,
  getCheckedKeysByType,
  getTreeDataByAccount
} from './accountTreeHelper'
import ProGroupTree from './ProGroupTree.pro'

export interface AccountTreeType {
  isLoading?: boolean
  selectedAccount: ScheduleAccountsType
  setSelectedAccount: (accountIds: ScheduleAccountsType) => void
}

export default function FreeAccountTree({
  isLoading,
  selectedAccount,
  setSelectedAccount
}: AccountTreeType) {
  const [accountType, setAccountType] = useState('all')
  const [accountExpandedKeys, setAccountExpandedKeys] = useState<Key[]>()
  const [treeSelectedAccount, setTreeSelectedAccount] = useState(selectedAccount)

  const setProModalOpen = useSetAtom($isBuyProModalOpen)
  const { isProClient } = useAtomValue($appConfig)

  const { activeAccounts: accounts } = useActiveAccounts()

  const checkedKeys = useMemo(
    () => getCheckedKeysByType(treeSelectedAccount?.accountIds, treeSelectedAccount?.groupIds),
    [treeSelectedAccount]
  )

  const platforms = useMemo(
    () =>
      filterAvailablePlatforms(accounts).map((platform: keyof typeof PlatformList) => ({
        label: PlatformList[platform].name,
        value: platform
      })),
    [accounts]
  )

  const { accountExpandKeys, accountTreeData } = useMemo(
    () => getTreeDataByAccount('', accountType, accounts, []),
    [accountType, accounts]
  )

  const accountOptions = [
    { label: __('All'), value: 'all' },
    {
      disabled: !isProClient,
      label: isProClient ? (
        'Groups'
      ) : (
        <>
          {__('Groups')} <LuCrown color="#ff8609" size={18} />
        </>
      ),
      value: 'groups'
    },
    ...platforms
  ]

  const handleAccountType = (value: string) => {
    if (!isProClient && value === 'groups') {
      setProModalOpen(true)
      return
    }
    setAccountType(value)
  }

  const onAccountCheck: TreeProps['onCheck'] = checked => {
    const checkedKeysValue = Array.isArray(checked) ? checked : checked.checked

    const selectedAccounts = accounts.filter((account: AccountType) =>
      checkedKeysValue.includes(`account-${account.id}`)
    )
    const allSelectedAccountsIds = selectedAccounts.map(account => account.id)

    const sanitizeAccount = [...new Set(allSelectedAccountsIds)]

    setTreeSelectedAccount(prev => {
      const updateTreeData = { ...prev, accountIds: sanitizeAccount }
      setSelectedAccount(updateTreeData)
      return updateTreeData
    })
  }

  const handleAccountExpandKeys = (expandKeys: Key[]) => {
    setAccountExpandedKeys(expandKeys)
  }

  useEffect(() => {
    setTreeSelectedAccount(selectedAccount)
  }, [selectedAccount])

  useEffect(() => {
    setAccountExpandedKeys(accountExpandKeys)
  }, [accountExpandKeys])

  return (
    <div
      css={{
        minHeight: '100%',
        overflow: 'hidden'
      }}
    >
      <Select
        css={{ margin: '4px 0', width: '100%' }}
        defaultValue={accountType}
        onChange={handleAccountType}
        options={accountOptions}
      />

      {accountType !== 'groups' && (
        <>
          <Typography.Title className="bg-slate-200 p-2 dark:bg-slate-800" level={4}>
            {__('Accounts')}
          </Typography.Title>

          <Tree
            autoExpandParent
            blockNode
            checkable
            checkedKeys={checkedKeys}
            className="pr-3"
            defaultExpandAll
            disabled={isLoading}
            expandedKeys={accountExpandedKeys}
            key={accountTreeData.length}
            onCheck={onAccountCheck}
            onExpand={handleAccountExpandKeys}
            selectable={false}
            treeData={accountTreeData}
          />
        </>
      )}

      {isProClient && (
        <ProGroupTree
          accountType={accountType}
          isLoading={isLoading}
          selectedAccount={selectedAccount}
          setSelectedAccount={setSelectedAccount}
        />
      )}
    </div>
  )
}
