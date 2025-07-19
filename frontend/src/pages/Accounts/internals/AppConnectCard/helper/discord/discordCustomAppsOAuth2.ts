import { $accountConnect, $bitSocial, getAtom, setAtom } from '@common/globalStates'
import request from '@common/helpers/request'
import config from '@config/config'
import { type AccountConnectDetailsType, type AccountConnectType } from '@pages/Accounts/AccountsType'
import authorizationWindow from '@pages/Accounts/internals/AppConnectCard/helper/authorizationWindow'
import {
  type AuthCodeResponseType,
  type CredentialsType
} from '@pages/Accounts/internals/Platforms/helper/AuthHelperType'
import { notification } from 'antd'

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
      guild_id: authCodeResponse.guild_id,
      redirect_uri: appData.redirectUri
    }
  }

  const { data, status } = await request<AccountConnectDetailsType[]>(
    'authorize',
    requestData,
    undefined,
    'POST'
  )

  if (status === 'success') {
    const discordConnectState: Partial<AccountConnectType> = {
      details: data,
      isModalOpen: true,
      loading: false,
      platform: 'discord',
      status
    }

    setAtom($accountConnect, discordConnectState)
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

  if (!authCodeResponse || !authCodeResponse.code || authCodeResponse.error) {
    notification.error({
      description: `${
        authCodeResponse.error ? `Cause: ${authCodeResponse.error}.` : ''
      } Please try again`,
      message: `Authorization failed`
    })
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

const discordAppAuthorization = (
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

  const scope = 'bot identify'

  const authUrl = new URL('https://discord.com/api/oauth2/authorize')
  authUrl.searchParams.append('scope', scope)
  authUrl.searchParams.append('prompt', 'none')
  authUrl.searchParams.append('client_id', appId)
  authUrl.searchParams.append('response_type', 'code')
  authUrl.searchParams.append('permissions', '51200')
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

export default discordAppAuthorization
