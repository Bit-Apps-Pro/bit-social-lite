import { $accountConnect, getAtom } from '@common/globalStates'
import request from '@common/helpers/request'
import { type AccountTabType, type AccountType } from '@pages/Accounts/AccountsType'
import { useQuery } from '@tanstack/react-query'

const EMPTY_ACCOUNTS: AccountType[] = []

export default function useAccounts({
  searchAccountsTxt = '',
  selectedMenuTab = {} as AccountTabType
} = {}) {
  const { isModalOpen } = getAtom($accountConnect)

  const qParams = []
  if (searchAccountsTxt) qParams.push(searchAccountsTxt)
  if (selectedMenuTab.type) qParams.push(selectedMenuTab)

  const { data, isFetching, isLoading, refetch } = useQuery({
    queryFn: async () =>
      request<AccountType[]>(
        `accounts`,
        undefined,
        { search: searchAccountsTxt, ...selectedMenuTab },
        'GET'
      ),
    queryKey: ['accounts', ...qParams],
    refetchInterval: isModalOpen ? 2000 : false
  })

  return {
    accounts: data?.data || EMPTY_ACCOUNTS,
    isFetchingAccounts: isFetching,
    isLoadingAccounts: isLoading,
    refetchAccounts: refetch
  }
}
