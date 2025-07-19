import { $accountConnect, $bitSocial, getAtom, setAtom } from '@common/globalStates'
import request from '@common/helpers/request'
import { type AccountConnectDetailsType, type AccountConnectType } from '@pages/Accounts/AccountsType'
import {
  type AuthCodeResponseType,
  type CredentialsType
} from '@pages/Accounts/internals/Platforms/helper/AuthHelperType'
import { notification } from 'antd'

const { baseAuthStateURL } = getAtom($bitSocial)

const getToken = async (
  customAppData: CredentialsType,
  codeVerifier: string,
  authCodeResponse: AuthCodeResponseType
) => {
  const requestData = {
    config: {
      authType: 'OAuth2',
      platform: customAppData.platform
    },
    payload: {
      client_id: customAppData.appId,
      client_secret: customAppData.appSecret,
      code: authCodeResponse.code,
      code_verifier: codeVerifier,
      redirect_uri: customAppData.redirectUri
    }
  }

  const { data, status } = await request<AccountConnectDetailsType[] | { message: string }>(
    'authorize',
    requestData,
    undefined,
    'POST'
  )

  if (status === 'success' && Array.isArray(data)) {
    const twitterConnectState: Partial<AccountConnectType> = {
      details: data,
      isModalOpen: true,
      loading: false,
      platform: 'twitter',
      status
    }

    setAtom($accountConnect, twitterConnectState)
  }

  if (status === 'error' && 'message' in data) {
    const twitterConnectState: Partial<AccountConnectType> = {
      isModalOpen: true,
      loading: false,
      message: data.message,
      platform: 'twitter',
      status
    }

    setAtom($accountConnect, twitterConnectState)
  }
}

const processGetToken = async (
  customAppData: CredentialsType,
  codeVerifier: string,
  handleConnectCallback: () => void
) => {
  let authCodeResponse: AuthCodeResponseType = {}
  const bitSocialAuthLocal = localStorage.getItem('__bitSocial_platform')

  if (bitSocialAuthLocal) {
    authCodeResponse = JSON.parse(bitSocialAuthLocal)
    localStorage.removeItem('__bitSocial_platform')
  }

  if (!authCodeResponse || !authCodeResponse.code || authCodeResponse.error) {
    notification.error({
      description: `${
        authCodeResponse.error ? `Cause: ${authCodeResponse.error}.` : ''
      } Please try again`,
      message: `Authorization failed`
    })
  }

  const getTokenRes = await getToken(customAppData, codeVerifier, authCodeResponse)
  handleConnectCallback()
  return getTokenRes
}

export const customTwitterAppAuthorizationTwo = (
  customAppData: CredentialsType,
  handleConnectCallback: () => void,
  onCloseModal: () => undefined
) => {
  if (!customAppData.platform || !customAppData.appId || !customAppData.redirectUri) {
    throw new Error('Missing credentials')
  }

  const { appId, platform, redirectUri } = customAppData

  const codeChallenge = btoa(`__bit_social: ${Math.floor(Math.random() * Date.now()).toString(36)}`)

  const scope = 'users.read tweet.read tweet.write follows.read follows.write offline.access'

  const authUrl = new URL('https://twitter.com/i/oauth2/authorize')
  authUrl.searchParams.append('scope', scope)
  authUrl.searchParams.append('client_id', appId)
  authUrl.searchParams.append('response_type', 'code')
  authUrl.searchParams.append('redirect_uri', redirectUri)
  authUrl.searchParams.append('code_challenge', codeChallenge)
  authUrl.searchParams.append('code_challenge_method', 'plain')
  authUrl.searchParams.append('state', baseAuthStateURL + '#/accounts/auth/response')

  const [windowWidth, windowHeight] = [700, 550]
  const windowLeft = Math.round((window.innerWidth - windowWidth) / 2)
  const windowTop = Math.round((window.innerHeight - windowHeight) / 2)

  const twitterWindow = window.open(
    authUrl,
    platform as string,
    `width=${windowWidth},height=${windowHeight},left=${windowLeft},top=${windowTop},toolbar=off`
  )

  const windowCloseChecker = setInterval(() => {
    const getAuthCode = localStorage.getItem('__bitSocial_platform')

    if (localStorage.getItem('__bitSocial_platform_interval')) {
      localStorage.removeItem('__bitSocial_platform_interval')
    }

    localStorage.setItem('__bitSocial_platform_interval', String(windowCloseChecker))

    if (!twitterWindow?.closed || (twitterWindow.closed && !getAuthCode)) {
      return
    }
    clearInterval(windowCloseChecker)

    onCloseModal?.()

    processGetToken(customAppData, codeChallenge, handleConnectCallback)
  }, 1000)
}
