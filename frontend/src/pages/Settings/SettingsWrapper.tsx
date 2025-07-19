import { $appConfig } from '@common/globalStates'
import { getMenuItem, type MenuItem } from '@pages/SocialTemplates/helpers/menuItemHelper'
import { Col, Menu, Row, theme } from 'antd'
import { useAtomValue } from 'jotai'
import { LuSettings } from 'react-icons/lu'
import { useNavigate, useParams } from 'react-router'

const items: MenuItem[] = [getMenuItem('cron', 'Cron', <LuSettings />)]

export default function SettingsWrapper({ children }: { children?: React.ReactNode }) {
  const { isDarkTheme } = useAtomValue($appConfig)
  const { token } = theme.useToken()
  const { option } = useParams()
  const navigate = useNavigate()

  const handleSelect = ({ key }: { key: string }) => {
    navigate(`/settings/${key}`)
  }

  return (
    <Row gutter={20}>
      <Col span={6}>
        <Menu
          items={items}
          mode="inline"
          onSelect={handleSelect}
          selectedKeys={[option || 'cron']}
          style={{ backgroundColor: token.colorBgContainer, border: 'none', paddingInline: '6px' }}
          theme={isDarkTheme ? 'dark' : 'light'}
        />
      </Col>
      <Col span={18}>{children}</Col>
    </Row>
  )
}
