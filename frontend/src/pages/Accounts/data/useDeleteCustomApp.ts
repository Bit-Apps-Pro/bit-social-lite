import request from '@common/helpers/request'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export default function useDeleteCustomApp() {
  const queryClient = useQueryClient()
  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (id: number) => request(`custom-app/${id}/destroy`, undefined, undefined, 'POST'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-customApp'] })
    }
  })

  return {
    deleteCustomApp: (id: number) => mutateAsync(id),
    isLoadingDeleteCustomApp: isPending
  }
}
