/* eslint-disable translate-obj-prop/translate-obj-prop */
import { type ShareNowType } from '@pages/ShareNow/ShareNowType'
import { atom } from 'jotai'

export const defaultShareNowData = () => ({
  accounts: {
    accountIds: [],
    groupIds: []
  },
  platforms: [],
  settings: {
    name: 'Untitled Share now',
    post_interval_type: 'hour',
    post_interval_value: 1,
    repeat: false,
    started_at: undefined
  },
  templates: {
    all: { content: '', isLinkCard: false, link: '', media: [] },
    bluesky: {
      comment: '',
      content: '',
      edit: false,
      isAllImages: false,
      isLinkCard: false,
      link: '',
      media: []
    },
    discord: { content: '', edit: false, isAllImages: false, isLinkCard: false, link: '', media: [] },
    facebook: {
      content: '',
      edit: false,
      isAllImages: false,
      isLinkCard: false,
      link: '',
      media: []
    },
    googleBusinessProfile: {
      button: 'none',
      content: '',
      edit: false,
      isAllImages: false,
      isLinkCard: false,
      link: '',
      media: []
    },
    instagram: { comment: '', content: '', edit: false, isAllImages: true, media: [] },
    line: { content: '', edit: false, isAllImages: false, isLinkCard: false, link: '', media: [] },
    linkedin: { content: '', edit: false, isAllImages: false, isLinkCard: false, link: '', media: [] },
    pinterest: {
      content: '',
      edit: false,
      isAllImages: false,
      isLinkCard: false,
      link: '',
      media: [],
      title: ''
    },
    telegram: { content: '', edit: false, isAllImages: false, isLinkCard: false, link: '', media: [] },
    threads: {
      comment: '',
      content: '',
      edit: false,
      isAllImages: false,
      isLinkCard: false,
      link: '',
      media: [],
      topic: ''
    },
    tiktok: {
      allowComment: true,
      content: '',
      duet: false,
      edit: false,
      media: [],
      privacyLevel: 'PUBLIC_TO_EVERYONE',
      stitch: false
    },
    tumblr: { content: '', edit: false, isAllImages: false, isLinkCard: false, link: '', media: [] },
    twitter: { content: '', edit: false, isAllImages: false, isLinkCard: false, link: '', media: [] }
  }
})

const $shareNowData = atom<ShareNowType>(defaultShareNowData())
export default $shareNowData
