import request from '@common/helpers/request'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { type RetryDataType } from '../LogsType'

export default function useRetry() {
  const queryClient = useQueryClient()

  const {
    data: result,
    isPending,
    mutateAsync
  } = useMutation({
    mutationFn: async (data: RetryDataType) => request('retry', { ...data }, undefined, 'POST'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs'] })
    }
  })

  return {
    isRetryLoading: isPending,
    result,
    retry: (data: RetryDataType) => mutateAsync(data)
  }
}
