import { getColorPreference } from '@common/helpers/globalHelpers'
import config from '@config/config'
import { atomWithStorage } from 'jotai/utils'
import { type SyncStorage } from 'jotai/vanilla/utils/atomWithStorage'

interface AppConfigType {
  isDarkTheme: boolean
  isProClient: boolean
  isSidebarCollapsed: boolean
  isWpMenuCollapsed: boolean
}

const $appConfig = atomWithStorage(
  `${config.PLUGIN_SLUG}-config`,
  {
    isDarkTheme: getColorPreference(),
    isProClient: config.IS_PRO,
    isSidebarCollapsed: false,
    isWpMenuCollapsed: false
  },
  {
    getItem: (key: string) => {
      const value = localStorage.getItem(key)
      const savedValue = value ? JSON.parse(value) : undefined
      return {
        ...(savedValue as Partial<AppConfigType>),
        isProClient: config.IS_PRO
      }
    },
    removeItem: (key: string) => {
      localStorage.removeItem(key)
    },
    setItem: (key: string, newValue: Partial<AppConfigType>) => {
      localStorage.setItem(key, JSON.stringify(newValue))
    }
  } as SyncStorage<AppConfigType>
)

export default $appConfig
