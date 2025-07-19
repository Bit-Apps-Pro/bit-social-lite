import type platforms from '@config/platforms'

import request from '@common/helpers/request'
import { useQuery } from '@tanstack/react-query'

import { type CustomAppType } from '../AccountsType'

export default function useCustomApp(platform: keyof typeof platforms) {
  const { data, isLoading, refetch } = useQuery({
    queryFn: async () => request<CustomAppType[]>('custom-app', undefined, { platform }, 'GET'),
    queryKey: ['get-customApp'],
    refetchOnWindowFocus: false
  })

  return { customApps: data?.data, isLoadingCustomApp: isLoading, refetchCustomApp: refetch }
}
