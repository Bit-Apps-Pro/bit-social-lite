import { atom } from 'jotai'

const $scheduleErrors = atom<Record<string, string>>({})

export default $scheduleErrors
