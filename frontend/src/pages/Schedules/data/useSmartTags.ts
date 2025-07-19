import request from '@common/helpers/request'
import { useQuery } from '@tanstack/react-query'

export type SmartTags = Record<
  string,
  {
    description: string
    key: string
    label: string
    type: string
  }
>

export default function useSmartTags() {
  const { data, isLoading } = useQuery({
    queryFn: async () => request<SmartTags>('smart-tags', undefined, undefined, 'GET'),
    queryKey: ['smart-tags']
  })

  return {
    isSmartTagsLoading: isLoading,
    smartTags: data?.data || {}
  }
}
