import request from '@common/helpers/request'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { type CustomCredentialType } from '../AccountsType'

interface CreateResponseType {
  data: null
  errorField: Record<string, string[]>
  message: string
}
export default function useCreateCustomApp() {
  const queryClient = useQueryClient()
  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (values: CustomCredentialType) =>
      request<CreateResponseType>('custom-app', { ...values }, undefined, 'POST'),
    mutationKey: ['custom_app'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-customApp'] })
    }
  })

  return {
    createCustomApp: (values: CustomCredentialType) => mutateAsync(values),
    isLoadingCreateCustomApp: isPending
  }
}
