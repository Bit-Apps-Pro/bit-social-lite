import type platforms from '@config/platforms'

import { __ } from '@common/helpers/i18nWrap'
import YoutubeIcon from '@resource/img/youtube.svg'
import { Avatar, Button, Typography } from 'antd'

interface PlatformType {
  platform: keyof typeof platforms
}

const { Link } = Typography

const docsLink: Record<string, string> = {
  bluesky: 'https://www.youtube.com/watch?v=2ftNPVnAISI',
  discord: 'https://www.youtube.com/watch?v=q85NrjFQ33Y',
  facebook: 'https://www.youtube.com/watch?v=V7-DqQ4dJg4',
  googleBusinessProfile: 'https://www.youtube.com/watch?v=o3Hf2v4HsVs',
  linkedin: 'https://www.youtube.com/watch?v=YcmVEq3GGsk',
  pinterest: 'https://www.youtube.com/watch?v=6deQqqhMYLY',
  tiktok: 'https://www.youtube.com/watch?v=5w5c0kY2tno',
  tumblr: 'https://www.youtube.com/watch?v=WfxpNBBAjRQ',
  twitter: 'https://www.youtube.com/watch?v=v2m99Itn-KU'
}

export default function YoutubeLink({ platform }: PlatformType) {
  if (!platform || !docsLink[platform]) {
    return
  }

  return (
    <Link
      href={docsLink[platform]}
      rel="noopener noreferrer nofollow"
      strong
      style={{ whiteSpace: 'nowrap' }}
      target="_blank"
    >
      <Button icon={<Avatar alt="youtube" size={20} src={YoutubeIcon} />} size="small" type="text">
        {__('Tutorial')}
      </Button>
    </Link>
  )
}
