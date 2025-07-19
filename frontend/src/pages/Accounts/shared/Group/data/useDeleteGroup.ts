import request from '@common/helpers/request'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export default function useDeleteGroup() {
  const queryClient = useQueryClient()

  const { isPending, isSuccess, mutateAsync } = useMutation({
    mutationFn: async (groupId: number) =>
      request<number>(`pro_groups/${groupId}/destroy`, undefined, undefined, 'POST'),
    mutationKey: ['delete_group'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    }
  })

  return {
    deleteGroup: mutateAsync,
    isGroupDeleted: isSuccess,
    isLoadingDeleteGroup: isPending
  }
}
