import facebookAppAuthorization from './helper/facebook/facebookAppsOAuth2'
import linkedinAppAuthorization from './helper/linkedin/LinkedinCustomAppsOAuth2'

export default function freeOneClickAuth(platform: string) {
  switch (platform) {
    case 'facebook': {
      return facebookAppAuthorization
    }

    case 'linkedin': {
      return linkedinAppAuthorization
    }

    default:
  }
}
