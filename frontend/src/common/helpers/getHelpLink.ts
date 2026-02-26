import config from '@config/config'

const docsLink = {
  bluesky: 'https://bit-social.com/documentation/accounts/connect-your-bluesky-account-with-bit-social/',
  discord: 'https://bit-social.com/docs/accounts/connect-your-discord-account-with-bit-social/',
  facebook:
    'https://bit-social.com/documentation/accounts/connect-your-facebook-account-with-bit-social/',
  googleBusinessProfile:
    'https://bit-social.com/documentation/accounts/connect-your-google-business-profile-account-with-bit-social/',
  instagram:
    'https://bit-social.com/documentation/accounts/connect-your-instagram-account-with-bit-social/',
  line: 'https://bit-social.com/documentation/accounts/connect-your-line-account-with-bit-social/',
  linkedin:
    'https://bit-social.com/documentation/accounts/connect-your-linkedin-account-with-bit-social/',
  pinterest: 'https://bit-social.com/docs/accounts/connect-your-pinterest-account-with-bit-social/',
  telegram:
    'https://bit-social.com/documentation/accounts/connect-your-telegram-account-with-bit-social/',
  threads: 'https://bit-social.com/documentation/accounts/connect-your-threads-account-with-bit-social/',
  tiktok: 'https://bit-social.com/documentation/accounts/connect-your-tiktok-account-with-bit-social/',
  tumblr: 'https://bit-social.com/documentation/accounts/connect-your-tumblr-account-with-bit-social/',
  twitter: 'https://bit-social.com/documentation/accounts/connect-your-twitter-account-with-bit-social/'
} as const

export function getHelpLink(key: keyof typeof docsLink) {
  if (!key || !docsLink[key]) {
    console.error('Invalid link key', key)
    return
  }
  const url = new URL(docsLink[key])
  url.searchParams.append('utm_source', config.PLUGIN_SLUG)
  url.searchParams.append('utm_medium', 'inside-plugin')

  return url.href
}
