import { type AccountType } from '@pages/Accounts/AccountsType'

import { type ErrorsType } from '../ShareNowType'

export const getPlatforms = (accountList: AccountType[], accountIds: number[] = []) => {
  const platformsList = accountList
    .filter(account => accountIds.includes(account.id))
    .map(account => account.platform)
  const platforms = [...new Set(platformsList)]

  return platforms
}

export const checkError = (errors: ErrorsType) => {
  for (const platform in errors) {
    // eslint-disable-next-line no-prototype-builtins
    if (errors.hasOwnProperty(platform)) {
      const platformSettings = errors[platform]
      if (platformSettings.text || platformSettings.media.length) {
        return true
      }
    }
  }
  return false
}
