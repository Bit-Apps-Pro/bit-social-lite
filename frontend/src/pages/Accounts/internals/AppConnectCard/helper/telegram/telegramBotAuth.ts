import { $accountConnect, setAtom } from '@common/globalStates'
import request from '@common/helpers/request'
import { type AccountConnectDetailsType, type AccountConnectType } from '@pages/Accounts/AccountsType'

export const telegramBotAuthorization = async (
  credential: { token: string },
  handleConnectCallback: () => void,
  onCloseModal: () => undefined
) => {
  const { token } = credential

  const accountConnectState = {
    isModalOpen: true,
    loading: true
  }

  setAtom($accountConnect, accountConnectState)

  handleConnectCallback()
  onCloseModal()

  const requestData = {
    config: {
      authType: 'Token',
      platform: 'telegram'
    },
    payload: {
      token
    }
  }

  const { data, status } = await request<AccountConnectDetailsType[]>(
    'authorize',
    requestData,
    undefined,
    'POST'
  )

  const telegramConnectState: Partial<AccountConnectType> = {
    isModalOpen: true,
    loading: false,
    platform: 'telegram',
    status
  }
  if (status === 'success') {
    setAtom($accountConnect, { ...telegramConnectState, details: data })
  }

  if (status === 'error' && 'message' in data && typeof data.message === 'string') {
    setAtom($accountConnect, { ...telegramConnectState, message: data.message })
  }
}
