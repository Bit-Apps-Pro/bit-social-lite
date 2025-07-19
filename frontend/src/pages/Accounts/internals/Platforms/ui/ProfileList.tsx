import { $appConfig } from '@common/globalStates'
import { $isBuyProModalOpen } from '@common/globalStates/$buyPro'
import { __ } from '@common/helpers/i18nWrap'
import { isProPlatform } from '@common/helpers/proPlatform'
import platforms from '@config/platforms'
import PlatformIcon from '@icons/PlatformIcon'
import { Menu, type MenuProps, theme, Typography } from 'antd'
import { useAtomValue, useSetAtom } from 'jotai'
import { LuCrown } from 'react-icons/lu'
import { useSearchParams } from 'react-router'

interface ProfileListType {
  setSearchAccounts: React.Dispatch<React.SetStateAction<string>>
}

function getKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[]
}

export default function ProfileList({ setSearchAccounts }: ProfileListType) {
  const { isDarkTheme, isProClient } = useAtomValue($appConfig)
  const { token } = theme.useToken()

  const [searchParams, setSearchParams] = useSearchParams({})

  const setProModalOpen = useSetAtom($isBuyProModalOpen)

  const searchTabValue = searchParams.get('value') || 'all'

  const allPlatform = [
    {
      key: 'all',
      label: (
        <>
          <PlatformIcon size={30} />
          <Typography.Text className="pl-2">{__('All')}</Typography.Text>
        </>
      )
    }
  ]

  const platformList = getKeys(platforms).map(platform => ({
    key: platform,
    label: (
      <>
        <PlatformIcon name={platform} size={30} />{' '}
        <Typography.Text className="px-2">{platforms[platform].name}</Typography.Text>
        {isProPlatform(platform) && !isProClient ? <LuCrown color="#ff8609" size={18} /> : undefined}
      </>
    )
  }))

  const platformsTabItems = [...allPlatform, ...platformList]

  const handlePlatformMenuClick: MenuProps['onClick'] = ({ key }: { key: string }) => {
    if (isProPlatform(key) && !isProClient) {
      setProModalOpen(true)
      return
    }
    setSearchParams(prev => {
      prev.set('type', 'platform')
      prev.set('value', key)
      return prev
    })
    setSearchAccounts('')
  }

  return (
    <>
      <Menu
        className="rounded-md"
        items={platformsTabItems}
        mode="inline"
        onClick={handlePlatformMenuClick}
        selectedKeys={[searchTabValue]}
        style={{
          backgroundColor: token.colorBgContainer,
          border: 'none',
          paddingInline: '6px'
        }}
        theme={isDarkTheme ? 'dark' : 'light'}
      />
    </>
  )
}
