import request from '@common/helpers/request'
import { type GroupType } from '@pages/Accounts/shared/Group/GroupType'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export default function useCreateGroup() {
  const queryClient = useQueryClient()

  const { isPending, isSuccess, mutateAsync } = useMutation({
    mutationFn: async (name: string) => request<GroupType>('pro_groups', { name }, undefined, 'POST'),
    mutationKey: ['create_group'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    }
  })

  return {
    createGroup: mutateAsync,
    isGroupCreated: isSuccess,
    isLoadingCreateGroup: isPending
  }
}
