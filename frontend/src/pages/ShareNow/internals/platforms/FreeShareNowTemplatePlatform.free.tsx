import type platforms from '@config/platforms'

import FacebookShareNowTemplate from './FacebookShareNowTemplate'
import LinkedInShareNowTemplate from './LinkedinShareNowTemplate'

export default function FreeShareNowTemplatePlatform({
  platform
}: {
  platform: keyof typeof platforms
}) {
  switch (platform) {
    case 'facebook': {
      return <FacebookShareNowTemplate />
    }
    case 'linkedin': {
      return <LinkedInShareNowTemplate />
    }

    default:
  }
}
