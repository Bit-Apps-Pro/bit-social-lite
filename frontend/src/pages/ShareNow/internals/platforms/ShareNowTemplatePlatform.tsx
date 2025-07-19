import type platforms from '@config/platforms'

import isPro from '@plugin-commons/utils/isPro'

import FreeShareNowTemplatePlatform from './FreeShareNowTemplatePlatform.free'
import ProShareNowTemplatePlatform from './ProShareNowTemplatePlatform.pro'

export default function ShareNowTemplatePlatform({ platform }: { platform: keyof typeof platforms }) {
  return isPro() ? (
    <ProShareNowTemplatePlatform platform={platform} />
  ) : (
    <FreeShareNowTemplatePlatform platform={platform} />
  )
}
