import request from '@common/helpers/request'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export default function useDeleteGroup() {
  const queryClient = useQueryClient()

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (groupId: number) =>
      request<number>(`groups/${groupId}/destroy`, undefined, undefined, 'POST'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group'] })
    }
  })

  return {
    deleteGroup: (groupId: number) => mutateAsync(groupId),
    isLoadingDeleteGroup: isPending
  }
}
