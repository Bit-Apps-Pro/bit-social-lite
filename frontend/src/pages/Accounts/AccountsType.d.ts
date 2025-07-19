import type platforms from '@config/platforms'

export interface AppConnectCardType {
  clientId?: string
  closeConnectModal: () => undefined
  isConnectLoading?: boolean
  name?: string
  platform: keyof typeof platforms
  setAccountModal: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedMenuTab?: React.Dispatch<React.SetStateAction<{ type: string; value: string }>>
  status?: number
  types: ConnectType[]
}
export type ConnectType = 'custom' | 'login' | 'oneClick'

export interface AccountType {
  account_name: string
  account_type: string
  details: {
    account_id: string
    account_name: string
    account_type: string
    icon: string
    user_name: string
  }
  id: number
  platform: keyof typeof platforms
  status: number
}

export interface AccountOptionType {
  label: keyof typeof platforms
  options: {
    label: {
      accountType: string
      icon: string
      name: string
      platform: keyof typeof platforms
    }
    value: number
  }[]
}

export interface AccountDataType {
  account_id: string
  account_name: string
  account_type: number
  details: string
  platform: keyof typeof platforms
  profile_id: string
  status: number
}
export interface AccountTabType {
  type: string
  value: string
}

export interface AccountDetailsType {
  accountDetails: AccountDataType
  accountIcon: string
  accountId: string
  accountName: string
  isConnected: boolean
  verifyUrl?: string
}

export interface AccountConnectDetailsType {
  account: AccountDataType
  isConnected: boolean
  verifyUrl?: string
}

export interface AccountConnectType {
  details: AccountConnectDetailsType[]
  isModalOpen: boolean
  loading: boolean
  message: string
  platform: keyof typeof platforms
  status: 'error' | 'success'
}

export interface CustomCredentialType {
  appKey: string
  appSecret: string
  platform: keyof typeof platforms
  redirectUri: string
}

export interface CustomAppType {
  credential: CredentialType
  id: number
  name: string
  platform: keyof typeof platforms
}
interface CredentialType {
  apiVersion?: null | string
  appKey: string
  appSecret: string
  icon_url: string
  redirectUri: string
}
