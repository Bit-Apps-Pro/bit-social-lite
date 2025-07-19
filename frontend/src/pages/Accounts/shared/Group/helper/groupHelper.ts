import { type AccountType } from '@pages/Accounts/AccountsType'

import { type GroupType } from '../GroupType'

export const getGroupAccountIds = (group: GroupType) => {
  const groupAccounts = group.accounts
  return groupAccounts.map((account: AccountType) => Number(account.id))
}

export const isGroupNameExist = (name: string, groups: GroupType[], groupId?: number): boolean => {
  const group = groups.find(group => group.name.toLowerCase() === name.toLowerCase())
  return !!group && group.id !== groupId
}

export const groupsAccountIds = (groups: GroupType[], groupIds: number[]) => {
  const selectedGroups = groupIds ? groups.filter(group => groupIds.includes(group.id)) : []

  return selectedGroups.length
    ? selectedGroups.flatMap(group => {
        const groupAccount = group.accounts
        const accountIds = groupAccount.map((account: AccountType) => Number(account.id))

        return accountIds
      })
    : []
}
