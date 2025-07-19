import isPro from '@plugin-commons/utils/isPro'

import ProGroups from './ProGroups.pro'

export default function Groups() {
  return isPro() && <ProGroups />
}
