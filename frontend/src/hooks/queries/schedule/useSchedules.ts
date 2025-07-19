import request from '@common/helpers/request'
import { type ScheduleType } from '@pages/Schedules/ScheduleType'
import { useQuery } from '@tanstack/react-query'

export interface GetSchedulesType {
  config: ScheduleType
  created_at: string
  human_readable_next_publish: string
  id: number
  name: string
  next_published_at: string
  schedule_type: number
  started_at: string
  status: number
}

export default function useSchedules() {
  const { data, isLoading, refetch } = useQuery({
    queryFn: async () => request<GetSchedulesType[]>(`schedule`, undefined, undefined, 'GET'),
    queryKey: [`all-schedules`]
  })
  return {
    isLoadingSchedules: isLoading,
    refetchSchedules: refetch,
    schedules: data?.data || []
  }
}
