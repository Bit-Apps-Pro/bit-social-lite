import { __ } from '@common/helpers/i18nWrap'
import { Button, Card, Flex, Skeleton, Space, theme, Typography } from 'antd'
import { LuMoveUpRight } from 'react-icons/lu'
import { Link } from 'react-router'

const { Title } = Typography
export default function TemplateBox() {
  const { token } = theme.useToken()

  return (
    <>
      <Title level={5}> {__('Post templates')} </Title>

      <Card
        actions={[
          <Link key="template" to="/templates">
            <Button type="primary">
              <Space align="center" size={2}>
                <div>{__('Templates')}</div>
                <LuMoveUpRight />
              </Space>
            </Button>
          </Link>
        ]}
        style={{
          borderColor: token.colorBorder
        }}
        styles={{
          body: {
            height: '380px',
            width: '80%'
          }
        }}
      >
        <Space className="py-2">
          <Skeleton.Avatar size="large" />
          <Skeleton.Input size="small" />
        </Space>
        <Skeleton />

        <Skeleton.Image />
        <Flex className="py-3" gap={10} justify="space-around">
          <Skeleton.Button size="small" />
          <Skeleton.Button size="small" />
          <Skeleton.Button size="small" />
        </Flex>
      </Card>
    </>
  )
}
