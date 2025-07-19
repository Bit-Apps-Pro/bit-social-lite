import { $appConfig } from '@common/globalStates'
import { __ } from '@common/helpers/i18nWrap'
import BitSocial from '@icons/BitSocial'
import HeaderNavItem from '@pages/Layout/ui/Header/HeaderNavItem'
import { Flex, Space, Typography } from 'antd'
import { useAtomValue } from 'jotai'
import { NavLink } from 'react-router'

import cls from './Header.module.css'
import MoreOptionButton from './MoreOptionButton'

const navItems = [
  // { label: 'Home', path: '/' },
  { label: __('Accounts'), path: '/accounts' },
  { label: __('WP Auto Post'), path: '/auto-post' },
  { label: __('WP Post Schedules'), path: '/schedules' },
  { label: __('Share Now'), path: '/share-now' },
  { label: __('Calendar'), path: '/calendar' },
  { label: __('Templates'), path: '/templates' },
  { label: __('Logs'), path: '/logs' }
]

export default function Header() {
  const { isProClient } = useAtomValue($appConfig)

  return (
    <header className={`${cls.header} bg-slate-50 dark:bg-transparent backdrop-blur-md`}>
      <NavLink to="/">
        <BitSocial width={150} />
      </NavLink>

      <Flex>
        {navItems.map(link => (
          <HeaderNavItem key={link.label} props={link} />
        ))}
      </Flex>

      <Space>
        {!isProClient && (
          <Typography.Link
            href="https://bit-social.com/#pricing"
            rel="noopener noreferrer nofollow"
            target="_blank"
          >
            {/* <Button
              className={cls.pulseButton}
              style={{ background: '#00FFA3', color: 'black', fontWeight: '600' }}
              type="primary"
            >
              {__('Christmas offer')}
            </Button> */}
          </Typography.Link>
        )}
        <MoreOptionButton />
      </Space>
    </header>
  )
}
