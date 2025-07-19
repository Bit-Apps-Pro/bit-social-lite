import { type AccountType } from '@pages/Accounts/AccountsType'

export interface GroupType {
  accounts: AccountType[]
  id: number
  name: string
}
