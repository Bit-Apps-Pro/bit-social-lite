import request from '@common/helpers/request'
import { type ScheduleType } from '@pages/Schedules/ScheduleType'
import { useQuery } from '@tanstack/react-query'

interface SearchedScheduleResponseType {
  current_page: number

  current_total: number
  data: {
    config: ScheduleType
    created_at: string
    human_readable_next_publish: string
    id: number
    name: string
    next_published_at: string
    started_at: string
    status: number
  }[]
  pages: number
  per_page: number
  total: number
}

export default function useSearchedSchedules(searchText: string, pageNumber: number, pageLimit: number) {
  const { data, isFetching, isLoading, refetch } = useQuery({
    queryFn: async () =>
      request<SearchedScheduleResponseType>(
        `schedule/${searchText}${searchText ? '/' : ''}${pageNumber}/${pageLimit}`,
        undefined,
        undefined,
        'GET'
      ),
    queryKey: [`get-schedules-${searchText}`, [pageNumber, pageLimit]],
    refetchInterval: 5000
  })

  const {
    current_page: currentPage,
    current_total: currentTotal,
    data: scheduleData,
    pages,
    per_page: perPage,
    total
  } = data?.data || {}

  return {
    currentPage,
    currentTotal,
    isFetchingSchedules: isFetching,
    isLoadingSchedules: isLoading,
    perPage,
    refetchSchedules: refetch,
    scheduleData: scheduleData || [],
    totalPages: pages,
    totalSchedule: total
  }
}
