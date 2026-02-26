import request from '@common/helpers/request'
import { useQuery } from '@tanstack/react-query'

interface TagInfo {
  description: string
  key: string
  label: string
  type: string
}

export interface SmartTags {
  advance: Record<string, TagInfo>
  post: Record<string, TagInfo>
  product: Record<string, TagInfo>
}

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
