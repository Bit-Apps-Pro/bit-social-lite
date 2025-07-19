import request from '@common/helpers/request'
import { useQuery } from '@tanstack/react-query'

interface PostType {
  label: string
  name: string
}

export default function usePostTypes() {
  const { data, isLoading } = useQuery({
    queryFn: async () => request<PostType[]>('post-types', undefined, undefined, 'GET'),
    queryKey: ['post-types']
  })

  return { loadingPostType: isLoading, postTypes: data?.data }
}
