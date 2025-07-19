export interface Facebook {
  content: string
  postingType: 'isAllImages' | 'isFeaturedImage' | 'isLinkCard' | 'isProductImage' | 'onlyMessage'
  trimMessage: boolean
}

export interface Linkedin {
  content: string
  postingType: 'isAllImages' | 'isFeaturedImage' | 'isLinkCard' | 'isProductImage' | 'onlyMessage'
  trimMessage: boolean
}
export interface Tiktok {
  allowComment: boolean
  content: string
  duet: boolean
  postingType: 'isAllImages' | 'isFeaturedImage' | 'isLinkCard' | 'isProductImage' | 'onlyMessage'
  privacyLevel: 'FOLLOWER_OF_CREATOR' | 'MUTUAL_FOLLOW_FRIENDS' | 'PUBLIC_TO_EVERYONE' | 'SELF_ONLY'
  stitch: boolean
  trimMessage: boolean
}

export interface Twitter {
  content: string
  postingType: 'isAllImages' | 'isFeaturedImage' | 'isLinkCard' | 'isProductImage' | 'onlyMessage'
  trimMessage: boolean
}

export interface Pinterest {
  content: string
  isLinkCard: boolean
  link: string
  postingType: 'isAllImages' | 'isFeaturedImage' | 'isProductImage'
  trimMessage: boolean
}

export interface Discord {
  content: string
  postingType: 'isAllImages' | 'isFeaturedImage' | 'isLinkCard' | 'isProductImage' | 'onlyMessage'
  trimMessage: boolean
}

export interface GoogleBusinessProfile {
  button: string
  content: string
  postingType: 'isAllImages' | 'isFeaturedImage' | 'isLinkCard' | 'isProductImage' | 'onlyMessage'
  trimMessage: boolean
}

export interface Bluesky {
  comment: string
  content: string
  postingType: 'isAllImages' | 'isFeaturedImage' | 'isProductImage'
  trimMessage: boolean
}
export interface Instagram {
  comment: string
  content: string
  postingType: 'isAllImages' | 'isFeaturedImage' | 'isProductImage'
  trimMessage: boolean
}
export interface Tumblr {
  content: string
  postingType: 'isAllImages' | 'isFeaturedImage' | 'isLinkCard' | 'isProductImage' | 'onlyMessage'
  trimMessage: boolean
}

export interface Line {
  content: string
  postingType: 'isAllImages' | 'isFeaturedImage' | 'isLinkCard' | 'isProductImage' | 'onlyMessage'
  trimMessage: boolean
}

export interface Telegram {
  content: string
  postingType: 'isAllImages' | 'isFeaturedImage' | 'isLinkCard' | 'isProductImage' | 'onlyMessage'
  trimMessage: boolean
}

export interface SocialTemplates {
  bluesky: Bluesky
  discord: Discord
  facebook: Facebook
  googleBusinessProfile: GoogleBusinessProfile
  instagram: Instagram
  line: Line
  linkedin: Linkedin
  pinterest: Pinterest
  telegram: Telegram
  tiktok: Tiktok
  tumblr: Tumblr
  twitter: Twitter
}
