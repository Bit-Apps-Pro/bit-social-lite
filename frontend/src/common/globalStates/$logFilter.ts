import { atom } from 'jotai'

export const defaultFilter = {
  date: 'all',
  platform: 'all',
  schedule: 'all',
  scheduleId: 'all',
  status: 'all'
}

const $logFilter = atom<Record<string, string>>(defaultFilter)

export default $logFilter
