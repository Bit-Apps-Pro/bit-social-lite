import request from '@common/helpers/request'
import { type UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { type UploadFile } from 'antd'

export interface MediaType {
  dimension: number
  filesize: number
  height: number
  mimetype: string
  url: string
  width: number
}

export default function useMedia() {
  const { data, isLoading, refetch }: UseQueryResult<{ data: UploadFile[] }, Error> = useQuery({
    queryFn: async () => request(`all-media`, undefined, undefined, 'GET'),
    queryKey: ['media']
  })

  return {
    isLoadingMedia: isLoading,
    media: data?.data || [],
    refetchMedia: refetch
  }
}
