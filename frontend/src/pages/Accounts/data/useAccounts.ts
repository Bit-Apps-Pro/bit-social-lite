import { $accountConnect, getAtom } from '@common/globalStates'
import request from '@common/helpers/request'
import { type AccountTabType, type AccountType } from '@pages/Accounts/AccountsType'
import { type UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

export default function useAccounts({
  searchAccountsTxt = '',
  selectedMenuTab = {} as AccountTabType
} = {}) {
  const { isModalOpen } = getAtom($accountConnect)

  const qParams = []
  if (searchAccountsTxt) qParams.push(searchAccountsTxt)
  if (selectedMenuTab.type) qParams.push(selectedMenuTab)

  const { data, isFetching, isLoading, refetch }: UseQueryResult<{ data: AccountType[] }, Error> =
    useQuery({
      queryFn: async () =>
        request(`accounts`, undefined, { search: searchAccountsTxt, ...selectedMenuTab }, 'GET'),
      queryKey: ['accounts', ...qParams],
      refetchInterval: isModalOpen ? 2000 : false
    })

  return {
    accounts: data?.data || [],
    isFetchingAccounts: isFetching,
    isLoadingAccounts: isLoading,
    refetchAccounts: refetch
  }
}
