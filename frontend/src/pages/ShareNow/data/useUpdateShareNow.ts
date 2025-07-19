import request from '@common/helpers/request'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { type ShareNowType } from '../ShareNowType'

type UpdateShareNowType = ShareNowType & {
  isDraft?: boolean
}

export default function useUpdateShareNow() {
  const queryClient = useQueryClient()

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (shareNowData: UpdateShareNowType) =>
      request<string>(`share-now/${shareNowData.id}/update`, { ...shareNowData }, undefined, 'POST'),
    onSuccess: () => {
      // TODO: replace page and limit from url params
      queryClient.invalidateQueries({ queryKey: ['share-now', [1, 10]] })
    }
  })

  return {
    isUpdateShareNowLoading: isPending,
    updateShareNow: mutateAsync
  }
}
