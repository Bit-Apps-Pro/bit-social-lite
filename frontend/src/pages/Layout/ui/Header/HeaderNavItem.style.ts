import { type Interpolation, type Theme } from '@emotion/react'
import { type GlobalToken } from 'antd'

interface NavItemStyle {
  isActive: boolean
  token: GlobalToken
}

export const navItemStyle = ({ isActive, token }: NavItemStyle) => ({
  '&:focus': {
    color: `${isActive ? '#ffffff' : token.colorText} !important`
  },
  '&:hover': {
    background: `${token.colorFillSecondary}`,
    color: `${isActive ? '#ffffff' : token.colorText}`
  },
  borderRadius: token.borderRadius,
  color: `${isActive ? '#ffffff' : token.colorText}`
})

export const navItemActiveStyle = ({ token }: { token: GlobalToken }) =>
  ({
    background: token.colorPrimary,
    borderRadius: token.borderRadius,
    height: '100%',
    inset: 0,
    position: 'absolute',
    width: '100%',
    zIndex: -1
  }) as Interpolation<Theme>
