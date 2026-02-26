import type platforms from '@config/platforms'

import { type AvatarProps } from 'antd'
import { Avatar } from 'antd'
import React from 'react'

interface PlatformIconType extends Omit<AvatarProps, 'icon' | 'src'> {
  name?: keyof typeof platforms
}

const icons = import.meta.glob('../resource/img/social/*.svg', {
  eager: true,
  import: 'default'
}) as Record<string, string>

const aiIcons = import.meta.glob('../resource/img/ai/*.svg', {
  eager: true,
  import: 'default'
}) as Record<string, string>

function getPlatformIcon(platform?: keyof typeof platforms): React.ReactNode {
  const path = `../resource/img/social/${platform}.svg`
  const defaultPath = '../resource/img/social/default.svg'

  return icons[path] || icons[defaultPath]
}

export function getAiIcon(icon: string): React.ReactNode {
  const path = `../resource/img/ai/${icon}.svg`

  const defaultPath = '../resource/img/social/default.svg'

  return aiIcons[path] || aiIcons[defaultPath]
}

export default function PlatformIcon({ name, ...props }: PlatformIconType) {
  return <Avatar alt={name} src={getPlatformIcon(name)} {...props} />
}
