import { getDefaultStore } from 'jotai'

const store = getDefaultStore()
const getAtom = store.get
const setAtom = store.set

export { getAtom, setAtom }

export { default as $accountConnect } from '@common/globalStates/$accountConnect'
export { default as $appConfig } from '@common/globalStates/$appConfig'
export { default as $bitSocial } from '@common/globalStates/$bitSocial'
