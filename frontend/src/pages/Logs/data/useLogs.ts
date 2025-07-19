import request from '@common/helpers/request'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { type LogsType } from '../LogsType'

interface LogsDataType {
  current_page: number
  current_total: number
  data: LogsType[]
  pages: number
  per_page: number
  total: number
}

export default function useLogs(pageNumber: number, pageLimit: number, filters: Record<string, string>) {
  const { data, isFetched, isFetching, isLoading, refetch } = useQuery<{ data: LogsDataType }>({
    enabled: !!pageLimit && !!pageNumber,
    placeholderData: keepPreviousData,
    queryFn: async () => request(`logs/${pageNumber}/${pageLimit}`, undefined, { ...filters }, 'GET'),
    queryKey: ['logs', [pageNumber, pageLimit]],
    refetchInterval: 3000
  })
  const {
    current_page: currentPage,
    current_total: currentTotal,
    data: logData,
    pages,
    per_page: perPage,
    total
  } = data?.data || {}

  return {
    currentPage,
    currentTotal,
    isFetched,
    isFetching,
    isLogsLoading: isLoading,
    logData: logData || [],
    perPage,
    refetch,
    totalLogs: total,
    totalPages: pages
  }
}
