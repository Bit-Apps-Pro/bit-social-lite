import { type AutoPostSettings } from '@common/globalStates/$autoPostSettings'
import request from '@common/helpers/request'
import { useMutation } from '@tanstack/react-query'

export default function useUpdateAutoPostSettings() {
  const { isPending, isSuccess, mutateAsync } = useMutation({
    mutationFn: async (autoPostSettings: AutoPostSettings) =>
      request('autoPostSettings/update', { autoPostSettings }, undefined, 'POST'),
    mutationKey: ['autoPostSettingsUpdate']
  })

  return {
    isSettingsUpdateSuccessfully: isSuccess,
    isUpdatingAutoPostSettings: isPending,
    updateAutoPostSettings: mutateAsync
  }
}
