import { theme } from 'antd'
import { motion } from 'framer-motion'
import { NavLink } from 'react-router'

import cls from './Header.module.css'
import { navItemActiveStyle, navItemStyle } from './HeaderNavItem.style'

interface SidebarNavProps {
  props: {
    icon?: JSX.Element
    label: JSX.Element | string
    path: string
  }
}

export default function HeaderNavItem({ props: { icon, label, path } }: SidebarNavProps) {
  const { token } = theme.useToken()
  return (
    <NavLink
      className={cls.navItem}
      style={({ isActive }) => navItemStyle({ isActive, token })}
      to={path}
    >
      {({ isActive }) => (
        <>
          {icon}
          {label}
          {isActive && <motion.span css={navItemActiveStyle} layoutId="sidebar-nav-item-active" />}
        </>
      )}
    </NavLink>
  )
}
