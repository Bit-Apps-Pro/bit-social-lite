import isPro from '@plugin-commons/utils/isPro'

import FreeCronSettings from './FreeCronSettings.free'
import ProCronSettings from './ProCronSettings.pro'

export default function CronSettings() {
  return isPro() ? <ProCronSettings /> : <FreeCronSettings />
}
