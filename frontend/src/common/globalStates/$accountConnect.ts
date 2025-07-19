import { type AccountConnectType } from '@pages/Accounts/AccountsType'
import { atomWithStorage } from 'jotai/utils'

export const accountConnectState: Partial<AccountConnectType> = {
  details: [],
  isModalOpen: false,
  loading: false
}

const $accountConnect = atomWithStorage<Partial<AccountConnectType>>(
  'bit-account-connect',
  accountConnectState
)

export default $accountConnect
