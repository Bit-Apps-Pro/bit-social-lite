import isPro from '@plugin-commons/utils/isPro'

import AiHubFree from './AiHub.free'
import AiHubPro from './AiHub.pro'

export default function AiHub() {
  return isPro() ? <AiHubPro /> : <AiHubFree />
}
