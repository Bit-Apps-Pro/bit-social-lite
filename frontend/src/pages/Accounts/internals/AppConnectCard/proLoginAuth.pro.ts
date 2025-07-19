import { blueskyLoginAuthorization } from './helper/bluesky/blueskyLoginAuth'

export default function proLoginAuth(platform: string) {
  switch (platform) {
    case 'bluesky': {
      return blueskyLoginAuthorization
    }

    default: {
      break
    }
  }
}
