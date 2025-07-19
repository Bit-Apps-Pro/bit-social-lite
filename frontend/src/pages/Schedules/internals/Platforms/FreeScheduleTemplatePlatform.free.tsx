import type platforms from '@config/platforms'

import FacebookScheduleTemplate from './FacebookScheduleTemplate'
import LinkedinScheduleTemplate from './LinkedinScheduleTemplate'

export default function FreeScheduleTemplatePlatform({
  platform
}: {
  platform: keyof typeof platforms
}) {
  switch (platform) {
    case 'facebook': {
      return <FacebookScheduleTemplate />
    }
    case 'linkedin': {
      return <LinkedinScheduleTemplate />
    }

    default:
  }
}
