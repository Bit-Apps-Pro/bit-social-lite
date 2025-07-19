import request from '@common/helpers/request'
import { useQuery } from '@tanstack/react-query'

interface SettingsType {
  cron: {
    isDemoCronEnabled: boolean
  }
}

interface ProSettingType {
  cron: {
    isExternalCronEnabled: boolean
  }
}

export interface AllSettingsType {
  proSettings: ProSettingType
  settings: SettingsType
}

export default function useSettings() {
  const { data, isLoading } = useQuery({
    queryFn: async () => request<AllSettingsType>('all-settings', undefined, undefined, 'GET'),
    queryKey: ['all-settings']
  })

  return {
    allSettings: data?.data,
    isLoadingSettings: isLoading
  }
}
