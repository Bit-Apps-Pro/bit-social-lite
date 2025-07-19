import type platforms from '@config/platforms'

import { Alert } from 'antd'

export default function LoginInfo({ platform }: { platform: keyof typeof platforms }) {
  switch (platform) {
    case 'bluesky': {
      return (
        <Alert
          message="If 2FA is enable, you must use an App Password in the password field instead of your regular password."
          showIcon
          type="info"
        />
      )
    }
    default: {
      return ''
    }
  }
}
