import type platforms from '@config/platforms'

import { type UploadFile } from 'antd'

export interface ShareNowType {
  accounts: ShareNowAccountsType
  id?: number
  next_published_at?: string
  platforms: (keyof typeof platforms)[]
  settings: ShareNowSettings
  status?: number
  templates: ShareNowTemplatesType
}

export interface ShareNowDataType {
  config: {
    accounts: ShareNowAccountsType
    settings: ShareNowSettings
    templates: ShareNowTemplatesType
  }
  created_at: string
  human_readable_next_publish?: string
  id: number
  name: string
  next_published_at?: string
  started_at?: string
  status: 1 | 2 | 3 | 4
}

export interface ShareNowTableDataType {
  id?: number
  interval: { settings: Partial<ShareNowSettings> }
  key?: React.key
  nextPost: string | undefined
  status: number
  title: string
}

interface IntervalType {
  type: string
  value: number
}

export interface ShareNowSettings {
  interval?: IntervalType
  name: string
  post_interval_type: string
  post_interval_value: number
  repeat: boolean
  sleep_days?: string
  sleep_time?: [string, string]
  started_at: null | string | undefined
}

export interface ShareNowAccountsType {
  accountIds: number[]
  groupIds: number[]
}

export interface ShareBoxType {
  shareNowModalClose: () => void
  shareNowModalType: ShareNowModalType['type']
}

export type MediaListType = UploadFile[]

export interface PlatformValueType {
  button?: string
  content: string
  edit?: boolean
  isFeaturedImage?: boolean
  isLinkCard?: boolean
  link?: string
  media: MediaListType
}
interface FacebookValueType {
  content: string
  edit: boolean
  isAllImages: boolean
  isLinkCard: boolean
  link: string
  media: MediaListType
}

interface LinkedinValueType {
  content: string
  edit: boolean
  isAllImages: boolean
  isLinkCard: boolean
  link: string
  media: MediaListType
}

interface BlueskyValueType {
  comment: string
  content: string
  edit: boolean
  isAllImages: boolean
  isLinkCard: boolean
  link: string
  media: MediaListType
}

interface InstagramValueType {
  comment: string
  content: string
  edit: boolean
  isAllImages: boolean
  media: MediaListType
}
interface ThreadsValueType {
  comment: string
  content: string
  edit: boolean
  isAllImages: boolean
  isLinkCard: boolean
  link: string
  media: MediaListType
  topic: string
}

interface TiktokValueType {
  allowComment: boolean
  content: string
  duet: boolean
  edit: boolean
  media: MediaListType
  privacyLevel: string
  stitch: boolean
}
interface TwitterValueType {
  content: string
  edit: boolean
  isAllImages: boolean
  isLinkCard: boolean
  link: string
  media: MediaListType
}

interface GoogleBusinessProfileValueType {
  button: string
  content: string
  edit: boolean
  isAllImages: boolean
  isLinkCard: boolean
  link: string
  media: MediaListType
}

interface TumblrValueType {
  content: string
  edit: boolean
  isAllImages: boolean
  isLinkCard: boolean
  link: string
  media: MediaListType
}

interface DiscordValueType {
  content: string
  edit: boolean
  isAllImages: boolean
  isLinkCard: boolean
  link: string
  media: MediaListType
}

interface LineValueType {
  content: string
  edit: boolean
  isAllImages: boolean
  isLinkCard: boolean
  link: string
  media: MediaListType
}

interface PinterestValueType {
  content: string
  edit: boolean
  isAllImages: boolean
  isLinkCard: boolean
  link: string
  media: MediaListType
  title: string
}

interface TelegramValueType {
  content: string
  edit: boolean
  isAllImages: boolean
  isLinkCard: boolean
  link: string
  media: MediaListType
}

export interface ShareNowTemplatesType {
  bluesky: BlueskyValueType
  discord: DiscordValueType
  facebook: FacebookValueType
  googleBusinessProfile: GoogleBusinessProfileValueType
  instagram: InstagramValueType
  line: LineValueType
  linkedin: LinkedinValueType
  pinterest: PinterestValueType
  telegram: TelegramValueType
  threads: ThreadsValueType
  tiktok: TiktokValueType
  tumblr: TumblrValueType
  twitter: TwitterValueType
}

export interface PlatformsLimitationsValueType {
  errorMessage: {
    media: {
      image: string
      video: string
    }
    text: string
  }
  gif: {
    frame: number
    size: {
      unit: string
      value: number
    }
  }
  image: {
    dimension: number
    ext: string[]
    height: number
    size: {
      unit: string
      value: number
    }
    width: number
  }
  requirement: {
    message: string
    type: 'content' | 'media'
  }
  video: {
    ext: string[]
    length: {
      unit: string
      value: number
    }
    size: {
      unit: string
      value: number
    }
  }
}

export type ErrorsType = Record<
  string,
  {
    media: MediaListType
    text: string
  }
>

interface MediaValidationType {
  mediaUrl: string
  platformsList: string[]
}

export interface Attachment {
  filename: string
  filesizeInBytes: number
  id: string
  url: string
}

export type PlatformsLimitationsType = Record<keyof typeof platforms, PlatformsLimitationsValueType>
