import request from '@common/helpers/request'
import { useQuery } from '@tanstack/react-query'

interface ClientIdType {
  clientInfo: Record<
    string,
    {
      id: string
      status: number
    }
  >
}
export default function useClientIds() {
  const { data, isFetching, isLoading, refetch } = useQuery({
    queryFn: async () => request<ClientIdType>('platforms-credentials', undefined, undefined, 'POST'),
    queryKey: ['clientIds']
  })
  const { clientInfo } = data?.data || {}

  return {
    clientIds: clientInfo,
    isFetchingClientIds: isFetching,
    isLoadingClientIds: isLoading,
    refetchClientIds: refetch
  }
}
