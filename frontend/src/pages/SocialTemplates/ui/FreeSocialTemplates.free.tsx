import Error404 from '@pages/Error404'
import { lazy, Suspense } from 'react'
import { useParams } from 'react-router'

import { Loading } from '../../../AppRoutes'
import useSocialTemplates from '../data/useSocialTemplates'
import SocialTemplateWrapper from './SocialTemplateWrapper'

const FacebookSettings = lazy(() => import('../internals/FacebookSettings'))
const TwitterSettings = lazy(() => import('../internals/TwitterSettings'))
const LinkedinSettings = lazy(() => import('../internals/LinkedinSettings'))
const TumblrSettings = lazy(() => import('../internals/TumblrSettings'))
const TelegramSettings = lazy(() => import('../internals/TelegramSettings'))
const DiscordSettings = lazy(() => import('../internals/DiscordSettings'))
const PinterestSettings = lazy(() => import('../internals/PinterestSettings'))
const InstagramSettings = lazy(() => import('../internals/InstagramSettings'))
const BlueskySettings = lazy(() => import('../internals/BlueskySettings'))
const LineSettings = lazy(() => import('../internals/LineSettings'))

const GoogleBusinessProfileSettings = lazy(() => import('../internals/GoogleBusinessProfileSettings'))

export default function FreeSocialTemplates() {
  const { platform } = useParams()
  useSocialTemplates()

  const getPlatform = () => {
    switch (platform) {
      case 'bluesky': {
        return <BlueskySettings />
      }
      case 'discord': {
        return <DiscordSettings />
      }
      case 'facebook':
      case undefined: {
        return <FacebookSettings />
      }
      case 'googleBusinessProfile': {
        return <GoogleBusinessProfileSettings />
      }
      case 'instagram': {
        return <InstagramSettings />
      }
      case 'line': {
        return <LineSettings />
      }
      case 'linkedin': {
        return <LinkedinSettings />
      }
      case 'pinterest': {
        return <PinterestSettings />
      }
      case 'telegram': {
        return <TelegramSettings />
      }
      case 'tumblr': {
        return <TumblrSettings />
      }
      case 'twitter': {
        return <TwitterSettings />
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
