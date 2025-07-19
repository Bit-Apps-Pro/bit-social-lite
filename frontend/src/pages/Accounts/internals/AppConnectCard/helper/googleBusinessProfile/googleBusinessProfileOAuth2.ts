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

export function decodeIfEncoded(encodedString: string) {
  try {
    const decodedString = decodeURIComponent(encodedString)
    // Check if the decoded string is different from the original
    if (decodedString !== encodedString) {
      return decodedString // Return decoded string if different
    }
    return encodedString // Return original string if not encoded
  } catch {
    // If decoding fails, return the original string
    return encodedString
  }
}

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
      code: decodeIfEncoded(authCodeResponse.code),
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

  if (status === 'success') {
    const googleBusinessProfileConnectState: Partial<AccountConnectType> = {
      details: data,
      isModalOpen: true,
      loading: false,
      platform: 'googleBusinessProfile',
      status
    }

    setAtom($accountConnect, googleBusinessProfileConnectState)
  }
}

const processGetToken = async (appData: CredentialsType, handleConnectCallback: () => void) => {
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

  const getTokenRes = await getToken(temporaryData, authCodeResponse)
  handleConnectCallback()
  return getTokenRes
}

const googleBusinessProfileOAuth2 = (
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

  const scope = 'https://www.googleapis.com/auth/business.manage'

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  authUrl.searchParams.append('scope', scope)
  authUrl.searchParams.append('client_id', appId)
  authUrl.searchParams.append('prompt', 'consent')
  authUrl.searchParams.append('response_type', 'code')
  authUrl.searchParams.append('access_type', 'offline')
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
export default googleBusinessProfileOAuth2
