import facebookAppAuthorization from '@pages/Accounts/internals/AppConnectCard/helper/facebook/facebookAppsOAuth2'
import linkedinAppAuthorization from '@pages/Accounts/internals/AppConnectCard/helper/linkedin/LinkedinCustomAppsOAuth2'

import discordAppAuthorization from './helper/discord/discordCustomAppsOAuth2'
import googleBusinessProfileOAuth2 from './helper/googleBusinessProfile/googleBusinessProfileOAuth2'
import instagramAppAuthorization from './helper/instagram/instagramAppsOAuth2'
import pinterestAppAuthorization from './helper/pinterest/pinterestCustomAppsOAuth2'
import tiktokAppAuthorization from './helper/tiktok/tiktokAppsOAuth2'
import tumblrAppAuthorization from './helper/tumblr/tumblrOauth2'
import { customTwitterAppAuthorizationOne } from './helper/twitter/twitterCustomAppsOAuth1'
import { customTwitterAppAuthorizationTwo } from './helper/twitter/twitterCustomAppsOAuth2'

export default function proOneClickAuth(platform: string, version?: string) {
  switch (platform) {
    case 'discord': {
      return discordAppAuthorization
    }
    case 'facebook': {
      return facebookAppAuthorization
    }
    case 'googleBusinessProfile': {
      return googleBusinessProfileOAuth2
    }
    case 'instagram': {
      return instagramAppAuthorization
    }
    case 'linkedin': {
      return linkedinAppAuthorization
    }
    case 'pinterest': {
      return pinterestAppAuthorization
    }
    case 'tiktok': {
      return tiktokAppAuthorization
    }
    case 'tumblr': {
      return tumblrAppAuthorization
    }
    case 'twitter': {
      switch (version) {
        case '1.1': {
          return customTwitterAppAuthorizationOne
        }
        case '2': {
          return customTwitterAppAuthorizationTwo
        }
        default: {
          break
        }
      }
      break
    }
    default: {
      break
    }
  }
}
