import request from '@common/helpers/request'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export default function useDeleteLogs(pageLimit: number, pageNumber: number) {
  const queryClient = useQueryClient()

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (logIds: string[]) => request('logs/destroy/batch', { logIds }, undefined, 'POST'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs', [pageNumber, pageLimit]] })
    }
  })

  return {
    deleteLogs: (logIds: string[]) => mutateAsync(logIds),
    isLogsDeleting: isPending
  }
}
