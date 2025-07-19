import { __ } from '@common/helpers/i18nWrap'
import { type GlobalToken } from 'antd'
import { Button, Divider, Space } from 'antd'
import { type ReactNode } from 'react'
import React from 'react'

const AppsDropdownMenu = ({ token }: { token: GlobalToken }) =>
  function Menu(menu: ReactNode) {
    const contentStyle = {
      backgroundColor: token.colorBgElevated,
      borderRadius: token.borderRadiusLG,
      boxShadow: token.boxShadowSecondary
    }

    const menuStyle = {
      boxShadow: 'none'
    }
    return (
      <div style={contentStyle}>
        {React.cloneElement(menu as React.ReactElement, { style: menuStyle })}
        <Divider style={{ margin: 0 }} />
        <Space style={{ padding: 8 }}>
          <Button type="primary">{__('Click me!')}</Button>
        </Space>
      </div>
    )
  }

export default AppsDropdownMenu
