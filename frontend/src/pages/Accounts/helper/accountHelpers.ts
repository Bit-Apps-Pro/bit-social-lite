import { type AccountOptionType, type AccountType } from '@pages/Accounts/AccountsType'

export default function getAccountOptions(accounts: AccountType[]) {
  return accounts.reduce<AccountOptionType[]>((accumulator, account) => {
    const { platform } = account
    const platformOption = accumulator.find(option => option.label === platform)

    if (platformOption) {
      platformOption.options.push({
        label: {
          accountType: account.details.account_type,
          icon: account.details.icon,
          name: account.details.account_name,
          platform: account.platform
        },
        value: account.id
      })
    } else {
      accumulator.push({
        label: platform,
        options: [
          {
            label: {
              accountType: account.details.account_type,
              icon: account.details.icon,
              name: account.details.account_name,
              platform: account.platform
            },
            value: account.id
          }
        ]
      })
    }

    return accumulator
  }, [])
}
