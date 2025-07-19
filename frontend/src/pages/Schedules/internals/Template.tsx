import type platformsType from '@config/platforms'

import { $scheduleData } from '@common/globalStates/$scheduleModalData'
import { __ } from '@common/helpers/i18nWrap'
import PlatformIcon from '@icons/PlatformIcon'
import { type AccountType } from '@pages/Accounts/AccountsType'
import useActiveAccounts from '@pages/Accounts/data/useActiveAccounts'
import useGroups from '@pages/Accounts/shared/Group/data/useGroups'
import { groupsAccountIds } from '@pages/Accounts/shared/Group/helper/groupHelper'
import isPro from '@plugin-commons/utils/isPro'
import { Tabs, Typography } from 'antd'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'

import ScheduleTemplatePlatform from './Platforms/ScheduleTemplatePlatform'

export const getUniquePlatforms = (accounts: AccountType[] | undefined, accountIds: number[]) => [
  ...new Set(
    accounts?.filter(account => accountIds?.includes(account.id)).map(account => account.platform)
  )
]

const getTabItemsByPlatform = (platforms: (keyof typeof platformsType)[]) =>
  platforms.map(platform => ({
    children: <ScheduleTemplatePlatform platform={platform} />,
    key: platform,
    label: (
      <span title={platform}>
        <PlatformIcon name={platform} size={32} />
      </span>
    )
  }))

export default function Template() {
  const scheduleData = useAtomValue($scheduleData)
  const { activeAccounts: accounts } = useActiveAccounts()
  const { groups } = useGroups()

  const platformTemplateItems = useMemo(() => {
    const selectAccountIds = scheduleData.accounts.accountIds
    const groupAccountIds = isPro() ? groupsAccountIds(groups, scheduleData.accounts?.groupIds) : []

    const accountIds = [...selectAccountIds, ...groupAccountIds]
    const platforms = getUniquePlatforms(accounts, accountIds)

    return getTabItemsByPlatform(platforms)
  }, [accounts, groups, scheduleData.accounts.groupIds, scheduleData.accounts.accountIds])

  if (!platformTemplateItems || !platformTemplateItems.length)
    return (
      <Typography.Title level={4} style={{ textAlign: 'center' }} type="secondary">
        {__('Please select an account')}
      </Typography.Title>
    )

  return <Tabs items={platformTemplateItems} tabBarGutter={8} />
}
