import request from '@common/helpers/request'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export default function useDeleteAccount() {
  const queryClient = useQueryClient()
  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (account: number) =>
      request(`account/${account}/destroy`, undefined, undefined, 'POST'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['ai-platform-accounts'] })
    }
  })

  return {
    deleteAccount: mutateAsync,
    deleteAccountLoading: isPending
  }
}
