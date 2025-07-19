import type platforms from '@config/platforms'

import { Typography } from 'antd'

import DeveloperVisitText from './DeveloperVisitText'

const { Text } = Typography

export const description = (name: string) => {
  switch (name) {
    case 'discord': {
      return <DeveloperVisitText devLink={'https://discord.com/developers/applications/'} name={name} />
    }

    case 'facebook': {
      return <DeveloperVisitText devLink={'https://developers.facebook.com/apps/'} name={name} />
    }
    case 'googleBusinessProfile': {
      return <DeveloperVisitText devLink={'https://console.cloud.google.com/'} name={name} />
    }
    case 'instagram': {
      return <DeveloperVisitText devLink={'https://developers.facebook.com/apps/'} name={name} />
    }
    case 'linkedin': {
      return <DeveloperVisitText devLink={'https://www.linkedin.com/developers/apps'} name={name} />
    }
    case 'pinterest': {
      return <DeveloperVisitText devLink={'https://developers.pinterest.com/apps/'} name={name} />
    }
    case 'tiktok': {
      return <DeveloperVisitText devLink={'https://developers.tiktok.com'} name={name} />
    }
    case 'tumblr': {
      return <DeveloperVisitText devLink={'https://www.tumblr.com/oauth/apps'} name={name} />
    }
    case 'twitter': {
      return (
        <DeveloperVisitText devLink={'https://developer.twitter.com/en/portal/dashboard'} name={name} />
      )
    }
    default: {
      return ''
    }
  }
}

export default function DeveloperInfo({ platform }: { platform: keyof typeof platforms }) {
  return <Text>{description(platform)}</Text>
}
