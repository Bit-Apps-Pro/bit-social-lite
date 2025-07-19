import type platforms from '@config/platforms'

import FacebookScheduleTemplate from '@pages/Schedules/internals/Platforms/FacebookScheduleTemplate'
import LinkedinScheduleTemplate from '@pages/Schedules/internals/Platforms/LinkedinScheduleTemplate'

import ProBlueskyScheduleTemplate from './ProBlueskyScheduleTemplate'
import ProDiscordScheduleTemplate from './ProDiscordScheduleTemplate'
import ProGoogleBusinessProfileScheduleTemplate from './ProGoogleBusinessProfileScheduleTemplate '
import ProInstagramScheduleTemplate from './ProInstagramScheduleTemplate'
import ProLineScheduleTemplate from './ProLineScheduleTemplate'
import ProPinterestScheduleTemplate from './ProPinterestScheduleTemplate '
import ProTelegramScheduleTemplate from './ProTelegramScheduleTemplate'
import ProTiktokScheduleTemplate from './ProTiktokScheduleTemplate'
import ProTumblrScheduleTemplate from './ProTumblrScheduleTemplate '
import ProTwitterScheduleTemplate from './ProTwitterScheduleTemplate '

export default function ProScheduleTemplatePlatform({ platform }: { platform: keyof typeof platforms }) {
  switch (platform) {
    case 'bluesky': {
      return <ProBlueskyScheduleTemplate />
    }
    case 'discord': {
      return <ProDiscordScheduleTemplate />
    }
    case 'facebook': {
      return <FacebookScheduleTemplate />
    }
    case 'googleBusinessProfile': {
      return <ProGoogleBusinessProfileScheduleTemplate />
    }
    case 'instagram': {
      return <ProInstagramScheduleTemplate />
    }
    case 'line': {
      return <ProLineScheduleTemplate />
    }
    case 'linkedin': {
      return <LinkedinScheduleTemplate />
    }
    case 'pinterest': {
      return <ProPinterestScheduleTemplate />
    }
    case 'telegram': {
      return <ProTelegramScheduleTemplate />
    }
    case 'tiktok': {
      return <ProTiktokScheduleTemplate />
    }
    case 'tumblr': {
      return <ProTumblrScheduleTemplate />
    }
    case 'twitter': {
      return <ProTwitterScheduleTemplate />
    }
    default:
  }
}
