import { __ } from '@common/helpers/i18nWrap'
import { type AccountType } from '@pages/Accounts/AccountsType'
import useActiveAccounts from '@pages/Accounts/data/useActiveAccounts'
import useGroups from '@pages/Accounts/shared/Group/data/useGroups'
import { type GroupType } from '@pages/Accounts/shared/Group/GroupType'
import { Tree, Typography } from 'antd'
import { type Key } from 'antd/es/table/interface'
import { type TreeProps } from 'antd/es/tree'
import { useEffect, useMemo, useState } from 'react'

import { type AccountTreeType } from './AccountTree'
import { getCheckedKeysByType, getTreeDataByGroup } from './accountTreeHelper'

interface ProGroupTreeType extends AccountTreeType {
  accountType: string
}

export default function ProGroupTree({
  accountType,
  isLoading,
  selectedAccount,
  setSelectedAccount
}: ProGroupTreeType) {
  const [groupExpandedKeys, setGroupExpandedKeys] = useState<Key[]>()
  const [treeSelectedAccount, setTreeSelectedAccount] = useState(selectedAccount)

  const { groups } = useGroups()

  const { activeAccounts: accounts } = useActiveAccounts()

  const groupsAccountIds = groups.map(group => {
    const groupAccounts = group.accounts
    const accountIds = groupAccounts.map((account: AccountType) => Number(account.id))

    return { ...group, accountIds: accountIds }
  })

  const groupCheckedKeys = useMemo(
    () => getCheckedKeysByType(treeSelectedAccount?.accountIds, treeSelectedAccount?.groupIds),
    [treeSelectedAccount]
  )

  const { groupExpandKeys, groupTreeData } = useMemo(
    () => getTreeDataByGroup('', accountType, accounts, groupsAccountIds),
    [accountType, accounts, groups]
  )

  const onGroupCheck: TreeProps['onCheck'] = checked => {
    const checkedKeysValue = Array.isArray(checked) ? checked : checked.checked

    const groupIds = new Set(
      groupsAccountIds
        .filter(group => checkedKeysValue.includes(`group-${group.id}`))
        .map((group: GroupType) => Number(group.id))
    )

    const sanitizeGroup = [...groupIds]

    setTreeSelectedAccount(prev => {
      const updateTreeData = { ...prev, groupIds: sanitizeGroup }
      setSelectedAccount(updateTreeData)
      return updateTreeData
    })
  }

  const handleGroupExpandKeys = (expandKeys: Key[]) => {
    setGroupExpandedKeys(expandKeys)
  }

  useEffect(() => {
    setTreeSelectedAccount(selectedAccount)
  }, [selectedAccount])

  useEffect(() => {
    setGroupExpandedKeys(groupExpandKeys)
  }, [groupExpandKeys])

  return (
    <div
      css={{
        minHeight: '100%',
        overflow: 'hidden'
      }}
    >
      {['all', 'groups'].includes(accountType) && (
        <>
          <Typography.Title className="bg-slate-200 p-2 dark:bg-slate-800" level={4}>
            {__('Groups')}
          </Typography.Title>
          <Tree
            autoExpandParent
            blockNode
            checkable
            checkedKeys={groupCheckedKeys}
            className="pr-3"
            defaultExpandAll
            disabled={isLoading}
            expandedKeys={groupExpandedKeys}
            key={groupTreeData.length}
            onCheck={onGroupCheck}
            onExpand={handleGroupExpandKeys}
            selectable={false}
            treeData={groupTreeData}
          />
        </>
      )}
    </div>
  )
}
