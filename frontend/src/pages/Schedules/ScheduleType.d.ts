import type React from 'react'

import { type ScheduleModalType } from '@common/globalStates/GlobalStates'
import { type TiktokValueType } from '@pages/ShareNow/ShareNowType'

export interface ScheduleType {
  accounts: ScheduleAccountsType
  id?: number
  post_filters: Partial<SchedulePostFiltersType>
  settings: Partial<ScheduleSettingsType>
  templates: ScheduleTemplatesType
}

export interface IntervalType {
  type: string
  value: number
}

interface ScheduleSettingsType {
  interval: IntervalType
  is_repeat_schedule_enabled: boolean
  is_sleep_time_enabled: boolean
  name: string
  post_interval_type: string
  post_interval_value: number
  post_publish_order: string
  repeat_schedule: number
  sleep_days: string
  sleep_time: [string, string]
  started_at: string
}

interface SchedulePostFiltersType {
  categories_and_tags: string
  custom_date_range: [string, string]
  filter_by_days: string
  post_type: string
  specific_postIds?: number[]
}

interface ScheduleAccountsType {
  accountIds: number[]
  groupIds: number[]
}

interface FacebookValueType {
  content: string
  isAllImages: boolean
  isFeaturedImage: boolean
  isLinkCard: boolean
  isProductImage: boolean
  isProductImage: boolean
  isVideo: boolean
}

interface LinkedinValueType {
  content: string
  isAllImages: boolean
  isFeaturedImage: boolean
  isLinkCard: boolean
  isProductImage: boolean
  isVideo: boolean
}

interface TwitterValueType {
  content: string
  isAllImages: boolean
  isFeaturedImage: boolean
  isLinkCard: boolean
  isProductImage: boolean
}

interface PinterestValueType {
  content: string
  isAllImages: boolean
  isFeaturedImage: boolean
  isLinkCard: boolean
  isProductImage: boolean
}

interface GoogleBusinessProfileValueType {
  button: string
  content: string
  isAllImages: boolean
  isFeaturedImage: boolean
  isLinkCard: boolean
  isProductImage: boolean
}

interface DiscordValueType {
  content: string
  isAllImages: boolean
  isFeaturedImage: boolean
  isLinkCard: boolean
  isProductImage: boolean
}

interface BlueskyValueType {
  comment: string
  content: string
  isAllImages: boolean
  isFeaturedImage: boolean
  isLinkCard: boolean
  isProductImage: boolean
}

interface LineValueType {
  content: string
  isAllImages: boolean
  isFeaturedImage: boolean
  isLinkCard: boolean
  isProductImage: boolean
}

interface TelegramValueType {
  content: string
  isAllImages: boolean
  isFeaturedImage: boolean
  isLinkCard: boolean
  isProductImage: boolean
}

interface InstagramValueType {
  comment: string
  content: string
  isAllImages: boolean
  isFeaturedImage: boolean
  isProductImage: boolean
  isVideo: boolean
}
interface InstagramValueType {
  comment: string
  content: string
  isAllImages: boolean
  isFeaturedImage: boolean
  isProductImage: boolean
  isVideo: boolean
}
interface TiktokValueType {
  allowComment: boolean
  content: string
  duet: boolean
  edit: boolean
  media: MediaListType
  postingType: 'isAllImages' | 'isFeaturedImage' | 'isLinkCard' | 'isProductImage' | 'onlyMessage'
  privacyLevel: string
  stitch: boolean
}
interface TumblrValueType {
  content: string
  isAllImages: boolean
  isFeaturedImage: boolean
  isLinkCard: boolean
  isProductImage: boolean
  isVideo: boolean
}

export interface ScheduleTemplatesType {
  bluesky: BlueskyValueType
  discord: DiscordValueType
  facebook: FacebookValueType
  googleBusinessProfile: GoogleBusinessProfileValueType
  instagram: InstagramValueType
  line: LineValueType
  linkedin: LinkedinValueType
  pinterest: PinterestValueType
  telegram: TelegramValueType
  tiktok: TiktokValueType
  tumblr: TumblrValueType
  twitter: TwitterValueType
}

export interface ScheduleTableDataType {
  id?: number
  interval: { settings: Partial<ScheduleSettingsType> }
  key?: React.key
  nextPost: string
  status: number
  title: string
}

export interface CreateScheduleModalType {
  btnTitle?: string
  isScheduleModalOpen: ScheduleModalType
  setIsScheduleModalOpen: React.Dispatch<React.SetStateAction<ScheduleModalType>>
}
