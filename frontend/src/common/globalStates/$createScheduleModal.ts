import { atom } from 'jotai'

import { type ScheduleModalType } from './GlobalStates'

export const $createScheduleModal = atom<ScheduleModalType>({
  open: false,
  type: 'create'
})
