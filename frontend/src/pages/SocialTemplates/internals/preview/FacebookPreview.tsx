import { type Facebook } from '@common/globalStates/socialTemplates/SocialTemplatesType'
import { __ } from '@common/helpers/i18nWrap'
import Dots from '@icons/Dots'
import ShareIcon from '@icons/Platforms/facebook/ShareIcon'
import { Avatar, Card, Flex, Space, theme, Typography } from 'antd'
import { LuMessageCircle, LuThumbsUp } from 'react-icons/lu'

import PostType from './internals/PostType'

interface FacebookPreviewType {
  message: string
  type: Facebook['postingType']
}

const { Paragraph, Text, Title } = Typography

export default function FacebookPreview({ message, type }: FacebookPreviewType) {
  const { token } = theme.useToken()

  return (
    <Card
      css={{
        borderColor: token.colorBorder
      }}
      styles={{
        body: {
          padding: '0'
        }
      }}
    >
      <Flex css={{ padding: '16px 16px 8px ' }} justify="space-between">
        <Flex>
          <Avatar size="large">P</Avatar>

          <Flex css={{ margin: '0 8px' }} vertical>
            <Title className="text-capitalize" level={5} style={{ marginBottom: '0px' }}>
              {__('Page name')}
            </Title>
            <Text style={{ fontSize: '12px' }} type="secondary">
              {__('Just Now')}
            </Text>
          </Flex>
        </Flex>

        <Dots size={22} />
      </Flex>

      <Paragraph className="px-3">{message}</Paragraph>

      <PostType type={type} />

      <Flex
        align="middle"
        className="py-2"
        justify="space-around"
        style={{ borderTop: `1px solid ${token.colorBorder}` }}
      >
        <Space size="small">
          <LuThumbsUp size={20} />
          <Text>{__('Like')}</Text>
        </Space>

        <Space size="small">
          <LuMessageCircle size={20} />
          <Text>{__('Comment')}</Text>
        </Space>

        <Space size="small">
          <ShareIcon size={20} />
          <Text>{__('Share')}</Text>
        </Space>
      </Flex>
    </Card>
  )
}
