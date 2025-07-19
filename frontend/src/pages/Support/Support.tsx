import config from '@config/config'
import SupportPage from '@plugin-commons/components/SupportPage'

export default function Support() {
  const pluginSlug = config.PLUGIN_SLUG
  return <SupportPage isCashBackVisible={false} logoComponent={undefined} pluginSlug={pluginSlug} />
}
