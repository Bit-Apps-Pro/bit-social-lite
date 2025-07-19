import request from '@common/helpers/request'
import { useMutation } from '@tanstack/react-query'

export default function usePlatform() {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (accounts: { ids: number[] }) =>
      request<string[]>('account-platform', { ...accounts }, undefined, 'POST'),
    mutationKey: ['platform']
  })

  return { getPlatform: (keys: { ids: number[] }) => mutateAsync(keys), isPlatformLoading: isPending }
}
