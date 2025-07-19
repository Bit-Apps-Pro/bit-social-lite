import { __ } from '@common/helpers/i18nWrap'
import PlatformIcon from '@icons/PlatformIcon'
import { Flex, Space, Typography } from 'antd'
import { type TitleProps } from 'antd/es/typography/Title'

export default function AccountEmpty({
  iconSize = 50,
  textLevel = 3
}: {
  iconSize?: number
  textLevel?: TitleProps['level']
}) {
  return (
    <Flex align="center" className="py-3" gap={20} justify="center" style={{ height: '140px' }} vertical>
      <Space>
        <PlatformIcon name="facebook" size={iconSize} />
        <PlatformIcon name="twitter" size={iconSize} />
        <PlatformIcon name="pinterest" size={iconSize} />
        <PlatformIcon name="googleBusinessProfile" size={iconSize} />
      </Space>
      <Typography.Title level={textLevel}>{__('Connect your social account first!')}</Typography.Title>
    </Flex>
  )
}
