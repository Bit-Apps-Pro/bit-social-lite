import request from '@common/helpers/request'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { type AllSettingsType } from './useSettings'

export interface ErrorType {
  errors: Record<string, string>
}

export type ResponseType = AllSettingsType['settings'] | ErrorType

export default function useUpdateSettings() {
  const queryClient = useQueryClient()

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (settings: AllSettingsType['settings']) =>
      request<ResponseType>('settings/update', { settings }, undefined, 'POST'),

    onSuccess: response => {
      if ('errors' in response.data) {
        return response
      }

      queryClient.invalidateQueries({ queryKey: ['all-settings'] })
    }
  })

  return {
    isUpdatingSettings: isPending,
    updateSettings: mutateAsync
  }
}
