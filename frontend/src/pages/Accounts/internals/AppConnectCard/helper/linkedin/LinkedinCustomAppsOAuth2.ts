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

const clientSecretUrl = `${config.CLIENT_SECRET_URL}`
const oneClickRedirectUrl = `${config.REDIRECT_URL}`

const { baseAuthStateURL } = getAtom($bitSocial)

const getToken = async (appData: CredentialsType, authCodeResponse: AuthCodeResponseType) => {
  const requestData = {
    config: {
      authType: 'OAuth2',
      platform: appData.platform
    },
    payload: {
      client_id: appData.appId,
      client_secret: appData.appSecret,
      code: authCodeResponse.code,
      grant_type: 'null',
      redirect_uri: appData.redirectUri
    }
  }

  const { data, status } = await request<AccountConnectDetailsType[]>(
    'authorize',
    requestData,
    undefined,
    'POST'
  )

  const linkedinConnectState: Partial<AccountConnectType> = {
    isModalOpen: true,
    loading: false,
    platform: 'linkedin',
    status
  }

  if (status === 'success') {
    setAtom($accountConnect, { ...linkedinConnectState, details: data })
  }
}

const getSecret = async (appData: CredentialsType) => {
  const requestData = {
    client_id: appData.appId,
    platform: appData.platform
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

const processGetToken = async (
  appData: CredentialsType,
  handleConnectCallback: () => void,
  authType: string
) => {
  let authCodeResponse: AuthCodeResponseType = {}

  const bitSocialAuthLocal = localStorage.getItem(`__bitSocial_platform`)

  const temporaryData = { ...appData }

  if (bitSocialAuthLocal) {
    authCodeResponse = JSON.parse(bitSocialAuthLocal)
    localStorage.removeItem(`__bitSocial_platform`)
  }

  if (!authCodeResponse.code) {
    notification.error({
      description: `${
        authCodeResponse.error ? `Cause: ${authCodeResponse.error}.` : ''
      } Please try again`,
      message: `Authorization failed`
    })
    return
  }

  if (authType === 'oneClickAuth') {
    const clientSecretResponse = await getSecret(appData)

    if (!clientSecretResponse || !clientSecretResponse.clientSecret) {
      notification.error({
        description: `Cause: ${clientSecretResponse.message}. Please try again`,
        message: `Authorization failed`
      })
    }

    temporaryData.appSecret = clientSecretResponse.clientSecret.toString()
    temporaryData.redirectUri = oneClickRedirectUrl
  }

  const getTokenRes = await getToken(temporaryData, authCodeResponse)
  handleConnectCallback()
  return getTokenRes
}

const linkedinAppAuthorization = (
  appData: CredentialsType,
  handleConnectCallback: () => void,
  onCloseModal: () => undefined,
  authType: 'customAuth' | 'oneClickAuth'
) => {
  if (!appData.platform || !appData.appId || !appData.redirectUri) {
    throw new Error('Missing credentials')
  }
  const { appId, platform, redirectUri } = appData

  const finalRedirectUri = authType === 'oneClickAuth' ? oneClickRedirectUrl : redirectUri

  const scope =
    'openid profile email w_member_social r_organization_admin w_organization_social rw_organization_admin'

  const authUrl = new URL('https://www.linkedin.com/oauth/v2/authorization')
  authUrl.searchParams.append('scope', scope)
  authUrl.searchParams.append('client_id', appId)
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

export default linkedinAppAuthorization
