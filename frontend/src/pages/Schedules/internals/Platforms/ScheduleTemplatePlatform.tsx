import type platforms from '@config/platforms'

import FreeScheduleTemplatePlatform from './FreeScheduleTemplatePlatform.free'

export default function ScheduleTemplatePlatform({ platform }: { platform: keyof typeof platforms }) {
  return <FreeScheduleTemplatePlatform platform={platform} />
}
