import { __ } from '@common/helpers/i18nWrap'
import PlatformList from '@config/platforms'
import { type AccountType } from '@pages/Accounts/AccountsType'
import { type GroupType } from '@pages/Accounts/shared/Group/GroupType'
import { getGroupAccountIds } from '@pages/Accounts/shared/Group/helper/groupHelper'
import AccountCard from '@pages/Schedules/internals/Accounts/AccountCard'
import { type TreeDataNode, Typography } from 'antd'

export const getAccountsByPlatform = (
  searchText: string,
  accountType: string,
  platform: string,
  accounts: AccountType[],
  groups: GroupType[]
) => {
  if ((searchText !== '' && accountType === 'all') || platform) {
    return accounts.filter(
      account =>
        account.platform === platform && account.details.account_name.toLowerCase().includes(searchText)
    )
  }

  if (accountType === 'groups') {
    if (searchText !== '') {
      return groups.filter(group => group.name.includes(searchText))
    }
    return groups
  }

  return accounts.filter(account => account.platform === platform)
}

export const filterAvailablePlatforms = (accountsData: AccountType[]) => [
  ...new Set(accountsData.map(account => account.platform))
]

export const getCheckedKeysByType = (accounts: number[], groups: number[]) => {
  const account = accounts ? accounts.map(account => `account-${account}`) : []
  const group = groups ? groups.map(group => `group-${group}`) : []

  return [...account, ...group]
}

const accountByIds = (ids: number[], accounts: AccountType[], groupKey: string): TreeDataNode[] =>
  accounts
    .filter(account => ids.includes(account.id))
    .map(accountId => {
      const key = `account-${groupKey}-${accountId.id}`
      return {
        checkable: false,
        key,
        title: <AccountCard img={accountId.details.icon} name={accountId.details.account_name} />
      }
    })

export const getTreeDataByAccount = (
  search: string,
  type: string,
  accounts: AccountType[],
  groups: GroupType[]
) => {
  let accountExpandKeys: string[] = []

  const accountTree = filterAvailablePlatforms(accounts).map(platform => {
    accountExpandKeys.push(platform)
    return {
      children: getAccountsByPlatform(search, type, platform, accounts, groups).map(account => {
        const key = `account-${account.id}`

        return {
          disabled: type !== 'all' && type !== platform,
          key,
          style: type !== 'all' && type !== platform ? { display: ' none' } : {},
          title: 'details' in account && (
            <AccountCard img={account.details.icon} name={account.details.account_name} />
          )
        }
      }),
      key: platform,
      style:
        (search !== '' && !getAccountsByPlatform(search, type, platform, accounts, groups).length) ||
        (type !== platform && type !== 'all')
          ? { display: ' none' }
          : {},
      title: (
        <Typography.Text ellipsis title={PlatformList[platform]?.name}>
          {PlatformList[platform]?.name}
        </Typography.Text>
      )
    }
  })

  const accountTreeData = [
    {
      children: accountTree,
      key: 'all',

      title: __('Select All')
    }
  ]

  if (type === 'all') {
    accountExpandKeys.push(type, 'groups')
  }

  if (type !== 'all' && type !== 'groups') {
    accountExpandKeys = ['all', type]
  }

  return { accountExpandKeys, accountTreeData }
}

export const getTreeDataByGroup = (
  search: string,
  type: string,
  accounts: AccountType[],
  groups: GroupType[]
) => {
  const groupExpandKeys: string[] = []

  const groupTreeData = [
    {
      children: getAccountsByPlatform(search, 'groups', '', accounts, groups).map(group => {
        const groupKey = `group-${group.id}`

        const accountIds = 'accounts' in group ? getGroupAccountIds(group) : []
        if (accountIds.length) {
          groupExpandKeys.push(groupKey)
        }

        return {
          children: accountByIds(accountIds, accounts, groupKey),
          key: groupKey,
          style: { overflow: 'hidden' },
          title: 'name' in group && (
            <Typography.Text ellipsis title={group.name}>
              {group.name}
            </Typography.Text>
          )
        }
      }),
      key: 'groups',
      style: type === 'all' || type === 'groups' ? {} : { display: ' none' },
      title: __('Groups')
    }
  ]

  return { groupExpandKeys, groupTreeData }
}
