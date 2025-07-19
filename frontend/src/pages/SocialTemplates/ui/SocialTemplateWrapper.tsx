import { $appConfig, getAtom } from '@common/globalStates'
import { isProPlatform } from '@common/helpers/proPlatform'
import platforms from '@config/platforms'
import PlatformIcon from '@icons/PlatformIcon'
import { Col, Menu, Row, theme, Typography } from 'antd'
import { useAtomValue } from 'jotai'
import { LuCrown } from 'react-icons/lu'
import { useNavigate, useParams } from 'react-router'

const { isProClient } = getAtom($appConfig)

function getKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[]
}

const platformList = getKeys(platforms).map(platform => ({
  key: platform,
  label: (
    <>
      <PlatformIcon name={platform} size={30} />{' '}
      <Typography.Text className="px-2">{platforms[platform].name}</Typography.Text>
      {isProPlatform(platform) && !isProClient ? <LuCrown color="#ff8609" size={18} /> : ''}
    </>
  )
}))

export default function SocialTemplateWrapper({ children }: { children?: React.ReactNode }) {
  const { isDarkTheme } = useAtomValue($appConfig)
  const { token } = theme.useToken()
  const { platform } = useParams()
  const navigate = useNavigate()

  const handleSelect = ({ key }: { key: string }) => {
    navigate(`/templates/${key}`)
  }

  return (
    <Row gutter={20}>
      <Col span={6}>
        <Menu
          items={platformList}
          mode="inline"
          onSelect={handleSelect}
          selectedKeys={[platform || 'facebook']}
          style={{ backgroundColor: token.colorBgContainer, border: 'none', paddingInline: 6 }}
          theme={isDarkTheme ? 'dark' : 'light'}
        />
      </Col>
      <Col span={18}>{children}</Col>
    </Row>
  )
}
