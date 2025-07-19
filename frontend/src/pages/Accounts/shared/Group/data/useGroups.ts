import request from '@common/helpers/request'
import { useQuery } from '@tanstack/react-query'

import { type GroupType } from '../GroupType'

export default function useGroups() {
  const { data, isLoading, refetch } = useQuery({
    queryFn: async () => request<GroupType[]>(`pro_groups`, undefined, undefined, 'GET'),
    queryKey: ['groups']
  })

  return {
    groups: data?.data || [],
    isLoadingGroups: isLoading,
    refetchGroups: refetch
  }
}
