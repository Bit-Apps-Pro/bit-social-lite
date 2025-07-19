import type platforms from '@config/platforms'

import isPro from '@plugin-commons/utils/isPro'

import FreeScheduleTemplatePlatform from './FreeScheduleTemplatePlatform.free'
import ProScheduleTemplatePlatform from './ProScheduleTemplatePlatform.pro'

export default function ScheduleTemplatePlatform({ platform }: { platform: keyof typeof platforms }) {
  return isPro() ? (
    <ProScheduleTemplatePlatform platform={platform} />
  ) : (
    <FreeScheduleTemplatePlatform platform={platform} />
  )
}
