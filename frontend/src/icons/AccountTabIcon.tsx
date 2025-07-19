import type platforms from '@config/platforms'

import { ucFirst } from '@common/helpers/globalHelpers'
import { Badge, Tooltip } from 'antd'

import PlatformIcon from './PlatformIcon'

interface AccountTabIconType {
  edit?: boolean
  name: keyof typeof platforms
  size?: number
}

export default function AccountTabIcon({ edit, name, size = 42 }: AccountTabIconType) {
  return (
    <Tooltip title={ucFirst(name)}>
      <Badge dot={edit}>
        <PlatformIcon name={name} size={size} />
      </Badge>
    </Tooltip>
  )
}
