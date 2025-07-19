import { atom } from 'jotai'

import { type SocialTemplates } from './SocialTemplatesType'

export const defaultTemplates: SocialTemplates = {
  bluesky: {
    comment: '',
    content: '{post_title}',
    postingType: 'isFeaturedImage',
    trimMessage: true
  },
  discord: {
    content: '{post_title}',
    postingType: 'onlyMessage',
    trimMessage: true
  },
  facebook: {
    content: '{post_title}',
    postingType: 'onlyMessage',
    trimMessage: true
  },
  googleBusinessProfile: {
    button: 'none',
    content: '{post_title}',
    postingType: 'onlyMessage',
    trimMessage: true
  },
  instagram: {
    comment: '',
    content: '{post_title}',
    postingType: 'isFeaturedImage',
    trimMessage: true
  },
  line: {
    content: '{post_title}',
    postingType: 'onlyMessage',
    trimMessage: true
  },
  linkedin: {
    content: '{post_title}',
    postingType: 'onlyMessage',
    trimMessage: true
  },
  pinterest: {
    content: '{post_title}',
    isLinkCard: false,
    link: '',
    postingType: 'isFeaturedImage',
    trimMessage: true
  },
  telegram: {
    content: '{post_title}',
    postingType: 'onlyMessage',
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
    postingType: 'onlyMessage',
    trimMessage: true
  },
  twitter: {
    content: '{post_title}',
    postingType: 'onlyMessage',
    trimMessage: true
  }
}

const $socialTemplates = atom<SocialTemplates>(defaultTemplates)

export default $socialTemplates
