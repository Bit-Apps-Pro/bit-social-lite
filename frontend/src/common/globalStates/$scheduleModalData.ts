import { getAtom } from '@common/globalStates'
import { dateTime } from '@common/helpers/globalHelpers'
import { type ScheduleTemplatesType, type ScheduleType } from '@pages/Schedules/ScheduleType'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { atom } from 'jotai'

import $bitSocial from './$bitSocial'
import { type ScheduleModalType } from './GlobalStates'
import $socialTemplates from './socialTemplates/$socialTemplates'
import { type SocialTemplates } from './socialTemplates/SocialTemplatesType'

// for modal
const $scheduleModalData = atom<ScheduleModalType>({ open: false, type: 'create' })

// for debounce
const $searchText = atom<string>('')

// for default schedule data
dayjs.extend(utc)
dayjs.extend(timezone)

const { timeZone } = getAtom($bitSocial)
const templates = getAtom($socialTemplates)

const startDateTime = dayjs(dateTime(timeZone)).format('YYYY-MM-DD HH:mm:ss')

export const platformDefaultTemplates = (updatedTemplates: SocialTemplates): ScheduleTemplatesType => ({
  bluesky: {
    comment: updatedTemplates.bluesky.comment,
    content: updatedTemplates.bluesky.content,
    customImages: updatedTemplates.bluesky.customImages || [],
    isAllImages: false,
    isCustomImage: false,
    isFeaturedImage: false,
    isLinkCard: false,
    isProductImage: false,
    isPromptImage: false,
    promptImage: updatedTemplates.bluesky.promptImage || ''
  },
  discord: {
    content: updatedTemplates.discord.content,
    customImages: updatedTemplates.discord.customImages || [],
    isAllImages: false,
    isCustomImage: false,
    isFeaturedImage: true,
    isLinkCard: false,
    isProductImage: false,
    isPromptImage: false,
    promptImage: updatedTemplates.discord.promptImage || ''
  },
  facebook: {
    content: updatedTemplates.facebook.content,
    customImages: updatedTemplates.facebook.customImages || [],
    isAllImages: false,
    isCustomImage: false,
    isFeaturedImage: false,
    isLinkCard: false,
    isProductImage: false,
    isPromptImage: false,
    isVideo: false,
    promptImage: updatedTemplates.facebook.promptImage || ''
  },
  googleBusinessProfile: {
    button: 'none',
    content: updatedTemplates.googleBusinessProfile.content,
    customImages: updatedTemplates.googleBusinessProfile.customImages || [],
    isAllImages: false,
    isCustomImage: false,
    isFeaturedImage: false,
    isLinkCard: false,
    isProductImage: false,
    isPromptImage: false,
    promptImage: updatedTemplates.googleBusinessProfile.promptImage || ''
  },
  instagram: {
    comment: updatedTemplates.instagram.comment,
    content: updatedTemplates.instagram.content,
    customImages: updatedTemplates.instagram.customImages || [],
    isAllImages: false,
    isCustomImage: false,
    isFeaturedImage: false,
    isProductImage: false,
    isPromptImage: false,
    isVideo: false,
    promptImage: updatedTemplates.instagram.promptImage || ''
  },
  line: {
    content: updatedTemplates.line.content,
    customImages: updatedTemplates.line.customImages || [],
    isAllImages: false,
    isCustomImage: false,
    isFeaturedImage: false,
    isLinkCard: false,
    isProductImage: false,
    isPromptImage: false,
    promptImage: updatedTemplates.line.promptImage || ''
  },
  linkedin: {
    content: updatedTemplates.linkedin.content,
    customImages: updatedTemplates.linkedin.customImages || [],
    isAllImages: false,
    isCustomImage: false,
    isFeaturedImage: false,
    isLinkCard: false,
    isProductImage: false,
    isPromptImage: false,
    isVideo: false,
    promptImage: updatedTemplates.linkedin.promptImage || ''
  },
  pinterest: {
    content: updatedTemplates.pinterest.content,
    customImages: updatedTemplates.pinterest.customImages || [],
    isAllImages: false,
    isCustomImage: false,
    isFeaturedImage: true,
    isLinkCard: false,
    isProductImage: false,
    isPromptImage: false,
    promptImage: updatedTemplates.pinterest.promptImage || '',
    title: updatedTemplates.pinterest.title
  },
  telegram: {
    content: updatedTemplates.telegram.content,
    customImages: updatedTemplates.telegram.customImages || [],
    isAllImages: false,
    isCustomImage: false,
    isFeaturedImage: false,
    isLinkCard: false,
    isProductImage: false,
    isPromptImage: false,
    promptImage: updatedTemplates.telegram.promptImage || ''
  },
  threads: {
    comment: updatedTemplates.threads.comment,
    content: updatedTemplates.threads.content,
    customImages: updatedTemplates.threads.customImages || [],
    isAllImages: false,
    isCustomImage: false,
    isFeaturedImage: false,
    isLinkCard: false,
    isProductImage: false,
    isPromptImage: false,
    promptImage: updatedTemplates.threads.promptImage || '',
    topic: updatedTemplates.threads.topic
  },
  tiktok: {
    allowComment: true,
    content: updatedTemplates.tiktok.content,
    duet: false,
    edit: false,
    media: [],
    privacyLevel: 'PUBLIC_TO_EVERYONE',
    stitch: false
  },
  tumblr: {
    content: updatedTemplates.tumblr.content,
    customImages: updatedTemplates.tumblr.customImages || [],
    isAllImages: false,
    isCustomImage: false,
    isFeaturedImage: false,
    isLinkCard: false,
    isProductImage: false,
    isPromptImage: false,
    isVideo: false,
    promptImage: updatedTemplates.tumblr.promptImage || ''
  },
  twitter: {
    content: updatedTemplates.twitter.content,
    customImages: updatedTemplates.twitter.customImages || [],
    isAllImages: false,
    isCustomImage: false,
    isFeaturedImage: false,
    isLinkCard: false,
    isProductImage: false,
    isPromptImage: false,
    promptImage: updatedTemplates.twitter.promptImage || ''
  }
})

const defaultScheduleData = (updatedTemplates: SocialTemplates): ScheduleType => ({
  accounts: {
    accountIds: [],
    groupIds: []
  },
  post_filters: {
    filter_by_days: '0',
    post_type: 'post'
  },
  settings: {
    name: 'Untitled schedule',
    post_interval_type: 'hour',
    post_interval_value: 1,
    post_publish_order: '4',
    started_at: startDateTime
  },
  templates: platformDefaultTemplates(updatedTemplates)
})

const $scheduleData = atom<ScheduleType>(defaultScheduleData(templates))

export { $scheduleData, $scheduleModalData, $searchText, defaultScheduleData }
