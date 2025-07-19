import { $appConfig } from '@common/globalStates'
import $changelogModal from '@common/globalStates/$changelogModal'
import { __ } from '@common/helpers/i18nWrap'
import { Button, Dropdown, type DropdownProps, type MenuProps } from 'antd'
import { produce } from 'immer'
import { useAtom, useSetAtom } from 'jotai'
import { useState } from 'react'
import {
  LuEllipsisVertical,
  LuFileClock,
  LuHeadphones,
  LuMoonStar,
  LuSettings,
  LuSun
} from 'react-icons/lu'
import { NavLink } from 'react-router'

import Changelog from './internals/Changelog'

const iconStyle = { size: 16, style: { marginRight: 6 } }

const createItems = (isDarkTheme: boolean): MenuProps['items'] => {
  const menuItems = [
    {
      icon: <LuSettings {...iconStyle} />,
      label: __('Settings'),
      to: '/settings'
    },
    { icon: <LuFileClock {...iconStyle} />, label: __('Changelog') },
    {
      icon: <LuHeadphones {...iconStyle} />,
      label: __('Support'),
      to: '/support'
    },
    { type: 'divider' },
    {
      icon: isDarkTheme ? <LuMoonStar {...iconStyle} /> : <LuSun {...iconStyle} />,
      key: 'theme',
      label: isDarkTheme ? 'Dark' : 'Light'
    }
  ]

  return menuItems.map(item => {
    // if (!item.to && !item.type) return
    if (item.type === 'divider') return item

    return {
      icon: item.icon,
      key: item.key || item.label?.toLowerCase(),
      label: <NavLink to={item.to as string}>{item.label}</NavLink>
    }
  }) as MenuProps['items']
}

export default function MoreOptionButton() {
  const [{ isDarkTheme }, setAppConfig] = useAtom($appConfig)
  const [open, setOpen] = useState(false)
  const setIsChangelogOpen = useSetAtom($changelogModal)

  const toggleTheme = () =>
    setAppConfig(prv =>
      produce(prv, draft => {
        draft.isDarkTheme = !prv.isDarkTheme
      })
    )

  const handleMenuClick: MenuProps['onClick'] = e => {
    if (e.key === 'theme') {
      toggleTheme()
      return
    }

    if (e.key === 'changelog') {
      setIsChangelogOpen(true)
    }

    setOpen(false)
  }

  const handleOpenChange: DropdownProps['onOpenChange'] = (nextOpen, info) => {
    if (info.source === 'trigger' || nextOpen) {
      setOpen(nextOpen)
    }
  }

  return (
    <>
      <Changelog />

      <Dropdown
        menu={{ items: createItems(isDarkTheme), onClick: handleMenuClick }}
        onOpenChange={handleOpenChange}
        open={open}
        overlayStyle={{ minWidth: 140 }}
        placement="bottomRight"
        trigger={['click']}
      >
        <Button ghost={!isDarkTheme} type={isDarkTheme ? 'default' : 'primary'}>
          {__('More')} <LuEllipsisVertical />
        </Button>
      </Dropdown>
    </>
  )
}
