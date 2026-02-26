/* eslint-disable translate-obj-prop/translate-obj-prop */
import { atom } from 'jotai'

import { type SocialTemplates } from './SocialTemplatesType'

export const defaultTemplates: SocialTemplates = {
  bluesky: {
    comment: '',
    content: '{post_title}',
    customImages: [],
    postingType: 'isFeaturedImage',
    promptImage: '',
    trimMessage: true
  },
  discord: {
    content: '{post_title}',
    customImages: [],
    postingType: 'onlyMessage',
    promptImage: '',
    trimMessage: true
  },
  facebook: {
    content: '{post_title}',
    customImages: [],
    postingType: 'onlyMessage',
    promptImage: '',
    trimMessage: true
  },
  googleBusinessProfile: {
    button: 'none',
    content: '{post_title}',
    customImages: [],
    postingType: 'onlyMessage',
    promptImage: '',
    trimMessage: true
  },
  instagram: {
    comment: '',
    content: '{post_title}',
    customImages: [],
    postingType: 'isFeaturedImage',
    promptImage: '',
    trimMessage: true
  },
  line: {
    content: '{post_title}',
    customImages: [],
    postingType: 'onlyMessage',
    promptImage: '',
    trimMessage: true
  },
  linkedin: {
    content: '{post_title}',
    customImages: [],
    postingType: 'onlyMessage',
    promptImage: '',
    trimMessage: true
  },
  pinterest: {
    content: '{post_title}',
    customImages: [],
    isLinkCard: false,
    link: '',
    postingType: 'isFeaturedImage',
    promptImage: '',
    title: '{post_title}',
    trimMessage: true
  },
  telegram: {
    content: '{post_title}',
    customImages: [],
    postingType: 'onlyMessage',
    promptImage: '',
    trimMessage: true
  },
  threads: {
    comment: '',
    content: '{post_title}',
    customImages: [],
    postingType: 'onlyMessage',
    promptImage: '',
    topic: '',
    trimMessage: true
  },
  tiktok: {
    allowComment: true,
    content: '{post_title}',
    duet: false,
    postingType: 'onlyMessage',
    privacyLevel: 'PUBLIC_TO_EVERYONE',
    stitch: false,
    trimMessage: true
  },
  tumblr: {
    content: '{post_title}',
    customImages: [],
    postingType: 'onlyMessage',
    promptImage: '',
    trimMessage: true
  },
  twitter: {
    content: '{post_title}',
    customImages: [],
    postingType: 'onlyMessage',
    promptImage: '',
    trimMessage: true
  }
}

const $socialTemplates = atom<SocialTemplates>(defaultTemplates)

export default $socialTemplates
