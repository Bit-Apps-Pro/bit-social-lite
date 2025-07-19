import type platforms from '@config/platforms'

import PlatformIcon from '@icons/PlatformIcon'
import { Avatar, Badge, theme } from 'antd'

interface AvatarPlatformType {
  avatarLink: string
  platform: keyof typeof platforms
  size?: number
}

export default function AvatarPlatform({ avatarLink, platform, size = 18 }: AvatarPlatformType) {
  const { token } = theme.useToken()

  return (
    <Badge
      count={
        <PlatformIcon
          name={platform}
          size={size}
          style={{ border: '2px solid', borderColor: token.colorBorder }}
        />
      }
      offset={[-2, 28]}
      size="small"
    >
      <Avatar src={avatarLink} />
    </Badge>
  )
}
