import { type AutoPostSettings } from '@common/globalStates/$autoPostSettings'
import $autoPostSettings from '@common/globalStates/$autoPostSettings'
import request from '@common/helpers/request'
import { type UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'

export default function useAutoPostSettings() {
  const setAutoPostSettings = useSetAtom($autoPostSettings)

  const { data, isLoading }: UseQueryResult<AutoPostSettings, Error> = useQuery({
    queryFn: async () => {
      const { data: autoPostSettings } = await request<AutoPostSettings>(
        'autoPostSettings',
        undefined,
        undefined,
        'GET'
      )

      if (!autoPostSettings) {
        return []
      }
      setAutoPostSettings(autoPostSettings)
      return autoPostSettings
    },
    queryKey: ['autoPostSettings']
  })

  return {
    autoPostSettings: data,
    isLoadingAutoPostSettings: isLoading
  }
}
