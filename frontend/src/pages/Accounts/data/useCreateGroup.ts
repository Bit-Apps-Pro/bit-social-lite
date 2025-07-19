import request from '@common/helpers/request'
import { useMutation } from '@tanstack/react-query'

import { type GroupType } from '../shared/Group/GroupType'

export default function useCreateGroup() {
  const { isPending, isSuccess, mutateAsync } = useMutation({
    mutationFn: async (groupData: GroupType) =>
      request<string>('groups', { ...groupData }, undefined, 'POST'),
    mutationKey: ['create_group']
  })

  return {
    createGroup: (groupData: GroupType) => mutateAsync(groupData),
    isGroupCreated: isSuccess,
    isLoadingCreateGroup: isPending
  }
}
