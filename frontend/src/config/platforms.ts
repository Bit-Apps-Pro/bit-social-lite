/* eslint-disable perfectionist/sort-objects */
type PlatformType = Record<
  | 'bluesky'
  | 'discord'
  | 'facebook'
  | 'googleBusinessProfile'
  | 'instagram'
  | 'line'
  | 'linkedin'
  | 'pinterest'
  | 'telegram'
  | 'tiktok'
  | 'tumblr'
  | 'twitter',
  {
    image: string
    name: string
  }
>

const platforms: PlatformType = {
  facebook: {
    image: '',
    name: 'Facebook'
  },
  linkedin: {
    image: '',
    name: 'LinkedIn'
  },
  discord: {
    image: '',
    name: 'Discord'
  },
  googleBusinessProfile: {
    image: '',
    name: 'Google Business Profile'
  },

  pinterest: {
    image: '',
    name: 'Pinterest'
  },
  tumblr: {
    image: '',
    name: 'Tumblr'
  },
  twitter: {
    image: '',
    name: 'X (Twitter)'
  },
  instagram: {
    image: '',
    name: 'Instagram'
  },
  tiktok: {
    image: '',
    name: 'TikTok'
  },
  bluesky: {
    image: '',
    name: 'Bluesky'
  },
  telegram: {
    image: '',
    name: 'Telegram'
  },
  line: {
    image: '',
    name: 'Line'
  }
}

export default platforms
