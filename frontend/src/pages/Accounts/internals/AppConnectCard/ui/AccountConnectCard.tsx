import { __ } from '@common/helpers/i18nWrap'
import { Avatar, Button, Card, Col, Flex, type GlobalToken, Row, Space, Typography } from 'antd'

interface AccountCardType {
  accountType: string
  connectAccountId?: string
  handleConnect?: () => void
  icon: string
  id: string
  isConnected: boolean
  isLoading: boolean
  name: string
}

const cardBodyStyle = ({ token }: { token: GlobalToken }) => ({
  background: `${token.colorBgLayout} `
})

export default function AccountConnectCard({
  accountType,
  connectAccountId,
  handleConnect,
  icon,
  id,
  isConnected,
  isLoading,
  name
}: AccountCardType) {
  const accountTypeInfo = JSON.parse(accountType).account_type
  return (
    <Card css={cardBodyStyle} size="small">
      <Row align="middle" justify="space-between">
        <Col>
          <Space size="small">
            <Avatar size={40} src={icon} />
            <Flex style={{ maxWidth: '300px' }} vertical>
              <Typography.Text ellipsis strong title={name}>
                {name}
              </Typography.Text>
              <Typography.Text type="secondary">{accountTypeInfo}</Typography.Text>
            </Flex>
          </Space>
        </Col>
        <Col>
          {isConnected ? (
            <Typography.Text className="mx-2" type="success">
              {__('Saved')}
            </Typography.Text>
          ) : (
            <Button
              disabled={isLoading && id !== connectAccountId}
              loading={isLoading && id === connectAccountId}
              onClick={handleConnect}
              type="primary"
            >
              {__('Save')}
            </Button>
          )}
        </Col>
      </Row>
    </Card>
  )
}
