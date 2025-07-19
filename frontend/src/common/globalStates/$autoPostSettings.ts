import { atomWithImmer } from 'jotai-immer'

export interface AccountsType {
  accountIds: number[]
  groupIds: number[]
}

export interface AutoPostSettings {
  accounts: AccountsType
  isEnabled: boolean
  keepLogs: boolean
  postDelay: {
    every: number
    unit: string
  }
  postType: string[]
  taxonomies: string[]
}

const defaultTemplates: AutoPostSettings = {
  accounts: {
    accountIds: [],
    groupIds: []
  },
  isEnabled: false,
  keepLogs: true,
  postDelay: {
    every: 0,
    unit: ''
  },
  postType: ['post'],
  taxonomies: ['categories', 'tags']
}

const $autoPostSettings = atomWithImmer<AutoPostSettings>(defaultTemplates)

export default $autoPostSettings
