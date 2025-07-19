import isPro from '@plugin-commons/utils/isPro'

import FreeSocialTemplates from './FreeSocialTemplates.free'
import ProSocialTemplates from './ProSocialTemplates.pro'

export default function SocialTemplates() {
  return isPro() ? <ProSocialTemplates /> : <FreeSocialTemplates />
}
