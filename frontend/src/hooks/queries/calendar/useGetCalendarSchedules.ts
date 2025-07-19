import request from '@common/helpers/request'
import { type ScheduleType } from '@pages/Calendar/CalendarTypes'
import { useQuery } from '@tanstack/react-query'

export default function useGetCalendarSchedules(currentMonthYear: string) {
  const { data, isLoading, refetch } = useQuery({
    queryFn: async () =>
      request<ScheduleType[]>(
        'pro_calendar-schedules',
        undefined,
        { monthYear: currentMonthYear },
        'GET'
      ),
    queryKey: ['get-calendar-schedules', [currentMonthYear]],
    refetchOnWindowFocus: false
  })

  return {
    isLoadingSchedules: isLoading,
    refetchCalendarSchedules: refetch,
    schedules: data?.data || []
  }
}
