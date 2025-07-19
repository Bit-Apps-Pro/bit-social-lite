import request from '@common/helpers/request'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export default function useRemoveAccountFromGroup() {
  const queryClient = useQueryClient()

  const { isPending, isSuccess, mutateAsync } = useMutation({
    mutationFn: async ({ accountId, groupId }: { accountId: number; groupId: number }) =>
      request<number>(`pro_group-account/${groupId}/${accountId}/destroy`, undefined, undefined, 'POST'),
    mutationKey: ['delete_group'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    }
  })

  return {
    isGroupAccountRemoved: isSuccess,
    isLoadingGroupAccount: isPending,
    removeAccount: mutateAsync
  }
}
