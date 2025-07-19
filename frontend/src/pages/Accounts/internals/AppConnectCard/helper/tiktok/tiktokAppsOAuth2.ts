import { $accountConnect, $bitSocial, getAtom, setAtom } from '@common/globalStates'
import request from '@common/helpers/request'
import config from '@config/config'
import { type AccountConnectDetailsType, type AccountConnectType } from '@pages/Accounts/AccountsType'
import {
  type AuthCodeResponseType,
  type CredentialsType
} from '@pages/Accounts/internals/Platforms/helper/AuthHelperType'
import { notification } from 'antd'

import authorizationWindow from '../authorizationWindow'
import { decodeIfEncoded } from '../googleBusinessProfile/googleBusinessProfileOAuth2'

const clientSecretUrl = `${config.CLIENT_SECRET_URL}`

const { baseAuthStateURL } = getAtom($bitSocial)

const getSecret = async (tiktokCredentialData: CredentialsType) => {
  const requestData = {
    client_id: tiktokCredentialData.appId,
    platform: 'tiktok'
  }
  const options = {
    body: JSON.stringify(requestData),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  }

  return fetch(clientSecretUrl, options).then(res => res.json())
}

const getToken = async (
  appDataCredentials: CredentialsType,
  authCodeResponse: AuthCodeResponseType,
  authType: string
) => {
  const appData = { ...appDataCredentials }
  if (authType === 'oneClickAuth') {
    const data = await getSecret(appData)

    appData.appSecret = data.clientSecret
  }

  const requestData = {
    config: {
      authType: 'OAuth2',
      platform: appData.platform
    },
    payload: {
      client_id: appData.appId,
      client_secret: appData.appSecret,
      code: decodeIfEncoded(authCodeResponse.code),
      grant_type: 'no need',
      redirect_uri: appData.redirectUri
    }
  }

  const { data, status } = await request<AccountConnectDetailsType[]>(
    'authorize',
    requestData,
    undefined,
    'POST'
  )

  const tiktokConnectState: Partial<AccountConnectType> = {
    details: data,
    isModalOpen: true,
    loading: false,
    platform: 'tiktok',
    status
  }

  if (status === 'success') {
    setAtom($accountConnect, { ...tiktokConnectState, details: data })
  }

  if (status === 'error' && 'message' in data && typeof data.message === 'string') {
    setAtom($accountConnect, { ...tiktokConnectState, message: data.message })
  }
}

const processGetToken = async (
  appData: CredentialsType,
  handleConnectCallback: () => void,
  authType: string
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

  const getTokenRes = await getToken(appData, authCodeResponse, authType)
  handleConnectCallback()
  return getTokenRes
}

const tiktokAppAuthorization = (
  appData: CredentialsType,
  handleConnectCallback: () => void,
  onCloseModal: () => undefined,
  authType: 'customAuth' | 'oneClickAuth'
) => {
  if (!appData.platform || !appData.appId || !appData.redirectUri) {
    throw new Error('Missing credentials')
  }

  const { appId, platform, redirectUri } = appData

  const finalRedirectUri = authType === 'oneClickAuth' ? config.REDIRECT_URL : redirectUri

  const scope = 'user.info.basic,user.info.profile,video.upload,video.publish,video.list'

  const authUrl = new URL('https://www.tiktok.com/v2/auth/authorize')
  authUrl.searchParams.append('client_key', appId)
  authUrl.searchParams.append('scope', scope)
  authUrl.searchParams.append('response_type', 'code')
  authUrl.searchParams.append('redirect_uri', finalRedirectUri)
  authUrl.searchParams.append('state', baseAuthStateURL + '#/accounts/auth/response')

  authorizationWindow(
    authUrl,
    platform,
    onCloseModal,
    appData,
    handleConnectCallback,
    authType,
    processGetToken
  )
}

export default tiktokAppAuthorization
