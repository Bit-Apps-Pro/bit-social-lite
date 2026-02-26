export interface Facebook {
  content: string
  customImages: string[]
  postingType:
    | 'isAllImages'
    | 'isCustomImage'
    | 'isFeaturedImage'
    | 'isLinkCard'
    | 'isProductImage'
    | 'isPromptImage'
    | 'onlyMessage'
  promptImage: string
  trimMessage: boolean
}

export interface Linkedin {
  content: string
  customImages: string[]
  postingType:
    | 'isAllImages'
    | 'isCustomImage'
    | 'isFeaturedImage'
    | 'isLinkCard'
    | 'isProductImage'
    | 'isPromptImage'
    | 'onlyMessage'
  promptImage: string
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
  customImages: string[]
  postingType:
    | 'isAllImages'
    | 'isCustomImage'
    | 'isFeaturedImage'
    | 'isLinkCard'
    | 'isProductImage'
    | 'isPromptImage'
    | 'onlyMessage'
  promptImage: string
  trimMessage: boolean
}

export interface Pinterest {
  content: string
  customImages: string[]
  isLinkCard: boolean
  link: string
  postingType: 'isAllImages' | 'isCustomImage' | 'isFeaturedImage' | 'isProductImage' | 'isPromptImage'
  promptImage: string
  title: string
  trimMessage: boolean
}

export interface Discord {
  content: string
  customImages: string[]
  postingType:
    | 'isAllImages'
    | 'isCustomImage'
    | 'isFeaturedImage'
    | 'isLinkCard'
    | 'isProductImage'
    | 'isPromptImage'
    | 'onlyMessage'
  promptImage: string
  trimMessage: boolean
}

export interface GoogleBusinessProfile {
  button: string
  content: string
  customImages: string[]
  postingType:
    | 'isAllImages'
    | 'isCustomImage'
    | 'isFeaturedImage'
    | 'isLinkCard'
    | 'isProductImage'
    | 'isPromptImage'
    | 'onlyMessage'
  promptImage: string
  trimMessage: boolean
}

export interface Bluesky {
  comment: string
  content: string
  customImages: string[]
  postingType:
    | 'isAllImages'
    | 'isCustomImage'
    | 'isFeaturedImage'
    | 'isProductImage'
    | 'isPromptImage'
    | 'onlyMessage'
  promptImage: string
  trimMessage: boolean
}

export interface Instagram {
  comment: string
  content: string
  customImages: string[]
  postingType: 'isAllImages' | 'isCustomImage' | 'isFeaturedImage' | 'isProductImage' | 'isPromptImage'
  promptImage: string
  trimMessage: boolean
}

export interface Threads {
  comment: string
  content: string
  customImages: string[]
  postingType:
    | 'isAllImages'
    | 'isCustomImage'
    | 'isFeaturedImage'
    | 'isLinkCard'
    | 'isProductImage'
    | 'isPromptImage'
    | 'onlyMessage'
  promptImage: string
  topic: string
  trimMessage: boolean
}

export interface Tumblr {
  content: string
  customImages: string[]
  postingType:
    | 'isAllImages'
    | 'isCustomImage'
    | 'isFeaturedImage'
    | 'isLinkCard'
    | 'isProductImage'
    | 'isPromptImage'
    | 'onlyMessage'
  promptImage: string
  trimMessage: boolean
}

export interface Line {
  content: string
  customImages: string[]
  postingType:
    | 'isAllImages'
    | 'isCustomImage'
    | 'isFeaturedImage'
    | 'isLinkCard'
    | 'isProductImage'
    | 'isPromptImage'
    | 'onlyMessage'
  promptImage: string
  trimMessage: boolean
}

export interface Telegram {
  content: string
  customImages: string[]
  postingType:
    | 'isAllImages'
    | 'isCustomImage'
    | 'isFeaturedImage'
    | 'isLinkCard'
    | 'isProductImage'
    | 'isPromptImage'
    | 'onlyMessage'
  promptImage: string
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
  threads: Threads
  tiktok: Tiktok
  tumblr: Tumblr
  twitter: Twitter
}
