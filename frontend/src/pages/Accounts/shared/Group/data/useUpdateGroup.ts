import request from '@common/helpers/request'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface GroupDataType {
  accountIds: number[]
  name: string
}

export default function useUpdateGroup() {
  const queryClient = useQueryClient()
  const { isPending, mutateAsync } = useMutation({
    mutationFn: async ({ groupData, groupId }: { groupData: Partial<GroupDataType>; groupId: number }) =>
      request<string>(`pro_groups/${groupId}/update`, { ...groupData }, undefined, 'POST'),
    mutationKey: ['update_group'],

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    }
  })

  return {
    isLoadingUpdateGroup: isPending,
    updateGroup: mutateAsync
  }
}
