import request from '@common/helpers/request'
import { useQuery } from '@tanstack/react-query'

import { type AccountType } from '../AccountsType'

export default function useActiveAccounts() {
  const { data, isLoading, refetch } = useQuery({
    queryFn: async () => request<AccountType[]>('active-accounts', undefined, undefined, 'GET'),
    queryKey: ['active-accounts']
  })

  return {
    activeAccounts: data?.data || [],
    isLoadingActiveAccounts: isLoading,
    refetchActiveAccounts: refetch
  }
}
