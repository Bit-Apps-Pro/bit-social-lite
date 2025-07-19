import request from '@common/helpers/request'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { type AllSettingsType } from './useSettings'

export interface ErrorType {
  errors: Record<string, string>
}

export type ProResponseType = AllSettingsType['proSettings'] | ErrorType

export default function useUpdateExternalCronSetting() {
  const queryClient = useQueryClient()

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (settings: AllSettingsType['proSettings']) =>
      request<ProResponseType>('pro_settings/external-cron/update', { settings }, undefined, 'POST'),
    onSuccess: response => {
      if ('errors' in response.data) {
        return response
      }

      queryClient.invalidateQueries({ queryKey: ['all-settings'] })
    }
  })

  return {
    isUpdatingProSettings: isPending,
    updateProSettings: mutateAsync
  }
}
