import type platforms from '@config/platforms'

import { getHelpLink } from '@common/helpers/getHelpLink'
import { __ } from '@common/helpers/i18nWrap'
import { Button } from 'antd'
import { LuFileText } from 'react-icons/lu'

interface PlatformType {
  platform: keyof typeof platforms
}

export default function DocsLink({ platform }: PlatformType) {
  return (
    <Button
      href={getHelpLink(platform)}
      icon={<LuFileText />}
      rel="noopener noreferrer nofollow"
      size="small"
      style={{ whiteSpace: 'nowrap' }}
      target="_blank"
      type="link"
    >
      {__('Doc Link')}
    </Button>
  )
}
