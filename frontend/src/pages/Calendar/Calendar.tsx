import isPro from '@plugin-commons/utils/isPro'

import FreeCalendar from './FreeCalendar.free'
import ProCalendar from './ProCalendar.pro'

export default function Calendar() {
  return isPro() ? <ProCalendar /> : <FreeCalendar />
}
