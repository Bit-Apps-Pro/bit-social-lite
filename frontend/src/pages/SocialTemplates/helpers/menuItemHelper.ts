import { type MenuProps } from 'antd'

export type MenuItem = Required<MenuProps>['items'][number]

export function getMenuItem(
  key: React.Key,
  label: React.ReactNode,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return { children, icon, key, label, type } as MenuItem
}
