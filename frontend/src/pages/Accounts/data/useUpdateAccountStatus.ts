import request from '@common/helpers/request'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export default function useUpdateAccountStatus() {
  const queryClient = useQueryClient()
  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (statusData: { id: number; status: number }) =>
      request(
        `account/${statusData.id}/update-status`,
        { status: statusData.status },
        undefined,
        'POST'
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    }
  })

  return {
    updateAccountStatus: (statusData: { id: number; status: number }) => mutateAsync(statusData),
    updateAccountStatusLoading: isPending
  }
}
