import request from '@common/helpers/request'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { type ShareNowDataType } from '../ShareNowType'

interface ShareNowQueryDataType {
  current_page: number
  current_total: number
  data: ShareNowDataType[]
  pages: number
  per_page: number
  total: number
}

export default function useShareNow(pageNumber: number, pageLimit: number) {
  const { data, isFetching, isLoading, refetch } = useQuery({
    enabled: !!pageLimit && !!pageNumber,
    placeholderData: keepPreviousData,
    queryFn: async () =>
      request<ShareNowQueryDataType>(
        `share-now/${pageNumber}/${pageLimit}`,
        undefined,
        undefined,
        'GET'
      ),
    queryKey: ['share-now', [pageNumber, pageLimit]],
    refetchInterval: 5000
  })

  const {
    current_page: currentPage,
    current_total: currentTotal,
    data: shareNowData,
    pages,
    per_page: perPage,
    total
  } = data?.data || {}

  return {
    currentPage,
    currentTotal,
    isFetchingShareNowList: isFetching,
    isLoadingShareNowList: isLoading,
    perPage,
    refetchShareNowList: refetch,
    shareNowData: shareNowData || [],
    totalPages: pages,
    totalShareNow: total
  }
}
