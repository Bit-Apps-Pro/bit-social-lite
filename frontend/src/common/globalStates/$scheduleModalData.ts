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

const platformDefaultTemplates = (updatedTemplates: SocialTemplates): ScheduleTemplatesType => ({
  bluesky: {
    comment: updatedTemplates.bluesky.comment,
    content: updatedTemplates.bluesky.content,
    isAllImages: false,
    isFeaturedImage: false,
    isLinkCard: false,
    isProductImage: false
  },
  discord: {
    content: updatedTemplates.discord.content,
    isAllImages: false,
    isFeaturedImage: true,
    isLinkCard: false,
    isProductImage: false
  },
  facebook: {
    content: updatedTemplates.facebook.content,
    isAllImages: false,
    isFeaturedImage: false,
    isLinkCard: false,
    isProductImage: false,
    isVideo: false
  },
  googleBusinessProfile: {
    button: 'none',
    content: updatedTemplates.googleBusinessProfile.content,
    isAllImages: false,
    isFeaturedImage: false,
    isLinkCard: false,
    isProductImage: false
  },
  instagram: {
    comment: updatedTemplates.instagram.comment,
    content: updatedTemplates.instagram.content,
    isAllImages: false,
    isFeaturedImage: false,
    isProductImage: false,
    isVideo: false
  },
  line: {
    content: updatedTemplates.bluesky.content,
    isAllImages: false,
    isFeaturedImage: false,
    isLinkCard: false,
    isProductImage: false
  },
  linkedin: {
    content: updatedTemplates.linkedin.content,
    isAllImages: false,
    isFeaturedImage: false,
    isLinkCard: false,
    isProductImage: false,
    isVideo: false
  },
  pinterest: {
    content: updatedTemplates.pinterest.content,
    isAllImages: false,
    isFeaturedImage: true,
    isLinkCard: false,
    isProductImage: false
  },
  telegram: {
    content: updatedTemplates.telegram.content,
    isAllImages: false,
    isFeaturedImage: false,
    isLinkCard: false,
    isProductImage: false
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
    isAllImages: false,
    isFeaturedImage: false,
    isLinkCard: false,
    isProductImage: false,
    isVideo: false
  },

  twitter: {
    content: updatedTemplates.twitter.content,
    isAllImages: false,
    isFeaturedImage: false,
    isLinkCard: false,
    isProductImage: false
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
