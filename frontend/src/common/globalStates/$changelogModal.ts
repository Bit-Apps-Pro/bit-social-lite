import { getAtom } from '@common/globalStates'
import { atom } from 'jotai'

import $bitSocial from './$bitSocial'

const { changelogVersion, version } = getAtom($bitSocial)
const $changelogModal = atom(version !== changelogVersion)

export default $changelogModal
