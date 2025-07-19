import { $accountConnect, $bitSocial, getAtom, setAtom } from '@common/globalStates'
import request from '@common/helpers/request'
import { type AccountConnectDetailsType, type AccountConnectType } from '@pages/Accounts/AccountsType'
import {
  type AuthCodeResponseType,
  type CredentialsType
} from '@pages/Accounts/internals/Platforms/helper/AuthHelperType'
import { notification } from 'antd'

const { baseAuthStateURL } = getAtom($bitSocial)

interface ResponseType {
  message: string
  response: {
    oauth_callback_confirmed: string
    oauth_token: string
    oauth_token_secret: string
  }
  status: string
}

const getRequestToken = async (customAppData: CredentialsType) => {
  const requestData = {
    config: {
      authType: 'OAuth1',
      platform: customAppData.platform
    },
    payload: {
      client_id: customAppData.appId,
      client_secret: customAppData.appSecret,
      redirect_uri: customAppData.redirectUri
    }
  }
  return request<ResponseType>('pro_twitter-request-token', requestData, undefined, 'POST')
}

const getToken = async (
  customAppData: CredentialsType,
  authCodeResponse: AuthCodeResponseType,
  oauthToken: string,
  oauthTokenSecret: string,
  oauthCallbackConfirmed: string
) => {
  const requestData = {
    config: {
      authType: 'OAuth1',
      platform: customAppData.platform
    },
    payload: {
      client_id: customAppData.appId,
      client_secret: customAppData.appSecret,
      oauth_callback_confirmed: oauthCallbackConfirmed,
      oauth_secret: oauthTokenSecret,
      oauth_token: oauthToken,
      oauth_verifier: authCodeResponse.oauth_verifier,
      redirect_uri: customAppData.redirectUri
    }
  }

  const { data, status } = await request<AccountConnectDetailsType[]>(
    'authorize',
    requestData,
    undefined,
    'POST'
  )

  if (status === 'success') {
    const twitterConnectState: Partial<AccountConnectType> = {
      details: data,
      isModalOpen: true,
      loading: false,
      platform: 'twitter',
      status
    }

    setAtom($accountConnect, twitterConnectState)
  }
}

const processGetToken = async (
  customAppData: CredentialsType,
  handleConnectCallback: () => void,
  oauthToken: string,
  oauthTokenSecret: string,
  oauthCallbackConfirmed: string
) => {
  let authCodeResponse: AuthCodeResponseType = {}
  const bitSocialAuthLocal = localStorage.getItem('__bitSocial_platform')

  if (bitSocialAuthLocal) {
    authCodeResponse = JSON.parse(bitSocialAuthLocal)
    localStorage.removeItem('__bitSocial_platform')
  }

  if (!authCodeResponse || !authCodeResponse.oauth_verifier || authCodeResponse.error) {
    notification.error({
      description: `${
        authCodeResponse.error ? `Cause: ${authCodeResponse.error}.` : ''
      } Please try again`,
      message: `Authorization failed`
    })
  }

  const getTokenRes = await getToken(
    customAppData,
    authCodeResponse,
    oauthToken,
    oauthTokenSecret,
    oauthCallbackConfirmed
  )
  handleConnectCallback()
  return getTokenRes
}

export const customTwitterAppAuthorizationOne = async (
  customAppData: CredentialsType,
  handleConnectCallback: () => void,
  onCloseModal: () => undefined
) => {
  if (!customAppData.platform || !customAppData.appId || !customAppData.redirectUri) {
    throw new Error('Missing credentials')
  }

  // get request token response
  const requestTokenResponse = await getRequestToken(customAppData)

  if (requestTokenResponse.status === 'error') {
    notification.error({
      message: requestTokenResponse.data.message
    })
  } else if (requestTokenResponse?.data?.status === 'error') {
    notification.error({
      message: requestTokenResponse.data.message
    })
  }

  const {
    oauth_callback_confirmed: oauthCallbackConfirmed,
    oauth_token: oauthToken,
    oauth_token_secret: oauthTokenSecret
  } = requestTokenResponse.data.response

  const { platform } = customAppData

  const authUrl = new URL('https://api.twitter.com/oauth/authorize')
  authUrl.searchParams.append('oauth_token', oauthToken)
  authUrl.searchParams.append('state', baseAuthStateURL + '#/accounts/auth/response')

  const [windowWidth, windowHeight] = [700, 550]
  const windowLeft = Math.round((window.innerWidth - windowWidth) / 2)
  const windowTop = Math.round((window.innerHeight - windowHeight) / 2)

  const twitterWindow = window.open(
    authUrl,
    platform,
    `width=${windowWidth},height=${windowHeight},left=${windowLeft},top=${windowTop},toolbar=off`
  )

  const windowCloseChecker = setInterval(() => {
    if (!twitterWindow?.closed) return

    clearInterval(windowCloseChecker)

    onCloseModal?.()
    processGetToken(
      customAppData,
      handleConnectCallback,
      oauthToken,
      oauthTokenSecret,
      oauthCallbackConfirmed
    )
  }, 1000)
}
