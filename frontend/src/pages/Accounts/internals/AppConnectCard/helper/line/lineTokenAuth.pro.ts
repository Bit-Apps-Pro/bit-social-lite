import { $accountConnect, setAtom } from '@common/globalStates'
import request from '@common/helpers/request'
import { type AccountConnectDetailsType, type AccountConnectType } from '@pages/Accounts/AccountsType'

export const lineTokenAuthorization = async (
  credential: Record<string, string>,
  handleConnectCallback: () => void,
  onCloseModal: () => undefined
) => {
  const { id, token, type } = credential

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
      platform: 'line'
    },
    payload: {
      id,
      token,
      type
    }
  }

  const { data, status } = await request<AccountConnectDetailsType[]>(
    'authorize',
    requestData,
    undefined,
    'POST'
  )

  const lineConnectState: Partial<AccountConnectType> = {
    isModalOpen: true,
    loading: false,
    platform: 'line',
    status
  }
  if (status === 'success') {
    setAtom($accountConnect, { ...lineConnectState, details: data })
  }

  if (status === 'error' && 'message' in data && typeof data.message === 'string') {
    setAtom($accountConnect, { ...lineConnectState, message: data.message })
  }
}
