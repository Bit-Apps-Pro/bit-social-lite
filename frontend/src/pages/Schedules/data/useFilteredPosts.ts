import request from '@common/helpers/request'
import { useMutation } from '@tanstack/react-query'

import { type SchedulePostFiltersType } from '../ScheduleType'

export type UseFilteredPostsType = {
  label: string
  value: number
}[]

export default function useFilteredPosts() {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (postFilterInfo: Partial<SchedulePostFiltersType>) =>
      request<UseFilteredPostsType>('filtered-posts', { ...postFilterInfo }, undefined, 'POST')
  })

  return {
    loadingPostFilter: isPending,
    postFilter: (postFilterInfo: Partial<SchedulePostFiltersType>) => mutateAsync(postFilterInfo)
  }
}
