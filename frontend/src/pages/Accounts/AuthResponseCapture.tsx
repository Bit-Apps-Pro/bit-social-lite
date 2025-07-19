import { useEffect } from 'react'

import saveAuthCodeResponse from './internals/Platforms/helper/authCodeResponse'

export default function AuthResponseCapture() {
  useEffect(() => {
    saveAuthCodeResponse()
  }, [])

  return <></>
}
