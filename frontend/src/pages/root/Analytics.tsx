import { Avatar, Card, Col, Flex, Row, theme, Typography } from 'antd'

import useAnalytics from './data/useAnalytics'

const { Title } = Typography

export default function Analytics() {
  const { token } = theme.useToken()
  const { analytics } = useAnalytics()

  return (
    <div className="mt-5">
      <Row gutter={20}>
        {analytics.map(item => (
          <Col key={item.slug} span={6}>
            <Card>
              <Flex className="mb-2" justify="space-between">
                <Title level={2} style={{ color: token.colorPrimary, marginBottom: 0 }}>
                  {item.count}
                </Title>
                <Avatar
                  icon={item.icon}
                  size={60}
                  style={{
                    background: token.colorPrimaryBg,
                    color: token.colorText,
                    transform: 'translate(4px, -10px)'
                  }}
                />
              </Flex>
              <Title level={5} style={{ marginBottom: 0 }}>
                {item.title}
              </Title>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
