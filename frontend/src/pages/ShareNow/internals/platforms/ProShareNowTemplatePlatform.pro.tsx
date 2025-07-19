import type platforms from '@config/platforms'

import FacebookShareNowTemplate from '@pages/ShareNow/internals/platforms/FacebookShareNowTemplate'
import LinkedInShareNowTemplate from '@pages/ShareNow/internals/platforms/LinkedinShareNowTemplate'

import ProBlueskyShareNowTemplate from './ProBlueskyShareNowTemplate'
import ProDiscordShareNowTemplate from './ProDiscordShareNowTemplate'
import ProGoogleBusinessProfileShareNowTemplate from './ProGoogleBusinessProfileShareNowTemplate'
import ProInstagramShareNowTemplate from './ProInstagramShareNowTemplate'
import ProLineShareNowTemplate from './ProLineShareNowTemplate'
import ProPinterestShareNowTemplate from './ProPinterestShareNowTemplate'
import ProTelegramShareNowTemplate from './ProTelegramShareNowTemplate'
import ProTiktokShareNowTemplate from './ProTiktokShareNowTemplate'
import ProTumblrShareNowTemplate from './ProTumblrShareNowTemplate'
import ProTwitterShareNowTemplate from './ProTwitterShareNowTemplate'

export default function ProShareNowTemplatePlatform({ platform }: { platform: keyof typeof platforms }) {
  switch (platform) {
    case 'bluesky': {
      return <ProBlueskyShareNowTemplate />
    }
    case 'discord': {
      return <ProDiscordShareNowTemplate />
    }
    case 'facebook': {
      return <FacebookShareNowTemplate />
    }
    case 'googleBusinessProfile': {
      return <ProGoogleBusinessProfileShareNowTemplate />
    }
    case 'instagram': {
      return <ProInstagramShareNowTemplate />
    }
    case 'line': {
      return <ProLineShareNowTemplate />
    }
    case 'linkedin': {
      return <LinkedInShareNowTemplate />
    }
    case 'pinterest': {
      return <ProPinterestShareNowTemplate />
    }
    case 'telegram': {
      return <ProTelegramShareNowTemplate />
    }
    case 'tiktok': {
      return <ProTiktokShareNowTemplate />
    }
    case 'tumblr': {
      return <ProTumblrShareNowTemplate />
    }
    case 'twitter': {
      return <ProTwitterShareNowTemplate />
    }

    default:
  }
}
