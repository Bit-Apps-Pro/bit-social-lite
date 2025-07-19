import type platforms from '@config/platforms'

import { type CredentialsType } from '../../Platforms/helper/AuthHelperType'

const authorizationWindow = (
  authCodeUrl: string | URL,
  platform: keyof typeof platforms,
  onCloseModal: () => void,
  appData: CredentialsType,
  handleConnectCallback: () => void,
  authType: string,
  processGetToken: (
    appData: CredentialsType,
    handleConnectCallback: () => void,
    authType: string
  ) => void
) => {
  const [windowWidth, windowHeight] = [700, 700]
  const windowLeft = Math.round((window.innerWidth - windowWidth) / 2)
  const windowTop = Math.round((window.innerHeight - windowHeight) / 2)

  const authWindow = window.open(
    authCodeUrl,
    platform as string,
    `width=${windowWidth},height=${windowHeight},left=${windowLeft},top=${windowTop},toolbar=off`
  )

  const windowCloseChecker = setInterval(() => {
    localStorage.setItem('__bitSocial_platform_interval', String(windowCloseChecker))

    if (!authWindow?.closed || (authWindow?.closed && !localStorage.getItem(`__bitSocial_platform`)))
      return

    clearInterval(windowCloseChecker)

    onCloseModal?.()
    processGetToken(appData, handleConnectCallback, authType)
  }, 500)
}

export default authorizationWindow
