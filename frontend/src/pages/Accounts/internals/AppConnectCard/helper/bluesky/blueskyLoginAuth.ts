import { $accountConnect, setAtom } from '@common/globalStates'
import request from '@common/helpers/request'
import { type AccountConnectDetailsType, type AccountConnectType } from '@pages/Accounts/AccountsType'

import { type LoginCredentialType } from '../../ui/LoginConnection'

export const blueskyLoginAuthorization = async (
  credential: LoginCredentialType,
  handleConnectCallback: () => void,
  onCloseModal: () => undefined
) => {
  const { id, password } = credential

  const accountConnectState = {
    isModalOpen: true,
    loading: true
  }

  setAtom($accountConnect, accountConnectState)

  handleConnectCallback()
  onCloseModal()

  const requestData = {
    config: {
      authType: 'Login',
      platform: 'bluesky'
    },
    payload: {
      id,
      password
    }
  }

  const { data, status } = await request<AccountConnectDetailsType[]>(
    'authorize',
    requestData,
    undefined,
    'POST'
  )

  const blueskyConnectState: Partial<AccountConnectType> = {
    isModalOpen: true,
    loading: false,
    platform: 'bluesky',
    status
  }
  if (status === 'success') {
    setAtom($accountConnect, { ...blueskyConnectState, details: data })
  }

  if (status === 'error' && 'message' in data && typeof data.message === 'string') {
    setAtom($accountConnect, { ...blueskyConnectState, message: data.message })
  }
}
