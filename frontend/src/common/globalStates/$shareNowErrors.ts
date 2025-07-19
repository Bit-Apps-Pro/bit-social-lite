import { type ErrorsType } from '@pages/ShareNow/ShareNowType'
import { atom } from 'jotai'

const $shareNowErrors = atom<ErrorsType>({})

export default $shareNowErrors
