import request from '@common/helpers/request'
import { useQuery } from '@tanstack/react-query'

export default function useGroupById(id: number) {
  const { data, isLoading, refetch } = useQuery({
    queryFn: async () => request<number[]>(`pro_groups/${id}`, undefined, undefined, 'GET'),
    queryKey: ['groups', id]
  })

  return {
    groupAccountIds: data?.data || [],
    isLoadingIds: isLoading,
    refetchIds: refetch
  }
}
