import { __ } from '@common/helpers/i18nWrap'
import { Card, Flex, Skeleton, Space, theme, Typography } from 'antd'

const { Title } = Typography
export default function PreviewDummy() {
  const { token } = theme.useToken()

  return (
    <>
      <Title level={5}> {__('Preview (Coming Soon)')}</Title>

      <Card
        style={{
          borderColor: token.colorBorder
        }}
        styles={{
          body: {
            height: '420px',
            width: '100%'
          }
        }}
      >
        <Space className="py-2">
          <Skeleton.Avatar size="large" />
          <Skeleton.Input />
        </Space>
        <Skeleton />
        <Flex align="center" justify="center">
          <Typography.Title level={4} type="secondary">
            {__('Coming Soon')}
          </Typography.Title>
        </Flex>
        <div>
          <Skeleton.Image />
        </div>
        <Flex className="py-3" justify="space-around">
          <Skeleton.Button />
          <Skeleton.Button />
          <Skeleton.Button />
        </Flex>
      </Card>
    </>
  )
}
