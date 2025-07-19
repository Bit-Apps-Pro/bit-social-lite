import isPro from '../utils/isPro'
import { BitAppsPluginUtilUpdateNotice } from './BitappsPluginUtilUpdateNotice'
import LicenseInvalidAlert from './LicenseInvalidAlert.pro'
import PluginUpdateNotice from './PluginUpdateNotice'

export default function AllPluginEssentials() {
  return (
    <div className="mr-2">
      {isPro() && <LicenseInvalidAlert />}
      <PluginUpdateNotice />
      <BitAppsPluginUtilUpdateNotice />
    </div>
  )
}
