import { $bitSocial } from '@common/globalStates'
import { Flex, theme, Typography } from 'antd'
import { useAtomValue } from 'jotai'

import FeaturesImage from './FeaturesImage'

export default function LinkCard() {
  const { token } = theme.useToken()
  const bitSocial = useAtomValue($bitSocial)
  const { siteName, siteUrl } = bitSocial

  return (
    <Flex vertical>
      <FeaturesImage />
      <Flex
        className="p-2"
        gap={0}
        style={{ background: token.colorBgLayout, border: `1px solid${token.colorBorderSecondary}` }}
        vertical
      >
        <Typography.Text type="secondary">{siteUrl}</Typography.Text>
        <Typography.Title level={5} style={{ margin: 0 }}>
          {siteName}
        </Typography.Title>
      </Flex>
    </Flex>
  )
}
