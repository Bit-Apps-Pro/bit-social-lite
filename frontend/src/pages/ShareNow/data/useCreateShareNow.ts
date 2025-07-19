import request from '@common/helpers/request'
import { QueryClient, useMutation } from '@tanstack/react-query'

import { type ShareNowType } from '../ShareNowType'

type CreateShareNowType = ShareNowType & {
  isDraft?: boolean
}

export default function useCreateShareNow() {
  const queryClient = new QueryClient()
  const { isPending, isSuccess, mutateAsync } = useMutation({
    mutationFn: async (shareNowData: CreateShareNowType) =>
      request<string>('share-now', { ...shareNowData }, undefined, 'POST'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-schedules'] })
      queryClient.invalidateQueries({ queryKey: ['get-calendar-schedules'] })
      queryClient.invalidateQueries({ queryKey: ['share-now'] })
    }
  })

  return {
    createShareNow: mutateAsync,
    isCreateShareNowLoading: isPending,
    isShareNowSuccess: isSuccess
  }
}
