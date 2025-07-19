import Error404 from '@pages/Error404'
import useSocialTemplates from '@pages/SocialTemplates/data/useSocialTemplates'
import SocialTemplateWrapper from '@pages/SocialTemplates/ui/SocialTemplateWrapper'
import { Loading } from '@src/AppRoutes'
import { lazy, Suspense } from 'react'
import { useParams } from 'react-router'

const FacebookSettings = lazy(() => import('@pages/SocialTemplates/internals/FacebookSettings'))
const LinkedinSettings = lazy(() => import('@pages/SocialTemplates/internals/LinkedinSettings'))
const ProTwitterSettings = lazy(() => import('../internals/ProTwitterSettings'))
const ProTumblrSettings = lazy(() => import('../internals/ProTumblrSettings'))
const ProTelegramSettings = lazy(() => import('../internals/ProTelegramSettings'))
const ProTiktokSettings = lazy(() => import('../internals/ProTiktokSettings'))
const ProDiscordSettings = lazy(() => import('../internals/ProDiscordSettings'))
const ProPinterestSettings = lazy(() => import('../internals/ProPinterestSettings'))
const ProBlueskySettings = lazy(() => import('../internals/ProBlueskySettings'))
const ProLineSettings = lazy(() => import('../internals/ProLineSettings'))
const ProInstagramSettings = lazy(() => import('../internals/ProInstagramSettings'))
const ProGoogleBusinessProfileSettings = lazy(
  () => import('../internals/ProGoogleBusinessProfileSettings')
)

export default function ProSocialTemplates() {
  const { platform } = useParams()
  useSocialTemplates()

  const getPlatform = () => {
    switch (platform) {
      case 'bluesky': {
        return <ProBlueskySettings />
      }
      case 'discord': {
        return <ProDiscordSettings />
      }
      case 'facebook':
      case undefined: {
        return <FacebookSettings />
      }
      case 'googleBusinessProfile': {
        return <ProGoogleBusinessProfileSettings />
      }
      case 'instagram': {
        return <ProInstagramSettings />
      }
      case 'line': {
        return <ProLineSettings />
      }
      case 'linkedin': {
        return <LinkedinSettings />
      }
      case 'pinterest': {
        return <ProPinterestSettings />
      }
      case 'telegram': {
        return <ProTelegramSettings />
      }
      case 'tiktok': {
        return <ProTiktokSettings />
      }
      case 'tumblr': {
        return <ProTumblrSettings />
      }
      case 'twitter': {
        return <ProTwitterSettings />
      }
      default: {
        return <Error404 />
      }
    }
  }

  return (
    <SocialTemplateWrapper>
      <Suspense fallback={<Loading />}>{getPlatform()}</Suspense>
    </SocialTemplateWrapper>
  )
}
