import request from '@common/helpers/request'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export default function useDeleteShareNow(pageLimit: number, pageNumber: number) {
  const queryClient = useQueryClient()

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (shareNowIds: number[]) =>
      request('share-now/destroy/batch', { shareNowIds }, undefined, 'POST'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['share-now', [pageNumber, pageLimit]] })
    }
  })

  return {
    deleteShareNow: (shareNowIds: number[]) => mutateAsync(shareNowIds),
    isShareNowDeleting: isPending
  }
}
