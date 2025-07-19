import request from '@common/helpers/request'
import { useQuery } from '@tanstack/react-query'

export interface CategoryTagItem {
  id: number
  name: string
}

type CategoriesAndTagsType = Record<string, CategoryTagItem[]>

export default function useCategories(postType: string) {
  const { data, isLoading } = useQuery({
    queryFn: async () => request<CategoriesAndTagsType>('categories', undefined, { postType }, 'GET'),
    queryKey: ['categories', postType]
  })

  return { categoriesAndTags: data?.data, isLoadingCategories: isLoading }
}
